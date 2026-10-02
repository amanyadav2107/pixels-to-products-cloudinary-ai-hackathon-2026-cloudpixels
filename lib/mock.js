export const mockResult = {
  originalUrl: "/samples/before.jpg",
  fixedUrl: "/samples/after.png",
  downloadUrl: "/samples/after.png",
  preset: "amazon",
  score: { before: 42, after: 91 },
  reasons: [
    { issue: "Background is not white", points: -30, fixed: true },
    { issue: "Product fills only 30% of frame", points: -20, fixed: true },
  ],
};