import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { crawlSinglePage } from "@/lib/crawler/crawl-page";
import { extractCampaignContent } from "@/lib/ai/extract-campaign-content";

export async function POST(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "URL is required" } },
      { status: 400 }
    );
  }

  try {
    // Step 1: Crawl the page
    const page = await crawlSinglePage(url);

    // Step 2: Extract campaign content with AI
    const extracted = await extractCampaignContent({
      url,
      pageTitle: page.title,
      pageDescription: page.description,
      pageContent: page.content,
      brandTone: context.brandProfile?.tone || null,
      audienceFocus: context.brandProfile?.audience_focus || null,
      industry: context.account.industryType || "REAL_ESTATE",
    });

    return NextResponse.json({
      success: true,
      data: extracted,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json(
      { success: false, error: { code: "EXTRACTION_FAILED", message } },
      { status: 500 }
    );
  }
}
