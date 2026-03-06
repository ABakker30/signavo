import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, landingPageSlug } = body;

  if (!message) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Message is required" } },
      { status: 400 }
    );
  }

  // Stub: AI assistant will be implemented later
  return NextResponse.json({
    success: true,
    data: {
      reply: "Thank you for your question. Our assistant is being set up and will be fully available soon.",
    },
  });
}
