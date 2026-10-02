"use client";
import { useState } from "react";

export default function BeforeAfter({ before, after }) {
  const [pos, setPos] = useState(50);
  const img = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" };
  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#fff", overflow: "hidden" }}>
        <img src={after} alt="After" style={img} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={before} alt="Before" style={img} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: pos + "%", width: 2, background: "#2F6FED" }} />
      </div>
      <input type="range" min="0" max="100" value={pos}
        onChange={(e) => setPos(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span>Before</span><span>After</span>
      </div>
    </div>
  );
}