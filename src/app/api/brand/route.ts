import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "Use /api/brand/profile for brand data, /api/brand/setup for brand onboarding",
    },
  });
}
