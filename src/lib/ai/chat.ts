import openai from "./openai";

interface ChatInput {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  context: "support" | "assistant";
  brandName?: string;
  brandTone?: string;
  assistantIntro?: string;
}

interface ChatResponse {
  reply: string;
}

export async function chat(input: ChatInput): Promise<ChatResponse> {
  const systemPrompt =
    input.context === "support"
      ? `You are a helpful support assistant for Signavo, a professional presence engine. Help users with their account, campaigns, brand setup, and general questions about the platform. Be concise, friendly, and helpful.`
      : `You are a branded assistant for ${input.brandName || "a local professional"}. Your tone should be ${input.brandTone || "professional and approachable"}.

${input.assistantIntro || "Help visitors learn more about this professional and their services."}

You help visitors by:
- Answering questions about the local market
- Sharing relevant insights
- Naturally qualifying interest (buyer, seller, timeline)
- Never being pushy or salesy

If a visitor shows real interest, gently ask for their name and preferred contact method. Keep responses concise (2-3 sentences max).`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (input.history) {
    for (const msg of input.history) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: input.message });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 300,
    messages,
  });

  const reply = response.choices[0]?.message?.content;
  if (!reply) throw new Error("No response from AI");

  return { reply };
}
