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

  // Stub: AI refinement will be implemented later
  // For now, just update the timestamp to indicate refinement happened
  const { error: updateError } = await admin
    .from("campaigns")
    .update({ updated_at: new Date().toISOString() })
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
}
