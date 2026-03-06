export type BrandStatus = "not_started" | "in_progress" | "finalized";

export type CampaignStatus = "draft" | "ready_to_finalize" | "published" | "failed";

export type Tone = "professional" | "friendly" | "premium" | "direct";

export type AudienceFocus = "buyers" | "sellers" | "relocation" | "investors";

export interface Account {
  id: string;
  user_id: string;
  business_name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: string;
  account_id: string;
  website_url: string | null;
  positioning: string;
  tone: Tone;
  audience_focus: AudienceFocus;
  assistant_intro: string | null;
  status: BrandStatus;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  account_id: string;
  title: string;
  status: CampaignStatus;
  input_type: "pdf" | "url" | "image" | "text";
  input_data: string;
  slides: SlideData[] | null;
  caption: string | null;
  landing_page_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface SlideData {
  index: number;
  headline: string;
  body: string;
  image_url: string | null;
}

export interface LandingPage {
  id: string;
  campaign_id: string;
  slug: string;
  headline: string;
  narrative: string;
  cta_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  landing_page_id: string;
  email: string;
  context: string | null;
  created_at: string;
}
