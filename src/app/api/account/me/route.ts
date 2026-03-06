import { NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";

export async function GET() {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, data: context });
}
