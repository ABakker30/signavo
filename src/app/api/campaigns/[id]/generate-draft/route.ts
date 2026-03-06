import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";
import { generateCampaignDraft } from "@/lib/ai/generate-draft";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: campaign, error: fetchError } = await admin
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("account_id", context.account.id)
    .single();

  if (fetchError || !campaign) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } },
      { status: 404 }
    );
  }

  try {
    const draft = await generateCampaignDraft({
      title: campaign.title || "Market Update",
      inputText: campaign.input_data || campaign.raw_input_text || campaign.title || "General market update",
      brandTone: context.brandProfile?.tone || null,
      audienceFocus: context.brandProfile?.audience_focus || null,
      positioning: context.brandProfile?.positioning || null,
      knownFor: context.brandProfile?.known_for || null,
      campaignLanguage: campaign.campaign_language || "en",
    });

    const { error: updateError } = await admin
      .from("campaigns")
      .update({
        slides: draft.slides,
        caption: draft.caption,
        draft_caption: draft.caption,
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: { code: "GENERATION_FAILED", message: updateError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { status: "DRAFT_READY" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return NextResponse.json(
      { success: false, error: { code: "AI_ERROR", message } },
      { status: 500 }
    );
  }
}
