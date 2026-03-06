import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Stub: handle assistant message
  const body = await request.json();
  return NextResponse.json({
    response: "Thank you for your message. Our assistant will be available soon.",
  });
}
