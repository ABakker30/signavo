import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function DELETE(
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

  // Verify ownership
  const { data: campaign, error: fetchError } = await admin
    .from("campaigns")
    .select("id, rendered_slides")
    .eq("id", id)
    .eq("account_id", context.account.id)
    .single();

  if (fetchError || !campaign) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Campaign not found" } },
      { status: 404 }
    );
  }

  // Clean up rendered slides from storage
  if (campaign.rendered_slides && Array.isArray(campaign.rendered_slides)) {
    const folder = `${context.account.id}/${id}`;
    const { data: files } = await admin.storage
      .from("campaign-slides")
      .list(folder);

    if (files && files.length > 0) {
      await admin.storage
        .from("campaign-slides")
        .remove(files.map((f) => `${folder}/${f.name}`));
    }
  }

  // Delete landing page if exists
  await admin
    .from("landing_pages")
    .delete()
    .eq("campaign_id", id);

  // Delete the campaign
  const { error: deleteError } = await admin
    .from("campaigns")
    .delete()
    .eq("id", id)
    .eq("account_id", context.account.id);

  if (deleteError) {
    return NextResponse.json(
      { success: false, error: { code: "DELETE_FAILED", message: deleteError.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

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
