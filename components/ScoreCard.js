export default function ScoreCard({ score, reasons }) {
  return (
    <div>
      <h2>Readiness: {score.before} / 100 to {score.after} / 100</h2>
      <ul>
        {reasons.map((r, i) => (
          <li key={i}>
            {r.issue} ({r.points}) {r.fixed ? " - Fixed" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}