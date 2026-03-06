import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";
import { crawlWebsite } from "@/lib/crawler";
import { extractBrandFromCrawl } from "@/lib/ai/extract-brand";

export async function POST(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { websiteUrl } = body;

  if (!websiteUrl) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Website URL is required" } },
      { status: 400 }
    );
  }

  try {
    // Step 1: Crawl the website
    const crawlResult = await crawlWebsite(websiteUrl);

    if (crawlResult.error || crawlResult.pages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CRAWL_FAILED",
            message: crawlResult.error || "Could not extract content from the website",
          },
        },
        { status: 400 }
      );
    }

    // Step 2: Extract brand with AI
    const brand = await extractBrandFromCrawl(crawlResult.pages);

    // Step 3: Save analysis summary to brand profile
    const admin = createAdminClient();
    await admin
      .from("brand_profiles")
      .update({
        website_url: websiteUrl,
        website_analysis_summary: JSON.stringify({
          siteTitle: brand.siteTitle,
          tagline: brand.tagline,
          keyPhrases: brand.keyPhrases,
          services: brand.services,
          pagesAnalyzed: crawlResult.pages.map((p) => p.url),
        }),
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("account_id", context.account.id);

    return NextResponse.json({
      success: true,
      data: {
        siteTitle: brand.siteTitle,
        tagline: brand.tagline,
        keyPhrases: brand.keyPhrases,
        services: brand.services,
        brandToneHint: brand.brandToneHint,
        audienceHint: brand.audienceHint,
        knownForHint: brand.knownForHint,
        positioningSuggestion: brand.positioningSuggestion,
        assistantIntroSuggestion: brand.assistantIntroSuggestion,
        pagesAnalyzed: crawlResult.pages.length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json(
      { success: false, error: { code: "ANALYSIS_FAILED", message } },
      { status: 500 }
    );
  }
}
