import openai from "./openai";

interface CrawledPage {
  url: string;
  title: string;
  content: string;
}

interface ExtractedBrand {
  siteTitle: string;
  tagline: string;
  keyPhrases: string[];
  services: string[];
  brandToneHint: string;
  audienceHint: string;
  knownForHint: string;
  positioningSuggestion: string;
  assistantIntroSuggestion: string;
}

export async function extractBrandFromCrawl(pages: CrawledPage[]): Promise<ExtractedBrand> {
  const pagesText = pages
    .map((p) => `--- Page: ${p.title} (${p.url}) ---\n${p.content.slice(0, 3000)}`)
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a brand analyst. You extract brand identity from website content.

Analyze the provided website pages and extract the brand profile.

Respond in valid JSON with this exact structure:
{
  "siteTitle": "The business name as shown on the site",
  "tagline": "Their tagline or main value proposition",
  "keyPhrases": ["phrase1", "phrase2", "phrase3"],
  "services": ["service1", "service2"],
  "brandToneHint": "One of: professional, friendly, premium, direct",
  "audienceHint": "Who their primary audience appears to be",
  "knownForHint": "One of: TRUSTED_ADVISOR, MARKET_EXPERT, NEIGHBORHOOD_SPECIALIST, RESULTS_DRIVEN, RELATIONSHIP_BUILDER",
  "positioningSuggestion": "A concise positioning statement based on the site content",
  "assistantIntroSuggestion": "A friendly intro message for their branded assistant"
}

Be concise. Base everything on actual site content, not assumptions.`,
      },
      {
        role: "user",
        content: `Analyze this website content and extract the brand profile:\n\n${pagesText}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content) as ExtractedBrand;
}
