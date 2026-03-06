import openai from "./openai";

interface ImagePromptInput {
  topic: string;
  slides: Array<{ headline: string; body: string }>;
  brandTone: string;
  industry: string;
  region?: string;
}

export async function generateImagePrompt(input: ImagePromptInput): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at crafting DALL-E 3 image prompts for professional social media carousel backgrounds.

Rules:
- Generate ONE prompt for a single background image that will be used across all slides
- The image must work as a background with text overlaid on top, so avoid busy center compositions
- No text, no letters, no words, no numbers in the image
- No people's faces (headshots will be overlaid separately)
- The image should evoke the MOOD and TOPIC of the campaign
- IMPORTANT: The image must be BRIGHT, VIBRANT, and WELL-LIT — use natural daylight, golden hour, or bright blue skies. Avoid dark, moody, or dimly lit scenes
- Include specific color palette guidance matching the brand tone
- Specify "professional photograph" or "editorial illustration" style
- Use vivid, saturated colors and high dynamic range
- Keep composition clean with open space (sky, light areas) especially in the lower half where text will be overlaid
- Output ONLY the prompt text, nothing else

Brand tone mapping:
- "professional" → clean, bright, trustworthy, blue sky, crisp daylight
- "premium" → luxurious, golden hour warmth, rich warm tones, bright and elegant
- "friendly" → sunny, inviting, bright natural light, warm cheerful tones
- "direct" → bold, vivid colors, high contrast, bright modern aesthetic`,
      },
      {
        role: "user",
        content: `Create a DALL-E 3 background image prompt for this campaign:

Industry: ${input.industry}
Region: ${input.region || "not specified"}
Brand tone: ${input.brandTone}
Campaign topic: ${input.topic}

Slide headlines:
${input.slides.map((s, i) => `${i + 1}. ${s.headline}`).join("\n")}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
