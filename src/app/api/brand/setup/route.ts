import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function POST(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { websiteUrl, positioning, knownFor, tone, audienceFocus, assistantIntro } = body;

  if (!tone || !audienceFocus) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Tone and audience focus are required" },
      },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("brand_profiles")
    .update({
      website_url: websiteUrl || null,
      positioning: positioning || null,
      known_for: knownFor || null,
      tone,
      audience_focus: audienceFocus,
      assistant_intro: assistantIntro || null,
      status: "finalized",
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", context.account.id);

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "SETUP_FAILED", message: error.message } },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { brandStatus: "finalized" },
  });
}
