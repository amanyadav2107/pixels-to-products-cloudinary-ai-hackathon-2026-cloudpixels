import cloudinary from "./cloudinary";

const MARK = "REMOVEPLACEHOLDER";

export function buildFixedUrl(publicId, removePrompt, { enhance = true, cutout = true } = {}) {
  const steps = [];

  const items = (removePrompt || "")
    .split(",")
    .map((s) => s.replace(/[;()_]/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 4);

  // Har object ke liye alag pass (zyada bharosemand)
  items.forEach((_, i) => steps.push({ effect: "gen_remove:prompt_" + MARK + i }));

  if (enhance) steps.push({ effect: "improve:indoor:50" });

  if (cutout) {
    steps.push({ effect: "background_removal" });
    steps.push({ effect: "trim" });
    steps.push({ width: 850, height: 850, crop: "pad" });
    steps.push({ width: 1000, height: 1000, crop: "pad", background: "white" });
  } else {
    // Photo rakho, bina safed patti ke square karo
    steps.push({ width: 1000, height: 1000, crop: "fill", gravity: "auto" });
  }

  steps.push({ fetch_format: "auto", quality: "auto" });

  let url = cloudinary.url(publicId, { transformation: steps });
  items.forEach((s, i) => {
    url = url.replace(MARK + i, encodeURIComponent(s));
  });
  return url;
}

export function buildDownloadUrl(publicId, removePrompt, opts) {
  return buildFixedUrl(publicId, removePrompt, opts).replace(
    "/upload/",
    "/upload/fl_attachment/"
  );
}