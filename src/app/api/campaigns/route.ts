import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Stub: list campaigns for authenticated user
  return NextResponse.json({ campaigns: [] });
}

export async function POST(request: NextRequest) {
  // Stub: create a new campaign
  const body = await request.json();
  return NextResponse.json({ message: "Campaign created", data: body });
}
