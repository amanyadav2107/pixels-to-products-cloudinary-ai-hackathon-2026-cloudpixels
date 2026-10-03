import cloudinary from "./cloudinary";

export function buildFixedUrl(publicId) {
  return cloudinary.url(publicId, {
    secure: true,
  });
}

export function buildDownloadUrl(publicId) {
  return buildFixedUrl(publicId).replace(
    "/upload/",
    "/upload/fl_attachment/"
  );
}
