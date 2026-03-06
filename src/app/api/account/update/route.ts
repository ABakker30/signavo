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
  const { businessName, city, region, postalCode, websiteUrl } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (businessName !== undefined) updates.business_name = businessName;
  if (city !== undefined) updates.city = city;
  if (region !== undefined) updates.region = region;
  if (postalCode !== undefined) updates.postal_code = postalCode;
  if (websiteUrl !== undefined) updates.website_url = websiteUrl;

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
