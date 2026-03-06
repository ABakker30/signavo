import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";
import { renderSlides } from "@/lib/renderer";

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

  // Fetch campaign
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

  const slides = (campaign.slides as Array<{ index: number; headline: string; body: string }>) || [];

  if (slides.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "NO_SLIDES", message: "Generate a draft first" } },
      { status: 400 }
    );
  }

  // Fetch brand profile
  const { data: brand } = await admin
    .from("brand_profiles")
    .select("headshot_url, tone")
    .eq("account_id", context.account.id)
    .single();

  // Fetch account for business name and tagline
  const { data: account } = await admin
    .from("accounts")
    .select("business_name, tagline")
    .eq("id", context.account.id)
    .single();

  try {
    const rendered = await renderSlides(slides, {
      businessName: account?.business_name || "Signavo",
      tagline: account?.tagline || "",
      headshotUrl: brand?.headshot_url || null,
      tone: brand?.tone || "professional",
    });

    // Upload each slide to Supabase Storage
    const imageUrls: string[] = [];

    for (const slide of rendered) {
      const filePath = `${context.account.id}/${id}/slide-${slide.index}.png`;

      await admin.storage
        .from("campaign-slides")
        .upload(filePath, slide.imageBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      const { data: urlData } = admin.storage
        .from("campaign-slides")
        .getPublicUrl(filePath);

      imageUrls.push(urlData.publicUrl);
    }

    // Update campaign with rendered image URLs
    await admin
      .from("campaigns")
      .update({
        rendered_slides: imageUrls,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      data: {
        slides: imageUrls,
        count: imageUrls.length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rendering failed";
    return NextResponse.json(
      { success: false, error: { code: "RENDER_FAILED", message } },
      { status: 500 }
    );
  }
}
