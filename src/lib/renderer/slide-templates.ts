interface SlideData {
  index: number;
  headline: string;
  body: string;
  totalSlides: number;
}

interface BrandData {
  businessName: string;
  tagline: string;
  headshotUrl: string | null;
  tone: string;
  backgroundImageUrl?: string | null;
}

interface TemplateColors {
  bg: string;
  bgGradient: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  headlineBg: string;
}

function getColors(tone: string): TemplateColors {
  switch (tone) {
    case "premium":
      return {
        bg: "#0f172a",
        bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        text: "#f8fafc",
        textSecondary: "#94a3b8",
        accent: "#c9a96e",
        accentText: "#0f172a",
        headlineBg: "rgba(201, 169, 110, 0.15)",
      };
    case "friendly":
      return {
        bg: "#fefce8",
        bgGradient: "linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%)",
        text: "#1c1917",
        textSecondary: "#57534e",
        accent: "#f59e0b",
        accentText: "#ffffff",
        headlineBg: "rgba(245, 158, 11, 0.12)",
      };
    case "direct":
      return {
        bg: "#ffffff",
        bgGradient: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
        text: "#0f172a",
        textSecondary: "#475569",
        accent: "#dc2626",
        accentText: "#ffffff",
        headlineBg: "rgba(220, 38, 38, 0.08)",
      };
    case "professional":
    default:
      return {
        bg: "#ffffff",
        bgGradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        text: "#0f172a",
        textSecondary: "#475569",
        accent: "#1e40af",
        accentText: "#ffffff",
        headlineBg: "rgba(30, 64, 175, 0.08)",
      };
  }
}

function dots(current: number, total: number, accent: string, secondary: string): string {
  return Array.from({ length: total }, (_, i) =>
    `<span style="display:inline-block;width:${i === current - 1 ? 28 : 10}px;height:10px;border-radius:5px;background:${i === current - 1 ? accent : secondary};margin:0 3px;transition:all 0.3s;"></span>`
  ).join("");
}

function getOverlay(index: number, total: number, tone: string): string {
  const isFirst = index === 1;
  const isLast = index === total;
  const dark = tone === "premium" ? "15,23,42" : "0,0,0";

  if (isFirst) {
    // Vivid top, strong lower half for title + headshot
    return `linear-gradient(180deg, rgba(${dark},0.05) 0%, rgba(${dark},0.15) 30%, rgba(${dark},0.55) 55%, rgba(${dark},0.75) 100%)`;
  }
  if (isLast) {
    // Strong bottom for CTA readability
    return `linear-gradient(180deg, rgba(${dark},0.05) 0%, rgba(${dark},0.2) 35%, rgba(${dark},0.6) 55%, rgba(${dark},0.8) 100%)`;
  }
  // Middle slides: vivid top, readable bottom
  const angles = [180, 170, 190];
  const angle = angles[(index - 2) % angles.length];
  return `linear-gradient(${angle}deg, rgba(${dark},0.05) 0%, rgba(${dark},0.15) 30%, rgba(${dark},0.5) 55%, rgba(${dark},0.7) 100%)`;
}

