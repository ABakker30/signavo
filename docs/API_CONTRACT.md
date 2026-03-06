# Signavo API Contract

## Purpose

This document defines the initial backend API contract for Signavo v1.

V1 is only for:
- real estate agents
- Hampton Roads, Virginia

## Global API Rules

### Response shape

**Success:**
```json
{
  "success": true,
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

### Auth
All `/api/*` dashboard-style routes require authenticated user context.

Public routes:
- example/demo
- public landing pages
- public assistant entry on published landing pages

### Validation
- Use strong input validation
- Reject malformed input early
- Use typed schemas for request bodies, query params, route params

## Route Groups
```
/api/account/*
/api/brand/*
/api/campaigns/*
/api/suggestions/*
/api/assistant/*
/api/support/*
/api/public/*
```

---

## 1. Account APIs

### GET /api/account/me
Return current authenticated account context.

### POST /api/account/create
Create initial account record after auth signup.

### PATCH /api/account/update
Update basic account information.

---

## 2. Brand APIs

### GET /api/brand/profile
Return brand profile for current account.

### POST /api/brand/analyze-website
Analyze optional website and return extracted cues. (Can be stubbed initially.)

### POST /api/brand/setup
Create or overwrite brand profile during onboarding.

### PATCH /api/brand/profile
Allow user to edit brand profile later.

---

## 3. Campaign APIs

### GET /api/campaigns
Return campaign list for current account.

### POST /api/campaigns
Create a new campaign and input payload.

Supported input types: PDF, URL, IMAGE, TEXT

### GET /api/campaigns/:id
Return one campaign with draft details.

### POST /api/campaigns/:id/generate-draft
Generate first draft for an existing campaign.

### POST /api/campaigns/:id/refine
Apply conversational refinement to the draft.

### POST /api/campaigns/:id/finalize
Move draft into ready-to-publish state.

### POST /api/campaigns/:id/publish
Publish finalized campaign.

---

## 4. Suggestions APIs

### GET /api/suggestions
Return weekly or signal-based suggestions for dashboard.

### POST /api/suggestions/:id/create-campaign
Create campaign from a suggestion.

### POST /api/suggestions/:id/dismiss
Dismiss a suggestion.

---

## 5. Consumer Assistant APIs

### POST /api/assistant/public/start
Start a public assistant thread for a landing page visitor.

### POST /api/assistant/public/message
Send a visitor message to public assistant.

---

## 6. Support Assistant APIs

### POST /api/support/thread/start
Start support conversation inside dashboard.

### POST /api/support/message
Send a support message and get answer-first response.

---

## 7. Public Landing APIs

### GET /api/public/landing/:slug
Return landing page data for public rendering.

---

## Suggested Types

### Brand status
- NOT_STARTED
- IN_PROGRESS
- FINALIZED

### Campaign status
- DRAFT
- DRAFT_READY
- READY_TO_PUBLISH
- PUBLISHED
- FAILED

### Suggestion type
- WEEKLY
- SIGNAL

### Input type
- PDF
- URL
- IMAGE
- TEXT

---

## Initial Backend Priorities

1. GET /api/account/me
2. POST /api/account/create
3. GET /api/brand/profile
4. POST /api/brand/setup
5. POST /api/campaigns
6. GET /api/campaigns
7. GET /api/campaigns/:id
8. POST /api/campaigns/:id/generate-draft
9. POST /api/campaigns/:id/refine
10. POST /api/campaigns/:id/publish
11. GET /api/suggestions
12. POST /api/support/message
