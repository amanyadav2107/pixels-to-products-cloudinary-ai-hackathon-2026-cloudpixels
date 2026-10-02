"use client";
import { useState } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import ScoreCard from "@/components/ScoreCard";
import ScoreGauge from "@/components/ScoreGauge";
import UploadZone from "@/components/UploadZone";
import Steps from "@/components/Steps";
import ImageEditor from "@/components/ImageEditor";
import CaptionBox from "@/components/CaptionBox";
import HistoryCompare from "@/components/HistoryCompare";
import { saveResult } from "@/lib/history";
import { mockResult } from "@/lib/mock";

const STEPS = ["Analysing your photo", "Removing objects", "Cleaning background", "Finalising"];
const PRESETS = [
  { id: "amazon", label: "Amazon", sub: "Main image" },
  { id: "instagram", label: "Instagram", sub: "Post" },
];

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePrompt, setRemovePrompt] = useState("");
  const [preset, setPreset] = useState("amazon");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [view, setView] = useState("slider");
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  function onFile(f) {
    setNotice("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onEdited(f) {
    onFile(f);
    setEditing(false);
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setRemovePrompt("");
    setResult(null);
    setError("");
    setNotice("");
    setView("slider");
    setEditing(false);
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
      saveResult(data);
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

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(result.fixedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <>
      <header className="nav">
        <div className="nav-in">
          <a href="#top" className="brand" onClick={reset}><span className="brand-dot" />ListingFix</a>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button className="btn btn-primary nav-cta" onClick={demo}>Try demo</button>
        </div>
      </header>

      <main className="page">
        {status === "idle" && editing && (
          <div className="card stack" style={{ maxWidth: 640, margin: "24px auto" }}>
            <h3 className="section-title">Crop and adjust</h3>
            <ImageEditor file={file} onDone={onEdited} onCancel={() => setEditing(false)} />
          </div>
        )}

        {status === "idle" && !editing && (
          <>
            <section className="landing" id="top">
              <div>
                <span className="eyebrow">Photo audit for online sellers</span>
                <h1>Marketplace rejects your photos? <span>Fix them in one click.</span></h1>
                <p className="lead">Upload a phone photo and get a score, the reasons behind it, and a cleaned-up version ready to list.</p>
              </div>

              <div className="card stack upload-card">
                <UploadZone file={file} preview={preview} onFile={onFile} onInvalid={setNotice} />
                {file && <button className="btn btn-ghost" onClick={() => setEditing(true)}>Crop and adjust brightness</button>}
                {notice && <div className="notice">{notice}</div>}

                <div>
                  <label className="label">What should we remove? (optional)</label>
                  <input type="text" placeholder="for example: hand, cup" value={removePrompt} onChange={(e) => setRemovePrompt(e.target.value)} />
                </div>

                <div>
                  <label className="label">Marketplace</label>
                  <div className="presets">
                    {PRESETS.map((p) => (
                      <button key={p.id} type="button" className={"preset" + (preset === p.id ? " active" : "")} onClick={() => setPreset(p.id)}>
                        <b>{p.label}</b><small>{p.sub}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="row">
                  <button className="btn btn-primary" onClick={run} disabled={!file} style={{ flex: 1 }}>Make it listing-ready</button>
                  <button className="btn btn-ghost" onClick={demo}>Try demo</button>
                </div>
              </div>
            </section>

            <section className="section" id="features">
              <h2 className="sec-title">What you get</h2>
              <div className="grid4">
                <div className="card"><div className="ico">📊</div><h4>Photo score</h4><p>A 0-100 score with every lost point explained.</p></div>
                <div className="card"><div className="ico">🧹</div><h4>Object removal</h4><p>Hands, cups and clutter removed with AI.</p></div>
                <div className="card"><div className="ico">⬜</div><h4>Clean background</h4><p>White, centred, sized to marketplace rules.</p></div>
                <div className="card"><div className="ico">🕘</div><h4>History compare</h4><p>Pick two past photos and compare scores.</p></div>
              </div>
            </section>

            <section className="section" id="how">
              <h2 className="sec-title">How it works</h2>
              <div className="how">
                <div className="card"><div className="how-num">1</div><h4>Upload</h4><p>Add a photo, crop it, pick a marketplace.</p></div>
                <div className="card"><div className="how-num">2</div><h4>Analyse</h4><p>We check it against the image rules.</p></div>
                <div className="card"><div className="how-num">3</div><h4>Download</h4><p>Get the fixed photo with a new score.</p></div>
              </div>
            </section>

            <section className="section" id="faq">
              <h2 className="sec-title">FAQ</h2>
              <div className="faq">
                <details><summary>Is my photo stored?</summary><p>Only a small history is kept in your browser. Nothing is saved on a server by us.</p></details>
                <details><summary>Which marketplaces are supported?</summary><p>Amazon and Instagram presets for now.</p></details>
                <details><summary>What file types work?</summary><p>JPG, PNG and WebP phone photos.</p></details>
              </div>
            </section>

            <HistoryCompare />
          </>
        )}

        {status === "loading" && (
          <div className="card stack" style={{ maxWidth: 480, margin: "40px auto" }}>
            <h3 className="section-title">Making your photo listing-ready</h3>
            <Steps steps={STEPS} active={stepIdx} />
            <p className="muted">This can take a few seconds.</p>
          </div>
        )}

        {status === "done" && result && (
          <>
            <div className="result-grid">
              <div className="card">
                <div className="tabs">
                  <button className={"tab" + (view === "slider" ? " active" : "")} onClick={() => setView("slider")}>Slider</button>
                  <button className={"tab" + (view === "side" ? " active" : "")} onClick={() => setView("side")}>Side by side</button>
                </div>
                {view === "slider" ? (
                  <div className="viewer"><BeforeAfter before={result.originalUrl} after={result.fixedUrl} /></div>
                ) : (
                  <div className="side">
                    <figure><img src={result.originalUrl} alt="Before" /><figcaption>Before</figcaption></figure>
                    <figure><img src={result.fixedUrl} alt="After" /><figcaption>After</figcaption></figure>
                  </div>
                )}
                <p className="muted" style={{ marginBottom: 0 }}>Marketplace: <b>{result.preset}</b></p>
              </div>

              <div className="stack">
                <div className="card"><ScoreGauge before={result.score.before} after={result.score.after} /></div>
                <div className="card"><ScoreCard reasons={result.reasons} /></div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}><CaptionBox preset={result.preset} /></div>

            <div className="row" style={{ marginTop: 16, justifyContent: "center" }}>
              <a className="btn btn-success" href={result.downloadUrl} download>Download listing-ready image</a>
              <button className="btn btn-ghost" onClick={copyLink}>{copied ? "Copied!" : "Copy image link"}</button>
              <button className="btn btn-ghost" onClick={reset}>Try another photo</button>
            </div>
          </>
        )}

        {status === "error" && (
          <div className="card error-box stack" style={{ maxWidth: 480, margin: "40px auto" }}>
            <h3 className="section-title">We could not process this photo</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={reset}>Try again</button>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <span>© 2026 ListingFix. Scores come from visible rules. We reduce rejection risk, we do not guarantee approval.</span>
        <span>Built with Next.js and Cloudinary</span>
      </footer>
    </>
  );
}