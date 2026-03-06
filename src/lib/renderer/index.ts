import { chromium } from "playwright";
import { renderSlideHtml } from "./slide-templates";

interface SlideContent {
  index: number;
  headline: string;
  body: string;
}

interface BrandInfo {
  businessName: string;
  tagline: string;
  headshotUrl: string | null;
  tone: string;
}

interface RenderedSlide {
  index: number;
  imageBuffer: Buffer;
}

export async function renderSlides(
  slides: SlideContent[],
  brand: BrandInfo
): Promise<RenderedSlide[]> {
  const browser = await chromium.launch({ headless: true });
  const results: RenderedSlide[] = [];

  try {
    for (const slide of slides) {
      const html = renderSlideHtml(
        { ...slide, totalSlides: slides.length },
        brand
      );

      const page = await browser.newPage({
        viewport: { width: 1080, height: 1080 },
      });

      await page.setContent(html, { waitUntil: "networkidle" });

      // Wait for fonts and headshot image to load
      await page.waitForTimeout(1000);

      const buffer = await page.screenshot({
        type: "png",
        fullPage: false,
      });

      results.push({
        index: slide.index,
        imageBuffer: Buffer.from(buffer),
      });

      await page.close();
    }
  } finally {
    await browser.close();
  }

  return results;
}
