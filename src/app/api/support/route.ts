import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Stub: handle support message
  const body = await request.json();
  return NextResponse.json({
    response: "Support will be fully available soon.",
  });
}
