"use client";
import { useEffect, useState } from "react";

function ringColor(v) {
  return v >= 80 ? "#16a34a" : v >= 60 ? "#f59e0b" : "#dc2626";
}

export default function ScoreGauge({ before, after }) {
  const [val, setVal] = useState(before);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1200;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(before + (after - before) * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [before, after]);

  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <div className="gauge">
      <svg viewBox="0 0 180 180" width="180" height="180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#e8ecf5" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke={ringColor(val)} strokeWidth="14"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - val / 100)}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="92" textAnchor="middle" fontSize="44" fontWeight="800" fill="#1a1f36">{val}</text>
        <text x="90" y="116" textAnchor="middle" fontSize="13" fill="#5b6478">out of 100</text>
      </svg>
      <div className="gauge-caption">
        <span className="chip chip-bad">Before {before}</span>
        <span className="arrow">→</span>
        <span className="chip chip-good">After {after}</span>
      </div>
      <div className="gain">+{after - before} points</div>
    </div>
  );
}