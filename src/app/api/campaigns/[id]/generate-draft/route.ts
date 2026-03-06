import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

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

  // Stub: generate placeholder slides
  // Will be replaced with AI-powered generation
  const slides = [
    { index: 1, headline: `${campaign.title || "Market Update"}`, body: "Here's what's happening in Hampton Roads real estate this week.", image_url: null },
    { index: 2, headline: "Market Activity", body: "Inventory remains active across key neighborhoods in the Hampton Roads area.", image_url: null },
    { index: 3, headline: "Key Trends", body: "Buyer interest continues to grow in Virginia Beach and Norfolk communities.", image_url: null },
    { index: 4, headline: "What This Means", body: "Whether you're buying or selling, staying informed gives you an advantage.", image_url: null },
    { index: 5, headline: "Stay Connected", body: "Follow for weekly updates on the Hampton Roads real estate market.", image_url: null },
  ];

  const caption = `A quick look at what's happening in the Hampton Roads real estate market. Stay informed, stay visible. #HamptonRoads #RealEstate #MarketUpdate`;

  const { error: updateError } = await admin
    .from("campaigns")
    .update({
      slides,
      caption,
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
}
