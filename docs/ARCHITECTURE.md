# Signavo Architecture

## Project Name
Signavo

## Purpose
Signavo is an AI-powered presence engine for real estate agents in Hampton Roads, Virginia.

The system helps agents:
- establish a brand
- generate polished market update campaigns
- publish landing pages
- share carousel slides manually
- maintain consistent presence
- pre-qualify leads through a branded assistant

This is not a CRM, ad manager, or social scheduler.

## Architecture Principles

### 1. Keep V1 narrow
V1 is for real estate only, Hampton Roads only. Do not generalize early.

### 2. Keep user experience simple
The user experience must feel light, fast, clear, and professional.

### 3. The system is intelligent under the hood
Internally the system may use agents, jobs, and orchestration, but the user should only experience clean onboarding, quick draft generation, easy refinement, and smooth publishing.

### 4. Build in vertical slices
Each feature should include UI, API, database support, and job logic if needed.

## Tech Stack
- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Backend:** Next.js route handlers / server actions
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage initially
- **Rendering:** HTML/CSS templates rendered to social images (later)
- **Jobs:** Background processing for website crawl, PDF extraction, campaign generation, rendering

## Folder Structure
```
/src
  /app
    /(marketing)       — public pages
    /(auth)            — login, signup
    /(dashboard)       — authenticated dashboard
    /api               — API route handlers
    /p/[slug]          — public landing pages
  /components
    /ui
    /brand
    /campaign
    /landing
    /assistant
    /support
  /lib
    /auth
    /db
    /brand
    /campaign
    /assistant
    /support
    /jobs
    /utils
    /types
/docs
/public
```

## Core Domain Modules

### Account Module
- Account creation, business name, location
- One user per account (V1)

### Brand Module
- Collect brand onboarding answers
- Store brand profile (tone, positioning, audience focus)
- Brand setup is mandatory before first campaign

### Campaign Module
- Accept input (PDF, URL, image, text)
- Generate draft → review → refine → finalize → publish
- Draft generation does not consume credits

### Landing Page Module
- Store and render campaign landing pages
- Professional, authority-first, non-pushy

### Assistant Module
- Consumer assistant on landing pages (subtle, branded)
- Support assistant inside dashboard (answer-first)

### Suggestion Module
- Weekly content suggestions
- Signal-triggered suggestions (later)

## Data Model
Main entities: `users`, `accounts`, `brand_profiles`, `campaigns`, `campaign_inputs`, `landing_pages`, `leads`, `support_threads`

- UUID primary keys
- Timestamps: `created_at`, `updated_at`

## API Routes
```
/api/brand/*
/api/campaigns/*
/api/assistant/*
/api/support/*
```

## State Model
- **Brand status:** not_started → in_progress → finalized
- **Campaign status:** draft → ready_to_finalize → published | failed

## UI Pages
### Public
- `/` — home
- `/login`, `/signup`

### Dashboard
- `/dashboard`
- `/dashboard/onboarding`
- `/dashboard/brand`
- `/dashboard/campaigns`, `/dashboard/campaigns/new`, `/dashboard/campaigns/[id]`
- `/dashboard/suggestions`
- `/dashboard/support`

### Landing Pages
- `/p/[slug]`

## Design Tone
Modern, minimal, professional, calm, local-business friendly.

## V1 Non-Goals
- Social media scheduling
- CRM functionality
- Advanced analytics
- Multi-industry support
- Complex customization
