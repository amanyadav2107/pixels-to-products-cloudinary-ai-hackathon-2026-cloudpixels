"use client";
import { useRef, useState } from "react";

export default function UploadZone({ file, preview, onFile, onInvalid }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  function handle(f) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      onInvalid && onInvalid("Please choose an image file (JPG or PNG).");
      return;
    }
    onFile(f);
  }

  return (
    <div
      className={"dropzone" + (drag ? " drag" : "")}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files[0])} />
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="dz-preview" />
          <p className="dz-name">{file.name} · click to change</p>
        </>
      ) : (
        <>
          <div className="dz-icon">📷</div>
          <p className="dz-title">Drop your product photo here</p>
          <p className="dz-sub">or click to browse · JPG, PNG</p>
        </>
      )}
    </div>
  );
}