import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const base64 = buffer.toString("base64");

    const imageUrl = `data:${file.type};base64,${base64}`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Analyze this product photo for an e-commerce listing.

Identify visible problems such as:
- stains or dirt on the product
- unwanted objects
- messy or distracting background
- product partially cut off
- poor framing
- product too small in the image
- text, watermark or promotional elements
- anything else that makes the image less suitable for an e-commerce listing

Do NOT assume a problem exists if you cannot see it.

Return ONLY valid JSON in this format:

{
  "product": "what the main product is",
  "issues": [
    {
      "type": "stain | unwanted_object | background | framing | text | other",
      "description": "what you can actually see",
      "severity": "low | medium | high"
    }
  ]
}
              `,
            },
            {
              type: "input_image",
              image_url: imageUrl,
            },
          ],
        },
      ],
    });

    const text = response.output_text;

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      return Response.json(
        {
          error: "AI returned invalid JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    return Response.json(analysis);
  } catch (error) {
    console.error("AI ANALYSIS ERROR:", error);

    return Response.json(
      {
        error: "AI analysis failed",
      },
      { status: 500 }
    );
  }
}