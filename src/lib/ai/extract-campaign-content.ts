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

export interface EventDetails {
  isEvent: boolean;
  venue: string | null;
  address: string | null;
  date: string | null;
  time: string | null;
  eventType: string | null;
  ticketInfo: string | null;
}

export interface ExtractedCampaign {
  contentType: "event" | "listing" | "article" | "announcement" | "promotion" | "other";
  topic: string;
  keyMessage: string;
  targetAudience: string;
  keyPoints: string[];
  suggestedTitle: string;
  eventDetails: EventDetails;
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

FIRST, determine what TYPE of content this is:
- "event" — a specific event with a date, time, and/or venue
- "listing" — a property listing, product, or service for sale
- "article" — a news article, blog post, or market report
- "announcement" — a general business announcement
- "promotion" — a sale, discount, or special offer
- "other" — anything that doesn't fit the above

IF it's an event, you MUST extract the event details (venue, address, date, time, type, ticket info). These are CRITICAL — the audience needs to know WHEN and WHERE.

You must respond in valid JSON with this exact structure:
{
  "contentType": "event|listing|article|announcement|promotion|other",
  "topic": "What the page is about in one sentence",
  "keyMessage": "The core message or value proposition to promote",
  "targetAudience": "Who should care about this content",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "suggestedTitle": "A compelling campaign title (5-8 words)",
  "eventDetails": {
    "isEvent": true/false,
    "venue": "Venue name or null",
    "address": "Full address or null",
    "date": "Date string (e.g. 'Friday, March 7, 2026') or null",
    "time": "Time string (e.g. '7:00 PM - 11:00 PM') or null",
    "eventType": "Type (e.g. 'celebration', 'open house', 'networking', 'concert') or null",
    "ticketInfo": "Ticket/entry info (e.g. 'Free entry with valid military ID') or null"
  },
  "suggestedSlides": [
    { "index": 1, "headline": "...", "body": "..." },
    { "index": 2, "headline": "...", "body": "..." },
    { "index": 3, "headline": "...", "body": "..." },
    { "index": 4, "headline": "...", "body": "..." },
    { "index": 5, "headline": "...", "body": "..." }
  ],
  "imageMood": "A brief description of the ideal background image"
}

Rules:
- Extract REAL data and facts from the page — do not invent anything
- topic: one clear sentence about what the page covers
- keyMessage: what the professional should communicate to their audience
- targetAudience: who benefits from this information
- keyPoints: 3-5 key facts, stats, or takeaways from the page
- suggestedTitle: catchy, professional, max 8 words
- suggestedSlides: exactly 5 slides following carousel best practices
  - Slide 1: attention-grabbing hook
  - Slides 2-4: key insights and value
  - Slide 5: call to action with WHERE and WHEN if it's an event
  - Headlines: max 8 words each
  - Body: 1-3 sentences each, concise and punchy
  - FOR EVENTS: slide body text MUST include the venue name, date, and time where relevant. The audience needs to know the specifics.
  - FOR LISTINGS: include price, address, key features
  - FOR PROMOTIONS: include offer details, expiration, how to redeem
- imageMood: describe the ideal background image (specific to the content, not generic)`,
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
