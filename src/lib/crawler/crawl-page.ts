import { chromium } from "playwright";

interface PageContent {
  url: string;
  title: string;
  description: string;
  content: string;
}

const MAX_CONTENT_LENGTH = 50_000;
const TIMEOUT_MS = 15_000;

export async function crawlSinglePage(url: string): Promise<PageContent> {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (compatible; SignavoBot/1.0; +https://signavo.me)",
    });

    const page = await context.newPage();
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT_MS,
    });

    if (!response || response.status() >= 400) {
      throw new Error(`Page returned status ${response?.status() || "unknown"}`);
    }

    const title = await page.title();

    const { description, content } = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      const desc = meta ? (meta as HTMLMetaElement).content : "";

      // Remove non-content elements
      const removeSelectors = [
        "nav", "footer", "header", "script", "style", "noscript",
        "[role='navigation']", ".cookie-banner", "#cookie-consent",
        ".sidebar", "aside",
      ];
      removeSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });

      const body = document.body?.innerText || "";
      return { description: desc, content: body };
    });

    await browser.close();

    return {
      url,
      title,
      description,
      content: content.slice(0, MAX_CONTENT_LENGTH),
    };
  } catch (err) {
    await browser.close();
    throw err;
  }
}
