export default function Steps({ steps, active }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s} className={"step" + (i < active ? " done" : "") + (i === active ? " active" : "")}>
          <span className="dot">{i < active ? "✓" : i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}