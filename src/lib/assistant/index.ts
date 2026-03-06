// Assistant service stub
// Handles both consumer-facing and support assistant logic

export async function handleAssistantMessage(
  context: "consumer" | "support",
  message: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  // Stub: will be replaced with AI integration
  return `Thank you for your message. Our assistant will be available soon.`;
}
