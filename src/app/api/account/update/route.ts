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

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const fieldMap: Record<string, string> = {
    businessName: "business_name",
    industryType: "industry_type",
    streetAddress: "street_address",
    addressLine2: "address_line_2",
    city: "city",
    region: "region",
    postalCode: "postal_code",
    country: "country",
    websiteUrl: "website_url",
    businessPhone: "business_phone",
    businessEmail: "business_email",
    licenseNumber: "license_number",
    yearsInBusiness: "years_in_business",
    tagline: "tagline",
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (body[key] !== undefined) updates[col] = body[key];
  }

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
