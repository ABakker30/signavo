import openai from "./openai";

interface ImagePromptInput {
  topic: string;
  slides: Array<{ headline: string; body: string }>;
  brandTone: string;
  industry: string;
  region?: string;
  imageMood?: string;
}

export async function generateImagePrompt(input: ImagePromptInput): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at crafting DALL-E 3 image prompts for professional social media carousel backgrounds.

CRITICAL RULES:
- The image MUST directly represent the campaign's SUBJECT MATTER. Do NOT default to generic landscapes or nature scenes.
- If the campaign is about an event at a bar → show a vibrant bar/venue scene
- If it's about military appreciation → include patriotic elements (flags, red/white/blue, medals)
- If it's about real estate → show the type of property or neighborhood
- If it's about a market report → show the relevant market setting
- ALWAYS match the image to WHAT the campaign is actually about
- Generate ONE prompt for a single background image
- The image must work as a background with text overlaid — keep composition clean with open/blurred areas for text readability
- No text, no letters, no words, no numbers in the image
- No recognizable people's faces (silhouettes or distant figures are OK)
- The image must be BRIGHT, VIBRANT, and WELL-LIT
- Use vivid, saturated colors
- Specify "professional photograph" style for realism
- Output ONLY the prompt text, nothing else

Examples of GOOD topic-to-image matching:
- "Freedom Friday military appreciation at a bar" → vibrant bar interior with American flags, patriotic bunting, warm festive lighting, red white and blue accents
- "New luxury listing in Virginia Beach" → bright aerial view of a waterfront luxury home with pool
- "Weekly market update for Hampton Roads" → clean bright cityscape of Hampton Roads waterfront
- "Open house this weekend" → inviting front entrance of a beautiful home, bright daylight
- "Community charity event" → festive community gathering setup with decorations`,
      },
      {
        role: "user",
        content: `Create a DALL-E 3 background image prompt for this campaign:

Campaign topic: ${input.topic}
${input.imageMood ? `Desired image mood: ${input.imageMood}` : ""}
Industry: ${input.industry}
Region: ${input.region || "not specified"}
Brand tone: ${input.brandTone}

Slide headlines:
${input.slides.map((s, i) => `${i + 1}. ${s.headline}`).join("\n")}

Slide details:
${input.slides.map((s, i) => `${i + 1}. ${s.body}`).join("\n")}

Remember: the image must DIRECTLY represent the subject matter above. Do NOT use a generic landscape.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
