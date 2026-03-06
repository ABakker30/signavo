import openai from "./openai";

interface DraftInput {
  title: string;
  inputText: string;
  brandTone: string | null;
  audienceFocus: string | null;
  positioning: string | null;
  knownFor: string | null;
  campaignLanguage: string;
}

interface GeneratedDraft {
  slides: Array<{
    index: number;
    headline: string;
    body: string;
  }>;
  caption: string;
}

export async function generateCampaignDraft(input: DraftInput): Promise<GeneratedDraft> {
  const brandContext = [
    input.brandTone && `Tone: ${input.brandTone}`,
    input.audienceFocus && `Primary audience: ${input.audienceFocus}`,
    input.positioning && `Positioning: ${input.positioning}`,
    input.knownFor && `Known for: ${input.knownFor}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a professional content strategist. You create polished, branded social media carousel content for professionals who want to establish authority in their local market.

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
- Exactly 5 slides
- Slide 1: attention-grabbing hook
- Slides 2-4: key insights, data, or value
- Slide 5: call to action or takeaway
- Each headline: max 8 words
- Each body: 1-3 sentences, concise and punchy
- Caption: 2-4 sentences with relevant hashtags
- Write in language: ${input.campaignLanguage}
- Match the brand tone and audience described below`,
      },
      {
        role: "user",
        content: `Create a 5-slide carousel campaign.

Title: ${input.title}

Source content:
${input.inputText}

${brandContext ? `Brand profile:\n${brandContext}` : "No brand profile set yet — use a professional, approachable tone."}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content) as GeneratedDraft;
}
