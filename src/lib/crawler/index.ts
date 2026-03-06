import { chromium } from "playwright";

interface CrawledPage {
  url: string;
  title: string;
  content: string;
}

interface CrawlResult {
  pages: CrawledPage[];
  error?: string;
}

const MAX_PAGES = 5;
const MAX_DEPTH = 2;
const MAX_CONTENT_LENGTH = 200_000;
const TIMEOUT_MS = 10_000;
const TARGET_PATHS = ["/", "/about", "/about-us", "/services", "/team", "/our-team"];

export async function crawlWebsite(baseUrl: string): Promise<CrawlResult> {
  const pages: CrawledPage[] = [];

  let browser;
  try {
    const url = new URL(baseUrl);
    const origin = url.origin;

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (compatible; SignavoBot/1.0; +https://signavo.me)",
    });

    const visited = new Set<string>();

    // Try target paths first
    for (const path of TARGET_PATHS) {
      if (pages.length >= MAX_PAGES) break;

      const pageUrl = `${origin}${path}`;
      if (visited.has(pageUrl)) continue;
      visited.add(pageUrl);

      try {
        const page = await context.newPage();
        const response = await page.goto(pageUrl, {
          waitUntil: "domcontentloaded",
          timeout: TIMEOUT_MS,
        });

        if (!response || response.status() >= 400) {
          await page.close();
          continue;
        }

        const title = await page.title();
        const content = await page.evaluate(() => {
          // Remove nav, footer, scripts, styles
          const removeSelectors = [
            "nav", "footer", "header", "script", "style", "noscript",
            "[role='navigation']", ".cookie-banner", "#cookie-consent",
          ];
          removeSelectors.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el) => el.remove());
          });

          // Get meta description
          const meta = document.querySelector('meta[name="description"]');
          const description = meta ? (meta as HTMLMetaElement).content : "";

          // Get main text content
          const body = document.body?.innerText || "";

          return `Description: ${description}\n\n${body}`;
        });

        if (content.length > 50) {
          pages.push({
            url: pageUrl,
            title,
            content: content.slice(0, MAX_CONTENT_LENGTH),
          });
        }

        await page.close();
      } catch {
        // Page failed to load — skip it
      }
    }

    // If we got fewer than 2 pages, try discovering links from homepage
    if (pages.length < 2) {
      try {
        const homePage = await context.newPage();
        await homePage.goto(origin, {
          waitUntil: "domcontentloaded",
          timeout: TIMEOUT_MS,
        });

        const links = await homePage.evaluate((orig: string) => {
          return Array.from(document.querySelectorAll("a[href]"))
            .map((a) => (a as HTMLAnchorElement).href)
            .filter((href) => href.startsWith(orig))
            .filter((href) => {
              const path = new URL(href).pathname.toLowerCase();
              return (
                path.includes("about") ||
                path.includes("service") ||
                path.includes("team") ||
                path.includes("who-we-are") ||
                path.includes("our-story")
              );
            })
            .slice(0, 5);
        }, origin);

        for (const link of links) {
          if (pages.length >= MAX_PAGES) break;
          if (visited.has(link)) continue;
          visited.add(link);

          try {
            const page = await context.newPage();
            const response = await page.goto(link, {
              waitUntil: "domcontentloaded",
              timeout: TIMEOUT_MS,
            });

            if (response && response.status() < 400) {
              const title = await page.title();
              const content = await page.evaluate(() => {
                ["nav", "footer", "header", "script", "style", "noscript"].forEach(
                  (sel) => document.querySelectorAll(sel).forEach((el) => el.remove())
                );
                return document.body?.innerText || "";
              });

              if (content.length > 50) {
                pages.push({
                  url: link,
                  title,
                  content: content.slice(0, MAX_CONTENT_LENGTH),
                });
              }
            }

            await page.close();
          } catch {
            // Skip failed pages
          }
        }

        await homePage.close();
      } catch {
        // Discovery failed — continue with what we have
      }
    }

    await browser.close();

    if (pages.length === 0) {
      return { pages: [], error: "Could not extract any content from the website" };
    }

    return { pages };
  } catch (err) {
    if (browser) await browser.close();
    const message = err instanceof Error ? err.message : "Crawl failed";
    return { pages: [], error: message };
  }
}
