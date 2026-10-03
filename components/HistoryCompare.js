"use client";
import { useEffect, useState } from "react";
import { loadHistory } from "@/lib/history";

// Hidden for now. Set to true to show the compare section again.
const SHOW_HISTORY = false;

export default function HistoryCompare() {
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState([]);

  useEffect(() => { setItems(loadHistory()); }, []);
  if (!SHOW_HISTORY || items.length < 2) return null;

  const toggle = (id) =>
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 2 ? [s[1], id] : [...s, id]));
  const picked = items.filter((i) => sel.includes(i.id));

  return (
    <div className="card stack" style={{ marginTop: 24 }}>
      <h3 className="section-title">Compare with your previous photos <span className="muted">(pick two)</span></h3>
      <div className="hist">
        {items.map((i) => (
          <button key={i.id} className={"hist-item" + (sel.includes(i.id) ? " sel" : "")} onClick={() => toggle(i.id)}>
            <img src={i.fixedUrl} alt="Previous result" />
            <small>{i.score.before} to {i.score.after}</small>
          </button>
        ))}
      </div>
      {picked.length === 2 && (
        <div className="side">
          {picked.map((p) => (
            <figure key={p.id}>
              <img src={p.fixedUrl} alt="Selected" />
              <figcaption>Score {p.score.after}/100 ({p.preset}) · gained {p.score.after - p.score.before}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}