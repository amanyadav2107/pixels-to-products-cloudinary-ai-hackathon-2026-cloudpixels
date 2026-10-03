import cloudinary from "../../../lib/cloudinary";
import { buildFixedUrl, buildDownloadUrl } from "../../../lib/chain";
import { scoreImages } from "../../../lib/score";

export const maxDuration = 60;

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const removePrompt = (form.get("removePrompt") || "").toString();
    const preset = (form.get("preset") || "amazon").toString();
    const enhance = (form.get("enhance") || "1").toString() === "1";
    const cutout = (form.get("cutout") || "1").toString() === "1";

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "lre" }, (error, result) =>
          error ? reject(error) : resolve(result)
        )
        .end(buffer);
    });

    const opts = { enhance, cutout };
    const id = uploadResult.public_id;

    let usedPrompt = removePrompt;
    let removalFailed = false;
    let fixedUrl = buildFixedUrl(id, usedPrompt, opts);
    console.log("FIXED URL:", fixedUrl);

    let scored;
    try {
      scored = await scoreImages({ upload: uploadResult, fixedUrl, presetId: preset });
    } catch (e) {
      if (!removePrompt.trim()) throw e;
      console.error("Object removal failed, retrying without it:", e?.message);
      removalFailed = true;
      usedPrompt = "";
      fixedUrl = buildFixedUrl(id, usedPrompt, opts);
      scored = await scoreImages({ upload: uploadResult, fixedUrl, presetId: preset });
    }

    const downloadUrl = buildDownloadUrl(id, usedPrompt, opts);

    return Response.json({
      originalUrl: uploadResult.secure_url,
      fixedUrl,
      downloadUrl,
      preset,
      removalFailed,
      score: { before: scored.before, after: scored.after },
      reasons: scored.reasons,
    });
  } catch (error) {
    console.error("PROCESS ERROR:", error?.message);
    console.error("PROCESS STACK:", error?.stack);
    return Response.json(
      { error: "Processing failed. Please try another photo." },
      { status: 500 }
    );
  }
}