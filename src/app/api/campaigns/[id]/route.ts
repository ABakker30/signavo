import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function GET(
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

  const { data: campaign, error } = await admin
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("account_id", context.account.id)
    .single();

  if (error || !campaign) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } },
      { status: 404 }
    );
  }

  let landingPage = null;
  if (campaign.landing_page_slug) {
    const { data } = await admin
      .from("landing_pages")
      .select("*")
      .eq("campaign_id", id)
      .single();
    landingPage = data;
  }

  return NextResponse.json({
    success: true,
    data: {
      id: campaign.id,
      title: campaign.title,
      status: campaign.status,
      inputType: campaign.input_type,
      slides: campaign.slides,
      caption: campaign.caption,
      landingPage: landingPage
        ? {
            headline: landingPage.headline,
            summary: landingPage.narrative,
            slug: landingPage.slug,
          }
        : null,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    },
  });
}
