# Signavo UI Pages Specification

## Purpose

This document defines the initial UI pages for Signavo v1.

V1 is only for:
- Real estate agents
- Hampton Roads, Virginia

The pages should feel:
- simple
- calm
- professional
- modern
- not technical
- not enterprise-heavy

The goal is to help agents quickly feel:
> "This makes me look established."

---

## Global UI Rules

### Design tone

Use:
- clean spacing
- modern cards
- soft borders
- clear typography hierarchy
- neutral professional palette
- minimal clutter

Avoid:
- bright startup colors
- overly playful UI
- complex admin dashboard style
- too many buttons on one screen

### Layout rules
- Desktop-first but responsive
- Mobile should still feel polished
- Left navigation is acceptable inside dashboard
- Keep forms short
- Use progress indicators when helpful

### Required app states

Each page should support:
- loading
- empty state
- error state
- success state

---

## 1. Public Home Page

**Route:** `/`

**Goal:** Explain Signavo simply and get visitors to view example, sign up, or log in.

### Content sections

#### Hero
- **Headline:** clear value proposition focused on local presence and professionalism
- **Subheadline:** Signavo helps Hampton Roads real estate agents publish market updates that look polished and established
- **Primary CTA:** View Example
- **Secondary CTA:** Get Started

#### How it works
3 simple steps:
1. Establish your brand
2. Generate your market update
3. Publish and share

#### Product promise
Short section explaining:
- weekly visibility
- better branding
- subtle lead qualification

#### Example preview section
Show:
- 1 sample carousel image
- 1 sample landing page screenshot
- CTA: See Full Example

#### Footer
Include: Sign in, Terms, Privacy

---

## 2. Example Page

**Route:** `/example`

**Goal:** Show a realistic Signavo output before signup.

### Sections

#### Intro
- **Headline:** Example Hampton Roads Market Update
- **Explanation:** This is what a Signavo-generated market update can look like.

#### Carousel preview
Show 5 example slides in a horizontal or grid layout.

#### Landing page preview
Show: hero area, content section, assistant bubble mockup, CTA block
- **Headline:** Want updates like this for your own brand?
- **Buttons:** Start Your Brand Setup, Sign Up

---

## 3. Sign Up Page

**Route:** `/signup`

**Goal:** Create account quickly.

### Fields
- Full name
- Email
- Password
- Business name
- Hampton Roads location hint or ZIP code
- Terms and privacy checkbox
- Optional: Website URL

### Buttons
- Create Account
- Secondary: Already have an account? Log in

**UX notes:** Keep this page short. Do not ask too many marketing questions here.

---

## 4. Login Page

**Route:** `/login`

### Fields
- Email
- Password

### Buttons
- Log In
- Secondary: Forgot password, Create account

---

## 5. Dashboard Home

**Route:** `/dashboard`

**Goal:** Give the user a simple control center.

### Main sections

#### Welcome card
- Example: Welcome back, [Name]
- Ready to stay visible this week?
- **Primary CTA:** Create Market Update

#### Brand status
- If brand not finished: show mandatory onboarding card, CTA: Finish Brand Setup
- If complete: show brief brand summary, CTA: Edit Brand

#### Suggested this week
Show 1–2 suggestions:
- Weekly market update
- Rate change commentary
- Seasonal insight

Each suggestion card has: title, short explanation, Create Draft button

#### Recent campaigns
Simple list of most recent campaigns with status: Draft, Published
- **Button:** View All Campaigns

#### Help card
- Short prompt: Need help? Ask Signavo.
- **Button:** Open Help

---

## 6. Onboarding Page

**Route:** `/dashboard/onboarding`

**Goal:** Guide the user from first login into brand setup.

### Structure

#### Intro section
- **Headline:** Let's establish your brand
- **Explanation:** Before your first market update, Signavo needs to understand how you want to show up.
- **Button:** Start Brand Setup

#### Progress indicator
Simple 3-step indicator:
1. Brand
2. First Draft
3. Publish

---

## 7. Brand Setup Page

**Route:** `/dashboard/brand`

**Goal:** Complete required brand setup before first campaign.

### Section A: Website
- Field: Website URL (optional)
- Button: Analyze Website
- If website exists: show extracted tone preview

### Section B: Brand questions

**Question 1:** How do you want to be known locally?
Options: Trusted advisor, Market expert, Neighborhood specialist, Results-driven seller, Relationship builder

**Question 2:** How should your tone feel?
Options: Professional, Friendly, Premium, Direct

**Question 3:** Who do you work with most?
Options: Buyers, Sellers, Military relocation, Investors

### Section C: Brand preview
Show: sample market update headline, sample landing page header, assistant intro
- Text: Does this feel like you?
- Buttons: Looks Good, Adjust

