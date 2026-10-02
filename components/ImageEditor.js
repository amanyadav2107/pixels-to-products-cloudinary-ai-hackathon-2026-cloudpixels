"use client";
import { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const RATIOS = [
  { label: "Free", value: undefined },
  { label: "Square", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "Wide", value: 16 / 9 },
];

function startCrop(width, height, aspect) {
  if (!aspect) return { unit: "%", x: 5, y: 5, width: 90, height: 90 };
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
    width,
    height
  );
}

async function buildFile(img, crop, f, name) {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const sx = crop ? (crop.x / 100) * nw : 0;
  const sy = crop ? (crop.y / 100) * nh : 0;
  const sw = crop ? (crop.width / 100) * nw : nw;
  const sh = crop ? (crop.height / 100) * nh : nh;

  const scale = Math.min(1, 2000 / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.95));
  return new File([blob], name.replace(/\.[^.]+$/, "") + "-edited.jpg", { type: "image/jpeg" });
}

export default function ImageEditor({ src, name, onDone, onCancel }) {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [aspect, setAspect] = useState(undefined);
  const [f, setF] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [busy, setBusy] = useState(false);

  const filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
  const set = (k) => (e) => setF({ ...f, [k]: Number(e.target.value) });

  function onLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(startCrop(width, height, aspect));
  }

  function chooseAspect(value) {
    setAspect(value);
    const img = imgRef.current;
    if (img) setCrop(startCrop(img.width, img.height, value));
  }

  function resetCrop() {
    const img = imgRef.current;
    if (img) setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
  }

  async function apply() {
    const img = imgRef.current;
    if (!img) return;
    setBusy(true);
    try {
      const useCrop = crop && crop.width > 0 && crop.height > 0 ? crop : null;
      onDone(await buildFile(img, useCrop, f, name));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card editor">
      <h3 className="section-title">Crop and adjust</h3>
      <p className="muted" style={{ margin: 0 }}>
        Box ke kone ya kinare kheench kar apne hisaab se crop karo. Box ko beech se pakad ke hila bhi sakte ho.
      </p>

      <div style={{ display: "flex", justifyContent: "center", background: "#000", borderRadius: 12, padding: 8 }}>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          aspect={aspect}
          keepSelection
          minWidth={30}
          minHeight={30}
        >
          <img
            ref={imgRef}
            src={src}
            alt="Crop preview"
            onLoad={onLoad}
            style={{ maxHeight: 460, maxWidth: "100%", filter }}
          />
        </ReactCrop>
      </div>

      <div className="row">
        {RATIOS.map((r) => (
          <button
            key={r.label}
            type="button"
            className={"btn " + (aspect === r.value ? "btn-primary" : "btn-ghost")}
            onClick={() => chooseAspect(r.value)}
          >
            {r.label}
          </button>
        ))}
        <button type="button" className="btn btn-ghost" onClick={resetCrop}>Full photo</button>
      </div>

      <div className="sliders">
        <div className="slider-row">
          <span>Brightness</span>
          <input type="range" min="60" max="150" value={f.brightness} onChange={set("brightness")} />
          <span>{f.brightness}</span>
        </div>
        <div className="slider-row">
          <span>Contrast</span>
          <input type="range" min="60" max="150" value={f.contrast} onChange={set("contrast")} />
          <span>{f.contrast}</span>
        </div>
        <div className="slider-row">
          <span>Colour</span>
          <input type="range" min="0" max="200" value={f.saturation} onChange={set("saturation")} />
          <span>{f.saturation}</span>
        </div>
      </div>

      <div className="row">
        <button className="btn btn-ghost" onClick={() => setF({ brightness: 112, contrast: 108, saturation: 105 })}>Quick enhance</button>
        <button className="btn btn-ghost" onClick={() => setF({ brightness: 100, contrast: 100, saturation: 100 })}>Reset</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={apply} disabled={busy} style={{ flex: 1 }}>
          {busy ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
}