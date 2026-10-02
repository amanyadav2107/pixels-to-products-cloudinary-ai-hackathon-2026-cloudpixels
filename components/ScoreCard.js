export default function ScoreCard({ reasons }) {
  const fixedCount = reasons.filter((r) => r.fixed).length;
  return (
    <div>
      <h3 className="section-title">
        What we found <span className="muted">({fixedCount} of {reasons.length} fixed)</span>
      </h3>
      <ul className="reasons">
        {reasons.map((r, i) => (
          <li key={i} className="reason">
            <span className="pts">{r.points}</span>
            <span className="reason-text">{r.issue}</span>
            <span className={"tag " + (r.fixed ? "tag-fixed" : "tag-open")}>
              {r.fixed ? "Fixed" : "Needs retake"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}