import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function PATCH(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { businessName, websiteUrl } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (businessName) updates.business_name = businessName;

  const admin = createAdminClient();
  const { error } = await admin
    .from("accounts")
    .update(updates)
    .eq("id", context.account.id);

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message: error.message } },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: { updated: true } });
}
