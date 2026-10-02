import cloudinary from "./cloudinary";

export function buildFixedUrl(publicId, removePrompt) {
  const steps = [];

  if (removePrompt) {
    steps.push({
      effect: "gen_remove:prompt_" + removePrompt,
    });
  }

  steps.push({
    effect: "background_removal",
  });

  steps.push({
    effect: "trim",
  });

  steps.push({
    width: 850,
    height: 850,
    crop: "pad",
  });

  steps.push({
    width: 1000,
    height: 1000,
    crop: "pad",
    background: "white",
  });

  steps.push({
    fetch_format: "auto",
    quality: "auto",
  });

  return cloudinary.url(publicId, {
    transformation: steps,
  });
}

export function buildDownloadUrl(publicId, removePrompt) {
  return buildFixedUrl(publicId, removePrompt).replace(
    "/upload/",
    "/upload/fl_attachment/"
  );
}