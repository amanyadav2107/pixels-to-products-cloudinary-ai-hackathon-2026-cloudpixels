import BeforeAfter from "@/components/BeforeAfter";
import ScoreCard from "@/components/ScoreCard";
import { mockResult } from "@/lib/mock";

export default function Home() {
  const result = mockResult;
  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Listing Readiness Engine</h1>
      <BeforeAfter before={result.originalUrl} after={result.fixedUrl} />
      <ScoreCard score={result.score} reasons={result.reasons} />
      <a href={result.downloadUrl} download>Download</a>
    </main>
  );
}