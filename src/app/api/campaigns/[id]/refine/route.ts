import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function POST(
  request: NextRequest,
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
  const body = await request.json();
  const { prompt } = body;

  if (!prompt) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Prompt is required" } },
      { status: 400 }
    );
  }

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

  const currentSlides = (campaign.slides as Array<{ index: number; headline: string; body: string }>) || [];

  if (currentSlides.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "NO_DRAFT", message: "Generate a draft first" } },
      { status: 400 }
    );
  }

  try {
    const { refineCampaignDraft } = await import("@/lib/ai/refine-draft");

    const refined = await refineCampaignDraft({
      currentSlides,
      currentCaption: campaign.caption || "",
      prompt,
      brandTone: context.brandProfile?.tone || null,
      campaignLanguage: campaign.campaign_language || "en",
    });

    const { error: updateError } = await admin
      .from("campaigns")
      .update({
        slides: refined.slides,
        caption: refined.caption,
        draft_caption: refined.caption,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: { code: "REFINE_FAILED", message: updateError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { status: "DRAFT_UPDATED" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI refinement failed";
    return NextResponse.json(
      { success: false, error: { code: "AI_ERROR", message } },
      { status: 500 }
    );
  }
}