export function renderSlideHtml(slide: SlideData, brand: BrandData): string {
  const c = getColors(brand.tone);
  const isFirst = slide.index === 1;
  const isLast = slide.index === slide.totalSlides;
  const showHeadshot = (isFirst || isLast) && brand.headshotUrl;
  const hasAiBg = !!brand.backgroundImageUrl;

  // When using AI background, force white text for readability on dark overlay
  const textColor = hasAiBg ? "#ffffff" : c.text;
  const textSecondary = hasAiBg ? "rgba(255,255,255,0.8)" : c.textSecondary;
  const accentColor = hasAiBg ? c.accent : c.accent;

  const bgStyle = hasAiBg
    ? `background: url('${brand.backgroundImageUrl}') center/cover no-repeat;`
    : `background: ${c.bgGradient};`;

  const overlayHtml = hasAiBg
    ? `<div class="bg-overlay"></div>`
    : "";

  const overlayStyle = hasAiBg
    ? `.bg-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: ${getOverlay(slide.index, slide.totalSlides, brand.tone)};
        z-index: 1;
      }`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1080px;
    font-family: 'Inter', -apple-system, sans-serif;
    ${bgStyle}
    color: ${textColor};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  ${overlayStyle}
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 72px;
    position: relative;
    z-index: 2;
  }
  .top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${accentColor};
    z-index: 3;
  }
  .brand-header {
    position: absolute;
    top: 40px;
    left: 72px;
    right: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand-name {
    font-size: 18px;
    font-weight: 600;
    color: ${textSecondary};
    letter-spacing: 0.5px;
    text-transform: uppercase;
    ${hasAiBg ? "text-shadow: 0 1px 3px rgba(0,0,0,0.5);" : ""}
  }
  .slide-number {
    font-size: 16px;
    font-weight: 700;
    color: ${hasAiBg ? "#ffffff" : accentColor};
    background: ${hasAiBg ? "rgba(255,255,255,0.15)" : c.headlineBg};
    padding: 6px 16px;
    border-radius: 20px;
    ${hasAiBg ? "backdrop-filter: blur(8px);" : ""}
  }
  .content {
    margin-top: 40px;
  }
  .headline {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.15;
    color: ${textColor};
    margin-bottom: 32px;
    max-width: 900px;
    ${hasAiBg ? "text-shadow: 0 2px 8px rgba(0,0,0,0.4);" : ""}
  }
  .body-text {
    font-size: 28px;
    font-weight: 400;
    line-height: 1.55;
    color: ${textSecondary};
    max-width: 840px;
    ${hasAiBg ? "text-shadow: 0 1px 4px rgba(0,0,0,0.3);" : ""}
  }
  .headshot-section {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 48px;
  }
  .headshot-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${accentColor};
    ${hasAiBg ? "box-shadow: 0 4px 12px rgba(0,0,0,0.4);" : ""}
  }
  .headshot-info {
    display: flex;
    flex-direction: column;
  }
  .headshot-name {
    font-size: 22px;
    font-weight: 700;
    color: ${textColor};
    ${hasAiBg ? "text-shadow: 0 1px 3px rgba(0,0,0,0.4);" : ""}
  }
  .headshot-tagline {
    font-size: 16px;
    color: ${textSecondary};
    margin-top: 4px;
  }
  .footer {
    position: absolute;
    bottom: 40px;
    left: 72px;
    right: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
  }
  .dots {
    display: flex;
    align-items: center;
  }
  .tagline-footer {
    font-size: 14px;
    color: ${textSecondary};
    font-style: italic;
  }
  .cta-badge {
    display: inline-block;
    background: ${accentColor};
    color: ${c.accentText};
    padding: 14px 36px;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 700;
    margin-top: 36px;
    ${hasAiBg ? "box-shadow: 0 4px 16px rgba(0,0,0,0.3);" : ""}
  }
</style>
</head>
<body>
  ${overlayHtml}
  <div class="top-bar"></div>
  <div class="container">
    <div class="brand-header">
      <span class="brand-name">${brand.businessName}</span>
      <span class="slide-number">${slide.index} / ${slide.totalSlides}</span>
    </div>
    <div class="content">
      <h1 class="headline">${slide.headline}</h1>
      <p class="body-text">${slide.body}</p>
      ${isLast ? `<div class="cta-badge">Learn More →</div>` : ""}
      ${showHeadshot ? `
        <div class="headshot-section">
          <img class="headshot-img" src="${brand.headshotUrl}" alt="headshot" />
          <div class="headshot-info">
            <span class="headshot-name">${brand.businessName}</span>
            ${brand.tagline ? `<span class="headshot-tagline">${brand.tagline}</span>` : ""}
          </div>
        </div>
      ` : ""}
    </div>
    <div class="footer">
      <div class="dots">${dots(slide.index, slide.totalSlides, accentColor, hasAiBg ? "rgba(255,255,255,0.3)" : c.textSecondary + "40")}</div>
      ${!showHeadshot && brand.tagline ? `<span class="tagline-footer">${brand.tagline}</span>` : ""}
    </div>
  </div>
</body>
</html>`;
}
