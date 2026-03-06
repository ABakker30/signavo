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

  try {
    const { chat } = await import("@/lib/ai/chat");

    const result = await chat({
      message,
      context: "assistant",
    });

    return NextResponse.json({
      success: true,
      data: {
        reply: result.reply,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        reply: "I'm having trouble connecting right now. Please try again in a moment.",
      },
    });
  }
}
