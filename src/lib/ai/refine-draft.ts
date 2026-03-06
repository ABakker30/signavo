import openai from "./openai";

interface RefineInput {
  currentSlides: Array<{ index: number; headline: string; body: string }>;
  currentCaption: string;
  prompt: string;
  brandTone: string | null;
  campaignLanguage: string;
}

interface RefinedDraft {
  slides: Array<{
    index: number;
    headline: string;
    body: string;
  }>;
  caption: string;
}

export async function refineCampaignDraft(input: RefineInput): Promise<RefinedDraft> {
  const slidesText = input.currentSlides
    .map((s) => `Slide ${s.index}: "${s.headline}" — ${s.body}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a professional content editor. You refine social media carousel content based on user feedback.

You must respond in valid JSON with this exact structure:
{
  "slides": [
    { "index": 1, "headline": "...", "body": "..." },
    { "index": 2, "headline": "...", "body": "..." },
    { "index": 3, "headline": "...", "body": "..." },
    { "index": 4, "headline": "...", "body": "..." },
    { "index": 5, "headline": "...", "body": "..." }
  ],
  "caption": "..."
}

Rules:
- Keep 5 slides
- Apply the user's feedback precisely
- Maintain brand tone: ${input.brandTone || "professional"}
- Write in language: ${input.campaignLanguage}
- Each headline: max 8 words
- Each body: 1-3 sentences`,
      },
      {
        role: "user",
        content: `Here is the current draft:

${slidesText}

Caption: ${input.currentCaption}

User feedback: ${input.prompt}

Please refine the draft based on this feedback.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content) as RefinedDraft;
}