### Bottom actions
- Save Brand Profile
- Back

---

## 8. Campaign List Page

**Route:** `/dashboard/campaigns`

**Goal:** Show all campaigns clearly.

### Content

#### Header
- **Headline:** Your Market Updates
- **Primary CTA:** Create New Campaign

#### Campaign cards or table
Each campaign shows: title, status, created date, published date if available
- Buttons: View, Edit Draft, View Landing Page

#### Empty state
- **Headline:** No market updates yet
- **Button:** Create Your First Update

---

## 9. New Campaign Page

**Route:** `/dashboard/campaigns/new`

**Goal:** Let the user provide input and generate a first draft.

### Input options
- Upload PDF (file upload)
- Paste URL (URL input)
- Upload image (image upload)
- Describe it (multiline text area)

### Action buttons
- Generate Draft
- Secondary: Cancel

**UX notes:** Do not ask strategic questions yet. Generate first, refine after.

---

## 10. Campaign Draft Page

**Route:** `/dashboard/campaigns/[id]`

**Goal:** Show draft preview and allow refinement.

### Layout

#### Header
- **Headline:** Draft Preview
- **Subtext:** This is your first draft. Would you like to adjust anything before finalizing?

#### Main preview area
Show: 5 draft slides, landing page preview block, caption preview block

#### Action bar
Buttons: Refine with AI, Regenerate, Finalize, Back

#### AI refinement panel
Collapsible side panel or drawer with prompt examples:
- Make this more professional
- Make this more seller-focused
- Emphasize Virginia Beach
- Less salesy

Input: text prompt field
Button: Apply Refinement

---

## 11. Finalization Page

**Route:** `/dashboard/campaigns/[id]/finalize`

**Goal:** Confirm before publish.

### Content

#### Summary
Show: campaign title, location emphasis, tone summary, CTA summary

#### Final previews
- Final slide preview
- Landing page preview
- URL preview

#### Actions
- Publish & Generate Assets
- Go Back & Refine

---

## 12. Suggestions Page

**Route:** `/dashboard/suggestions`

**Goal:** Show proactive Signavo suggestions.

### Content

#### Header
- **Headline:** Suggested for You
- **Subtext:** Timely ideas to help you stay visible in Hampton Roads.

#### Suggestion cards
For each suggestion show: title, why this matters now, Create Draft button, Dismiss button

Examples:
- Mid-Month Market Snapshot
- Rate Change Commentary
- Spring Seller Activity Update

---

## 13. Support Page

**Route:** `/dashboard/support`

**Goal:** Provide answer-first help.

### Layout

#### Header
- **Headline:** Help
- **Subtext:** Ask Signavo anything about your account, brand, campaigns, or publishing.

#### Chat interface
Message list, Input field, Send button

Support agent behavior: answer first, only clarify if needed, offer fix actions when possible

#### Quick help suggestions
Buttons:
- Why is my PDF not working?
- Help me improve this draft
- How do I edit my brand?
- Where is my published page?

---

## 14. Published Landing Page

**Route:** `/p/[slug]`

**Goal:** Public-facing market update page.

### Sections

#### Hero
- Market update headline
- Short summary
- Agent name / business branding
- Hampton Roads or local area reference

#### Content section
Narrative explanation of the update. Should feel: informative, polished, trustworthy

#### CTA section
Soft CTA examples:
- Thinking about buying?
- Considering selling?
- Curious how this applies to your neighborhood?

#### Assistant entry
- Subtle assistant bubble appears after delay
- Bubble example: Have a question about this update?
- When opened: assistant intro tied to agent brand

---

## 15. Minimal Settings / Edit Brand Page

**Route:** `/dashboard/brand` (reuse)

**Goal:** Allow simple brand edits later.

### Editable fields
- website URL
- local positioning
- tone
- audience
- assistant intro

### Buttons
- Save Changes
- Preview

No advanced settings in v1.

---

## UX Priorities By Screen

**Highest priority screens:**
1. Brand setup
2. New campaign
3. Draft preview
4. Finalize
5. Public landing page

These must feel strongest first.

---

## Copy Style Guidance

Use short, calm, non-technical language.

Prefer:
- "Create Market Update"
- "Looks Good"
- "Refine with AI"
- "Publish"
- "Suggested for You"

Avoid:
- "Configure campaign intent"
- "Optimize conversion funnel"
- "Run automation"
- "Manage content pipeline"

---

## Final Notes

When scaffolding these pages:
- build the routes first
- use placeholder data where needed
- keep components modular
- keep forms short
- avoid over-engineering
- prioritize the flow from signup → brand → first draft → publish

The most important thing is not technical completeness.
It is helping the user quickly feel:
> "This makes me look established."
