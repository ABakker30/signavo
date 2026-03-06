import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function GET() {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: context.brandProfile
      ? {
          status: context.brandProfile.status,
          websiteUrl: context.brandProfile.website_url,
          positioning: context.brandProfile.positioning,
          tone: context.brandProfile.tone,
          audienceFocus: context.brandProfile.audience_focus,
          assistantIntro: context.brandProfile.assistant_intro,
        }
      : null,
  });
}

export async function PATCH(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const allowedFields = ["website_url", "positioning", "tone", "audience_focus", "assistant_intro"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.websiteUrl !== undefined) updates.website_url = body.websiteUrl;
  if (body.positioning !== undefined) updates.positioning = body.positioning;
  if (body.tone !== undefined) updates.tone = body.tone;
  if (body.audienceFocus !== undefined) updates.audience_focus = body.audienceFocus;
  if (body.assistantIntro !== undefined) updates.assistant_intro = body.assistantIntro;

  const admin = createAdminClient();
  const { error } = await admin
    .from("brand_profiles")
    .update(updates)
    .eq("account_id", context.account.id);

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message } },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: { updated: true } });
}
