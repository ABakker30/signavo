# Signavo Database Schema

## Purpose
Initial database model for Signavo v1. Real estate agents, Hampton Roads, Virginia.

## General Rules
- **Database:** Supabase Postgres
- **IDs:** UUIDs
- **Timestamps:** `created_at`, `updated_at` on every main table
- **Naming:** lowercase snake_case

## Core Entities

### 1. users
Auth handled by Supabase Auth. Minimal app-level profile.

| Field | Type |
|-------|------|
| id | uuid (maps to Supabase auth user id) |
| email | text |
| full_name | text |
| created_at | timestamptz |
| updated_at | timestamptz |

### 2. accounts
Business account. One user = one account in v1.

| Field | Type |
|-------|------|
| id | uuid |
| owner_user_id | uuid → users |
| business_name | text |
| industry_type | text (REAL_ESTATE) |
| city | text |
| region | text |
| postal_code | text |
| website_url | text |
| status | text (ACTIVE, SUSPENDED) |
| created_at | timestamptz |
| updated_at | timestamptz |

### 3. brand_profiles
Brand setup. Mandatory before first campaign.

| Field | Type |
|-------|------|
| id | uuid |
| account_id | uuid → accounts |
| status | text (NOT_STARTED, IN_PROGRESS, FINALIZED) |
| website_url | text |
| known_for | text (TRUSTED_ADVISOR, MARKET_EXPERT, NEIGHBORHOOD_SPECIALIST, RESULTS_DRIVEN, RELATIONSHIP_BUILDER) |
| tone | text (PROFESSIONAL, FRIENDLY, PREMIUM, DIRECT) |
| audience_focus | text (BUYERS, SELLERS, MILITARY_RELOCATION, INVESTORS) |
| positioning | text |
| assistant_intro | text |
| website_analysis_summary | text/json |
| created_at | timestamptz |
| updated_at | timestamptz |

### 4. campaigns
Core campaign record.

| Field | Type |
|-------|------|
| id | uuid |
| account_id | uuid → accounts |
| title | text |
| status | text (DRAFT, DRAFT_READY, READY_TO_PUBLISH, PUBLISHED, FAILED) |
| input_type | text (PDF, URL, IMAGE, TEXT) |
| raw_input_text | text |
| source_url | text |
| location_focus | text |
| campaign_language | text (default: en) |
| draft_caption | text |
| final_caption | text |
| published_slug | text |
| published_at | timestamptz |
| created_at | timestamptz |
| updated_at | timestamptz |

### 5. campaign_inputs
Uploaded/attached input references.

| Field | Type |
|-------|------|
| id | uuid |
| campaign_id | uuid → campaigns |
| input_type | text |
| storage_path | text |
| source_url | text |
| raw_text | text |
| created_at | timestamptz |
| updated_at | timestamptz |

### 6. campaign_slides
Draft/final slide content. Usually 5 slides per campaign.

| Field | Type |
|-------|------|
| id | uuid |
| campaign_id | uuid → campaigns |
| slide_index | integer |
| status | text (DRAFT, FINAL) |
| headline | text |
| body | text |
| footer_text | text |
| layout_type | text |
| rendered_image_url | text |
| slide_json | jsonb |
| created_at | timestamptz |
| updated_at | timestamptz |

### 7. landing_pages
Published landing page for a campaign.

| Field | Type |
|-------|------|
| id | uuid |
| campaign_id | uuid → campaigns |
| slug | text (unique) |
| headline | text |
| summary | text |
| content_json | jsonb |
| assistant_enabled | boolean (default: true) |
| published | boolean (default: false) |
| created_at | timestamptz |
| updated_at | timestamptz |

### 8. suggestions
Weekly and signal-based suggestions.

| Field | Type |
|-------|------|
| id | uuid |
| account_id | uuid → accounts |
| type | text (WEEKLY, SIGNAL) |
| title | text |
| description | text |
| status | text (NEW, DISMISSED, USED) |
| created_at | timestamptz |
| updated_at | timestamptz |

### 9. leads
Lead records from landing page assistant conversations.

| Field | Type |
|-------|------|
| id | uuid |
| account_id | uuid → accounts |
| campaign_id | uuid → campaigns |
| source_thread_id | uuid → assistant_threads |
| full_name | text |
| email | text |
| phone | text |
| lead_type | text (BUYER, SELLER, UNKNOWN) |
| urgency_level | text (LOW, MEDIUM, HIGH) |
| notes | text |
| created_at | timestamptz |
| updated_at | timestamptz |

### 10. assistant_threads
Public assistant conversation sessions on landing pages.

| Field | Type |
|-------|------|
| id | uuid |
| landing_page_id | uuid → landing_pages |
| visitor_token | text |
| thread_type | text (PUBLIC_LEAD, SUPPORT) |
| created_at | timestamptz |
| updated_at | timestamptz |

### 11. assistant_messages
Individual assistant messages.

| Field | Type |
|-------|------|
| id | uuid |
| thread_id | uuid → assistant_threads |
| role | text (USER, ASSISTANT, SYSTEM) |
| message_text | text |
| created_at | timestamptz |

### 12. support_threads
Support chat sessions inside dashboard.

| Field | Type |
|-------|------|
| id | uuid |
| account_id | uuid → accounts |
| status | text (OPEN, RESOLVED, ESCALATED) |
| created_at | timestamptz |
| updated_at | timestamptz |

### 13. support_messages
Support conversation messages.

| Field | Type |
|-------|------|
| id | uuid |
| thread_id | uuid → support_threads |
| role | text (USER, ASSISTANT, HUMAN) |
| message_text | text |
| created_at | timestamptz |

### 14. jobs (V1.1)
Background job states. Optional in first scaffold.

| Field | Type |
|-------|------|
| id | uuid |
| account_id | uuid → accounts |
| campaign_id | uuid → campaigns |
| job_type | text (WEBSITE_ANALYSIS, DRAFT_GENERATION, PDF_EXTRACTION, SLIDE_RENDER, PUBLISH) |
| status | text (QUEUED, RUNNING, COMPLETED, FAILED) |
| payload_json | jsonb |
| result_json | jsonb |
| error_message | text |
| created_at | timestamptz |
| updated_at | timestamptz |

## Table Relationships
- users → accounts (1:1 in v1)
- accounts → brand_profiles (1:1)
- accounts → campaigns (1:many)
- campaigns → campaign_inputs (1:many)
- campaigns → campaign_slides (1:many)
- campaigns → landing_pages (1:1)
- accounts → suggestions (1:many)
- landing_pages → assistant_threads (1:many)
- assistant_threads → assistant_messages (1:many)
- assistant_threads → leads (1:1)
- accounts → support_threads (1:many)
- support_threads → support_messages (1:many)

## Key Constraints
1. User cannot create a campaign unless brand setup is finalized
2. Each campaign defaults to 5 slides in v1
3. Landing page only publicly accessible once campaign is published
4. Suggestions remain lightweight and simple in v1
