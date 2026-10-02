"use client";
import { useState } from "react";

export default function CaptionBox({ preset }) {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [out, setOut] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const n = name.trim();
    if (!n) return;
    const f = features.split(",").map((s) => s.trim()).filter(Boolean);
    if (preset === "instagram") {
      const tag = n.toLowerCase().replace(/[^a-z0-9]+/g, "");
      setOut(`${n}${f.length ? " - " + f.slice(0, 3).join(" | ") : ""}\n\nNow available. Tap the link in bio to order.\n\n#${tag} #newarrival #shopsmall`);
    } else {
      setOut(`${n}${f.length ? " - " + f.join(", ") : ""}\n\n${f.map((x) => "- " + x).join("\n")}`);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="stack">
      <h3 className="section-title">Listing caption <span className="muted">(template draft, edit before use)</span></h3>
      <input type="text" placeholder="Product name, for example Blue cotton t-shirt" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Features, comma separated: 100% cotton, regular fit, machine washable" value={features} onChange={(e) => setFeatures(e.target.value)} />
      <div className="row">
        <button className="btn btn-primary" onClick={generate} disabled={!name.trim()}>Generate caption</button>
        {out && <button className="btn btn-ghost" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>}
      </div>
      {out && <textarea className="caption-out" value={out} onChange={(e) => setOut(e.target.value)} />}
    </div>
  );
}