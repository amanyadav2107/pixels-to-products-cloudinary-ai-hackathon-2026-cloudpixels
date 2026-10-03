export default function ScoreCard({ reasons = [], score }) {
  const notCalculated =
    reasons.length === 0 && score && score.before === 0 && score.after === 0;
  const lost = reasons.reduce((s, r) => s + Math.abs(r.points || 0), 0);
  const fixedPts = reasons
    .filter((r) => r.fixed)
    .reduce((s, r) => s + Math.abs(r.points || 0), 0);

  return (
    <div>
      <h3 className="section-title">Why this score?</h3>

      {notCalculated && (
        <p className="muted">
          Score was not calculated. Stop the server (Ctrl + C), run npm run dev again and upload a new photo.
        </p>
      )}

      {!notCalculated && reasons.length === 0 && (
        <p style={{ color: "#22c55e" }}>No problems found. Every check passed.</p>
      )}

      {reasons.length > 0 && (
        <>
          <p className="muted" style={{ marginTop: 0 }}>
            Your original photo lost <b>{lost}</b> points. We fixed <b>{fixedPts}</b> of them.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {reasons.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,.1)",
                }}
              >
                <span style={{ fontWeight: 700, color: r.fixed ? "#22c55e" : "#f59e0b" }}>
                  {r.fixed ? "✓" : "!"}
                </span>
                <div style={{ flex: 1 }}>
                  <div>{r.issue}</div>
                  <small className="muted">
                    {r.fixed
                      ? "Fixed in the new photo"
                      : "We cannot fix this. Retake the photo at a higher resolution."}
                  </small>
                </div>
                <b style={{ color: "#f87171" }}>{r.points}</b>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}