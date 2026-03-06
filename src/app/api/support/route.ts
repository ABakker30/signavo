import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";

export async function POST(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Message is required" } },
      { status: 400 }
    );
  }

  // Stub: AI support will be implemented later
  return NextResponse.json({
    success: true,
    data: {
      reply: "Thanks for reaching out. Our support assistant is being set up and will be fully available soon. In the meantime, feel free to ask your question and we'll get back to you.",
      actions: [],
    },
  });
}
