"use client";
import { useState } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import ScoreCard from "@/components/ScoreCard";
import { mockResult } from "@/lib/mock";

const STEPS = ["Analysing", "Removing objects", "Cleaning background", "Finalising"];

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePrompt, setRemovePrompt] = useState("");
  const [preset, setPreset] = useState("amazon");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function onPick(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setRemovePrompt("");
    setResult(null);
    setError("");
    setStatus("idle");
  }

  async function run() {
    if (!file) return;
    setStatus("loading");
    setStepIdx(0);
    const timer = setInterval(() => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1)), 2500);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("removePrompt", removePrompt);
    fd.append("preset", preset);
    try {
      const res = await fetch("/api/process", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try another photo.");
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try another photo.");
      setStatus("error");
    } finally {
      clearInterval(timer);
    }
  }

  function demo() {
    setResult(mockResult);
    setStatus("done");
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Listing Readiness Engine</h1>
      <p>Upload a product photo. We score it, explain what is wrong, and fix it for your marketplace.</p>

      {status === "idle" && (
        <div style={{ display: "grid", gap: 12 }}>
          <input type="file" accept="image/*" onChange={onPick} />
          {preview && <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }} />}
          <input
            type="text"
            placeholder="What should we remove? (for example hand)"
            value={removePrompt}
            onChange={(e) => setRemovePrompt(e.target.value)}
            style={{ padding: 8 }}
          />
          <select value={preset} onChange={(e) => setPreset(e.target.value)} style={{ padding: 8 }}>
            <option value="amazon">Amazon main image</option>
            <option value="instagram">Instagram post</option>
          </select>
          <button onClick={run} disabled={!file} style={{ padding: 12 }}>Make it listing-ready</button>
          <button onClick={demo} style={{ padding: 8 }}>Try demo</button>
        </div>
      )}

      {status === "loading" && (
        <div>
          <p>{STEPS[stepIdx]}...</p>
          <button disabled style={{ padding: 12 }}>Processing...</button>
        </div>
      )}

      {status === "done" && result && (
        <div>
          <BeforeAfter before={result.originalUrl} after={result.fixedUrl} />
          <ScoreCard score={result.score} reasons={result.reasons} />
          <p>Preset: {result.preset}</p>
          <a href={result.downloadUrl} download>Download</a>
          <div><button onClick={reset} style={{ marginTop: 12, padding: 8 }}>Try another photo</button></div>
        </div>
      )}

      {status === "error" && (
        <div>
          <p>{error}</p>
          <button onClick={reset} style={{ padding: 8 }}>Try again</button>
        </div>
      )}
    </main>
  );
}