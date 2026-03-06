// ============================================
// Enums
// ============================================

export type BrandStatus = "not_started" | "in_progress" | "finalized";

export type CampaignStatus = "draft" | "draft_ready" | "ready_to_publish" | "published" | "failed";

export type Tone = "professional" | "friendly" | "premium" | "direct";

export type AudienceFocus = "buyers" | "sellers" | "military_relocation" | "investors";

export type KnownFor = "trusted_advisor" | "market_expert" | "neighborhood_specialist" | "results_driven" | "relationship_builder";

export type InputType = "pdf" | "url" | "image" | "text";

export type SuggestionType = "WEEKLY" | "SIGNAL";

export type SuggestionStatus = "NEW" | "DISMISSED" | "USED";

export type LeadType = "BUYER" | "SELLER" | "UNKNOWN";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH";

// ============================================
// Core Entities
// ============================================

export interface Account {
  id: string;
  user_id: string;
  business_name: string;
  location: string;
  industry_type: string;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  website_url: string | null;
  country_code: string;
  ui_language: string;
  market_region: string | null;
  vertical_config_key: string;
  status: "ACTIVE" | "SUSPENDED";
  created_at: string;
  updated_at: string;
}

export interface VerticalConfigOption {
  value: string;
  label: string;
}

export interface SuggestionTemplate {
  type: SuggestionType;
  title: string;
  description: string;
}

export interface CtaTemplate {
  label: string;
  context: string;
}

export interface VerticalConfig {
  id: string;
  key: string;
  label: string;
  industry_type: string;
  default_region: string | null;
  default_country_code: string;
  default_language: string;
  known_for_options: VerticalConfigOption[];
  tone_options: VerticalConfigOption[];
  audience_options: VerticalConfigOption[];
  suggestion_templates: SuggestionTemplate[];
  cta_templates: CtaTemplate[];
  campaign_templates: Record<string, unknown>[];
  terminology: Record<string, string>;
  example_outputs: Record<string, unknown>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: string;
  account_id: string;
  status: BrandStatus;
  website_url: string | null;
  known_for: KnownFor | null;
  tone: Tone | null;
  audience_focus: AudienceFocus | null;
  positioning: string | null;
  assistant_intro: string | null;
  website_analysis_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  account_id: string;
  title: string | null;
  status: CampaignStatus;
  input_type: InputType | null;
  input_data: string | null;
  raw_input_text: string | null;
  source_url: string | null;
  location_focus: string | null;
  campaign_language: string;
  slides: SlideData[] | null;
  caption: string | null;
  draft_caption: string | null;
  final_caption: string | null;
  landing_page_slug: string | null;
  published_slug: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignInput {
  id: string;
  campaign_id: string;
  input_type: InputType;
  storage_path: string | null;
  source_url: string | null;
  raw_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignSlide {
  id: string;
  campaign_id: string;
  slide_index: number;
  status: "DRAFT" | "FINAL";
  headline: string | null;
  body: string | null;
  footer_text: string | null;
  layout_type: string | null;
  rendered_image_url: string | null;
  slide_json: Record<string, unknown> | null;
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
  headline: string | null;
  narrative: string | null;
  summary: string | null;
  cta_text: string | null;
  content_json: Record<string, unknown> | null;
  assistant_enabled: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Suggestion {
  id: string;
  account_id: string;
  type: SuggestionType;
  title: string;
  description: string | null;
  status: SuggestionStatus;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  landing_page_id: string | null;
  account_id: string | null;
  campaign_id: string | null;
  source_thread_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  lead_type: LeadType;
  urgency_level: UrgencyLevel;
  notes: string | null;
  context: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AssistantThread {
  id: string;
  landing_page_id: string;
  visitor_token: string | null;
  thread_type: "PUBLIC_LEAD" | "SUPPORT";
  created_at: string;
  updated_at: string;
}

export interface AssistantMessage {
  id: string;
  thread_id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  message_text: string;
  created_at: string;
}

export interface SupportThread {
  id: string;
  account_id: string;
  status: "OPEN" | "RESOLVED" | "ESCALATED";
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  thread_id: string;
  role: "USER" | "ASSISTANT" | "HUMAN";
  message_text: string;
  created_at: string;
}

export interface Job {
  id: string;
  account_id: string;
  campaign_id: string | null;
  job_type: "WEBSITE_ANALYSIS" | "DRAFT_GENERATION" | "PDF_EXTRACTION" | "SLIDE_RENDER" | "PUBLISH";
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  payload_json: Record<string, unknown> | null;
  result_json: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
