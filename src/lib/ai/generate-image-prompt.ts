import openai from "./openai";

interface ImagePromptInput {
  topic: string;
  slides: Array<{ headline: string; body: string }>;
  brandTone: string;
  industry: string;
  region?: string;
  imageMood?: string;
}

/**
 * Pass 3: Creative image concept — GPT-4o thinks about what image
 * would best represent this specific campaign.
 */
async function generateImageConcept(input: ImagePromptInput): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a creative director at a top marketing agency. Given a campaign's content, you describe the IDEAL photograph that would serve as its background image.

Think deeply about:
- What is this campaign REALLY about? What is its emotional core?
- What scene, setting, or visual would INSTANTLY communicate the topic?
- What visual elements would make someone stop scrolling?
- What colors, lighting, and mood match the message?

Your output should be a detailed creative brief describing ONE photograph — the setting, key visual elements, lighting, color palette, mood, and composition.

Rules:
- The image will have white text overlaid on the lower half, so the lower portion should be darker, blurred, or have negative space
- No text/words/numbers in the image
- No recognizable faces (silhouettes OK)
- Be SPECIFIC to the campaign topic — never default to generic nature or skylines
- Describe what makes this image unique to THIS campaign`,
      },
      {
        role: "user",
        content: `What would be the ideal background image for this campaign?

Campaign: ${input.topic}
${input.imageMood ? `Desired mood: ${input.imageMood}` : ""}
Industry: ${input.industry}
Region: ${input.region || "not specified"}
Brand tone: ${input.brandTone}

The campaign slides:
${input.slides.map((s, i) => `Slide ${i + 1}: "${s.headline}" — ${s.body}`).join("\n")}

Describe the ideal photograph in detail.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

/**
 * Pass 4: Convert creative concept into an optimized DALL-E 3 prompt.
 */
async function convertToDALLEPrompt(concept: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You convert a creative image brief into a concise, optimized DALL-E 3 prompt.

Rules:
- Output ONLY the DALL-E prompt, nothing else
- Start with the style: "Professional photograph, shallow depth of field"
- Include the key visual elements from the brief
- Specify composition: main subject in upper 40%, softer/darker lower area for text overlay
- Include color palette and lighting direction
- Add "no text, no words, no letters, no numbers" at the end
- Keep it under 200 words — DALL-E works best with focused, specific prompts
- Use vivid, concrete visual language (not abstract concepts)`,
      },
      {
        role: "user",
        content: `Convert this creative brief into a DALL-E 3 prompt:\n\n${concept}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

/**
 * Multi-pass image prompt generation:
 * 1. GPT-4o generates a creative image concept based on the campaign
 * 2. GPT-4o-mini converts that concept into a DALL-E-optimized prompt
 */
export async function generateImagePrompt(input: ImagePromptInput): Promise<string> {
  const concept = await generateImageConcept(input);
  const dallePrompt = await convertToDALLEPrompt(concept);
  return dallePrompt;
}
