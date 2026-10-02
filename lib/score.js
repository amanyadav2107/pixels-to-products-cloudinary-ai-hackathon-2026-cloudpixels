import sharp from "sharp";
import cloudinary from "./cloudinary";

// Placeholder numbers. Person C ke verified numbers aane par yahan badlo.
const PRESETS = {
  amazon: { minSide: 1000, targetFill: 0.85, whiteBackground: true },
  instagram: { minSide: 1080, targetFill: 0.8, whiteBackground: false },
};

const POINTS = { resolution: 25, background: 35, fill: 30, square: 10 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchBuffer(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (i < tries - 1) await sleep(2000); // Cloudinary pending ho to retry
  }
  throw new Error("Image not ready");
}

async function readPixels(buf) {
  const { data, info } = await sharp(buf)
    .resize(600, 600, { fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

// Chaaron kono ke 5x5 patch safed hain ya nahi
function cornersWhite({ data, w, h }) {
  const spots = [[0, 0], [w - 5, 0], [0, h - 5], [w - 5, h - 5]];
  return spots.every(([sx, sy]) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = sy; y < sy + 5; y++) {
      for (let x = sx; x < sx + 5; x++) {
        const i = (y * w + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
    return r / n >= 235 && g / n >= 235 && b / n >= 235;
  });
}

// Product ka bounding box frame ka kitna hissa bharta hai (0 se 1)
function fillRatio({ data, w, h }, isObject) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isObject(data, (y * w + x) * 4)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return 0;
  return Math.max((maxX - minX + 1) / w, (maxY - minY + 1) / h);
}

const hasAlpha = (d, i) => d[i + 3] > 20;
const notWhite = (d, i) => d[i + 3] > 20 && (d[i] < 245 || d[i + 1] < 245 || d[i + 2] < 245);

export async function scoreImages({ upload, fixedUrl, presetId }) {
  const p = PRESETS[presetId] || PRESETS.amazon;
  const tolerance = 0.1;
  const reasons = [];
  let before = 100;
  let after = 100;

  // 1) Resolution (original size, isko fix nahi kar sakte)
  if (Math.min(upload.width, upload.height) < p.minSide) {
    before -= POINTS.resolution;
    after -= POINTS.resolution;
    reasons.push({
      issue: `Resolution is low (${upload.width} x ${upload.height}, need ${p.minSide}px)`,
      points: -POINTS.resolution,
      fixed: false,
    });
  }

  // BEFORE: original photo
  const orig = await readPixels(await fetchBuffer(upload.secure_url));

  if (p.whiteBackground && !cornersWhite(orig)) {
    before -= POINTS.background;
    reasons.push({ issue: "Background is not white", points: -POINTS.background, fixed: true });
  }

  if (upload.width !== upload.height) {
    before -= POINTS.square;
    reasons.push({ issue: "Image is not square", points: -POINTS.square, fixed: true });
  }

  try {
    const removedUrl = cloudinary.url(upload.public_id, {
      transformation: [{ effect: "background_removal" }, { fetch_format: "png" }],
    });
    const removed = await readPixels(await fetchBuffer(removedUrl));
    const fill = fillRatio(removed, hasAlpha);
    if (fill < p.targetFill - tolerance) {
      before -= POINTS.fill;
      reasons.push({
        issue: `Product fills only ${Math.round(fill * 100)}% of frame`,
        points: -POINTS.fill,
        fixed: true,
      });
    }
  } catch (e) {
    console.error("Fill (before) check skipped:", e?.message);
  }

  // AFTER: asli fixed image par wahi checks
  const fixed = await readPixels(await fetchBuffer(fixedUrl));

  if (p.whiteBackground && !cornersWhite(fixed)) after -= POINTS.background;
  if (fixed.w !== fixed.h) after -= POINTS.square;
  if (fillRatio(fixed, notWhite) < p.targetFill - tolerance) after -= POINTS.fill;

  return { before: Math.max(before, 0), after: Math.max(after, 0), reasons };
}