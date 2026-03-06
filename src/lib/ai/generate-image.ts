import openai from "./openai";

export async function generateCampaignImage(prompt: string): Promise<Buffer> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    response_format: "b64_json",
  });

  const b64 = response.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("No image data returned from DALL-E");
  }

  return Buffer.from(b64, "base64");
}
