"use client";
import { useState } from "react";
import Cropper from "react-easy-crop";

async function buildFile(src, area, f, name) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
  const scale = Math.min(1, 2000 / area.width);
  const w = Math.round(area.width * scale);
  const h = Math.round(area.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
  return new File([blob], name.replace(/\.[^.]+$/, "") + "-edited.jpg", { type: "image/jpeg" });
}

export default function ImageEditor({ src, name, onDone, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [f, setF] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [busy, setBusy] = useState(false);

  const filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
  const set = (k) => (e) => setF({ ...f, [k]: Number(e.target.value) });

  async function apply() {
    if (!area) return;
    setBusy(true);
    try { onDone(await buildFile(src, area, f, name)); } finally { setBusy(false); }
  }

  return (
    <div className="card editor">
      <h3 className="section-title">Crop and adjust</h3>
      <div className="crop-area">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, px) => setArea(px)}
          style={{ mediaStyle: { filter } }}
        />
      </div>
      <div className="sliders">
        <div className="slider-row"><span>Zoom</span>
          <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          <span>{zoom.toFixed(1)}x</span></div>
        <div className="slider-row"><span>Brightness</span>
          <input type="range" min="60" max="150" value={f.brightness} onChange={set("brightness")} />
          <span>{f.brightness}</span></div>
        <div className="slider-row"><span>Contrast</span>
          <input type="range" min="60" max="150" value={f.contrast} onChange={set("contrast")} />
          <span>{f.contrast}</span></div>
        <div className="slider-row"><span>Colour</span>
          <input type="range" min="0" max="200" value={f.saturation} onChange={set("saturation")} />
          <span>{f.saturation}</span></div>
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