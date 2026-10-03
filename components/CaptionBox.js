"use client";
import { useState } from "react";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function joinList(list) {
  if (list.length <= 1) return list.join("");
  return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
}

function build(preset, name, featuresText) {
  const n = name.trim();
  const feats = featuresText.split(",").map((s) => s.trim()).filter(Boolean);
  if (!n) return "";

  const highlights = feats.length ? "Key highlights: " + joinList(feats) + "." : "";

  if (preset === "instagram") {
    const tags = [...new Set(
      n.toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z0-9]/g, "")).filter((w) => w.length > 2)
    )].map((w) => "#" + w);
    return [
      "New in: " + n + " ✨",
      "",
      "Meet the " + n + ". " + highlights,
      "A simple, easy pick you will actually want to use. Swipe to see the details.",
      "",
      "Love it? Tap the link in our bio to order, and tell us what you think in the comments.",
      "",
      [...tags, "#newin", "#shopsmall", "#smallbusiness"].join(" "),
    ].join("\n");
  }

  // Amazon
  const title = cap(n) + (feats.length ? " - " + feats.slice(0, 3).map(cap).join(", ") : "");
  const bullets = feats.map((f) => "• " + cap(f));
  while (bullets.length < 3) {
    bullets.push(
      ["• Check the photos for exact colour, shape and details", "• Simple, practical design for everyday use", "• Easy to order and ready to ship"][bullets.length % 3]
    );
  }
  return [
    "TITLE",
    title,
    "",
    "BULLET POINTS",
    ...bullets.slice(0, 5),
    "",
    "DESCRIPTION",
    "Meet the " + n + ". " + highlights + " A reliable choice for buyers who want " + n + " without the fuss. Please review the images for the exact look and details before ordering.",
  ].join("\n");
}

export default function CaptionBox({ preset }) {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setText(build(preset, name, features));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="stack">
      <h3 className="section-title">
        Listing caption <span className="muted">(template draft, edit before use)</span>
      </h3>
      <input
        type="text"
        placeholder="Product name, for example Blue cotton t-shirt"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Features, comma separated: 100% cotton, regular fit, machine washable"
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
      />
      <button className="btn btn-ghost" onClick={generate} disabled={!name.trim()}>
        Generate caption
      </button>
      {text && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            style={{ width: "100%" }}
          />
          <button className="btn btn-ghost" onClick={copy}>{copied ? "Copied!" : "Copy caption"}</button>
        </>
      )}
      <small className="muted">Tip: add size, material and care details in the features box so the caption stays accurate.</small>
    </div>
  );
}