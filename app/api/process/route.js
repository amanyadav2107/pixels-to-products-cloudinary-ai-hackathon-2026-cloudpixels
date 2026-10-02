import cloudinary from "../../../lib/cloudinary";
import {
  buildFixedUrl,
  buildDownloadUrl,
} from "../../../lib/chain";
export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const removePrompt = (form.get("removePrompt") || "").toString();
    const preset = (form.get("preset") || "amazon").toString();

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "lre" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });
    const fixedUrl = buildFixedUrl(
      uploadResult.public_id,
      removePrompt
    );
    const downloadUrl = buildDownloadUrl(
      uploadResult.public_id,
      removePrompt
    );
    console.log("FIXED URL:", fixedUrl);
    return Response.json({
      originalUrl: uploadResult.secure_url,
      fixedUrl,
      downloadUrl,
      preset,
      score: {
        before: 0,
        after: 0,
      },
      reasons: [],
    });
  }  catch (error) {
  console.error("PROCESS ERROR:", error?.message);
  console.error("PROCESS STACK:", error?.stack);
  return Response.json(
      {
        error: "Processing failed. Please try another photo.",
      },
      { status: 500 }
    );
  }
}