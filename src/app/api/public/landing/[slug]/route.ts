import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: landingPage, error } = await admin
    .from("landing_pages")
    .select("*, campaigns!inner(*, accounts!inner(business_name))")
    .eq("slug", slug)
    .single();

  if (error || !landingPage) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Landing page not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      headline: landingPage.headline,
      summary: landingPage.narrative,
      agentName: landingPage.campaigns?.accounts?.business_name || "",
      ctaText: landingPage.cta_text,
      slug: landingPage.slug,
    },
  });
}
