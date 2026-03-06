import openai from "./openai";

interface ExtractionInput {
  url: string;
  pageTitle: string;
  pageDescription: string;
  pageContent: string;
  brandTone: string | null;
  audienceFocus: string | null;
  industry: string;
}

export interface ExtractedCampaign {
  topic: string;
  keyMessage: string;
  targetAudience: string;
  keyPoints: string[];
  suggestedTitle: string;
  suggestedSlides: Array<{
    index: number;
    headline: string;
    body: string;
  }>;
  imageMood: string;
}

export async function extractCampaignContent(
  input: ExtractionInput
): Promise<ExtractedCampaign> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert content strategist. Analyze a webpage and extract the key information needed to create a professional social media carousel campaign.

You must respond in valid JSON with this exact structure:
{
  "topic": "What the page is about in one sentence",
  "keyMessage": "The core message or value proposition to promote",
  "targetAudience": "Who should care about this content",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "suggestedTitle": "A compelling campaign title (5-8 words)",
  "suggestedSlides": [
    { "index": 1, "headline": "...", "body": "..." },
    { "index": 2, "headline": "...", "body": "..." },
    { "index": 3, "headline": "...", "body": "..." },
    { "index": 4, "headline": "...", "body": "..." },
    { "index": 5, "headline": "...", "body": "..." }
  ],
  "imageMood": "A brief description of the visual mood for the campaign background image"
}

Rules:
- Extract REAL data and facts from the page — do not invent statistics
- topic: one clear sentence about what the page covers
- keyMessage: what the professional should communicate to their audience
- targetAudience: who benefits from this information
- keyPoints: 3-5 key facts, stats, or takeaways from the page
- suggestedTitle: catchy, professional, max 8 words
- suggestedSlides: exactly 5 slides following carousel best practices
  - Slide 1: attention-grabbing hook
  - Slides 2-4: key insights and value
  - Slide 5: call to action
  - Headlines: max 8 words each
  - Body: 1-3 sentences each, concise and punchy
- imageMood: describe the ideal background image mood (bright, professional, relevant to topic)`,
      },
      {
        role: "user",
        content: `Extract campaign content from this webpage:

URL: ${input.url}
Page title: ${input.pageTitle}
Meta description: ${input.pageDescription}

Industry: ${input.industry}
${input.brandTone ? `Brand tone: ${input.brandTone}` : ""}
${input.audienceFocus ? `Audience focus: ${input.audienceFocus}` : ""}

Page content:
${input.pageContent.slice(0, 12000)}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI extraction");

  return JSON.parse(content) as ExtractedCampaign;
}
