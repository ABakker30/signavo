import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Stub: get brand profile for authenticated user
  return NextResponse.json({ message: "Brand profile endpoint" });
}

export async function POST(request: NextRequest) {
  // Stub: create/update brand profile
  const body = await request.json();
  return NextResponse.json({ message: "Brand profile saved", data: body });
}
