import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";
import { generateSlug } from "@/lib/utils";

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

  if (!body.confirm) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Confirmation required" } },
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

  const slug = generateSlug(campaign.title || `update-${Date.now()}`);

  // Create landing page
  const { error: lpError } = await admin.from("landing_pages").insert({
    campaign_id: id,
    slug,
    headline: campaign.title,
    narrative: campaign.caption || "",
    cta_text: "Thinking about buying or selling in Hampton Roads?",
  });

  if (lpError) {
    return NextResponse.json(
      { success: false, error: { code: "PUBLISH_FAILED", message: lpError.message } },
      { status: 500 }
    );
  }

  // Update campaign status
  const { error: updateError } = await admin
    .from("campaigns")
    .update({
      status: "published",
      landing_page_slug: slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: { code: "PUBLISH_FAILED", message: updateError.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      status: "PUBLISHED",
      landingPageUrl: `/p/${slug}`,
    },
  });
}
