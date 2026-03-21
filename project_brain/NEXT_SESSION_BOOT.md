# NRIN — NEXT SESSION BOOT

## Current Phase
Patient matches presentation redesign

## Current State
The matching engine is working against real Supabase data.

The patient matches route now:
- fetches real `facility_intelligence`
- joins identity from `facility_sites`
- falls back to demo facilities if fetch returns nothing
- supports evidence-backed explanations

This is no longer a demo-only matching UI.

---

## What Works Right Now

### Data / matching
- real `facility_intelligence` query works
- `facility_sites` join works
- `scripts/testMatching.ts` validated real matching
- evidence arrays contain usable snippets + URLs
- hard filters and scoring are working

### UI / route
- `/patient/matches` loads
- facility names display
- detail sheet opens
- explanation/evidence path works
- mobile and desktop are functional

---

## What Is NOT The Current Problem

Do NOT spend time on:
- crawler v2
- new matching logic
- new scoring rules
- widening scope into admin/facility flows

The current blocker is not intelligence.

The blocker is presentation quality.

---

## Core Principle To Preserve

### The facility should present itself
Not the system presenting the facility

### The explanation should justify the recommendation
Not expose matcher math

### The evidence should defend the explanation
Only after the user asks

Correct hierarchy:
1. facility presentation
2. human explanation
3. evidence / verification

---

## Design Philosophy

NRIN should not look or feel like:
- ChatGPT
- AI copilot UI
- SaaS dashboard
- debug console
- reasoning panel

NRIN should feel closer to:
- Apple product page
- concierge referral
- luxury brochure
- calm admissions surface

The visual tone should be:
- grounded
- quiet
- confident
- humane
- non-urgent

---

## Read These First

1. `project_brain/NRIN_MATCH_PRESENTATION_V1.md`
2. `project_brain/NRIN_DESIGN_SYSTEM.md`
3. `project_brain/NEXT_BUILD_TARGET.md`
4. `project_brain/NRIN_ENGINEERING_HANDOFF.md`

Then inspect these code files:

### View model / adapter
- `src/lib/matching/buildMatchViewModel.ts`
- `src/lib/matching/fetchFacilityMatches.ts`
- `src/lib/matching/buildMatchExplanation.ts`
- `src/lib/matching/types.ts`

### UI
- `src/components/patient/MatchCardStack.tsx`
- `src/components/patient/MatchDetailSheet.tsx`
- `src/app/patient/matches/page.tsx`

---

## Current Architecture Truth

### Matching / scoring
Keep intact.

### Presentation shaping
Should happen in:
- `buildMatchViewModel.ts`

### Rendering
Should happen in:
- `MatchCardStack.tsx`
- `MatchDetailSheet.tsx`

Do not let ad hoc component edits become the design system.

---

## Important Continuity Notes

### 1. Real-data harness exists
Use:
- `scripts/testMatching.ts`

If something about matching feels wrong, verify in the script before blaming the UI.

### 2. Identity comes from `facility_sites`
Do not use `matcher_summary` as the facility headline.

### 3. Logos were tested
Conclusion:
- logos are useful
- logos alone are underwhelming
- logos are supporting identity, not hero content

### 4. Brochure layer is a future phase
Do not build full brochure/media ingestion now.
But keep the design open to:
- logo
- hero image
- richer identity later

### 5. Crawler v2 is not the move right now
Stay focused on the presentation layer.

---

## Immediate Build Target

Implement Match Presentation V1.

### Meaning:
- card should become facility-first
- raw reasons should not dominate the card
- explanation should be on demand
- UI should stop feeling like a widget/dashboard
- preserve the evidence pipeline beneath the surface

---

## Practical Next Move

### First:
Inspect `buildMatchViewModel.ts`

Goal:
- ensure the presentation layer carries what the UI needs
- title
- subtitle
- location
- optional logo
- optional hero image
- CTA labels
- humane explanation summary

### Second:
Inspect `MatchCardStack.tsx`

Goal:
- remove system-forward presentation patterns
- reduce widget/card-stack feeling
- stop exposing AI/SaaS grammar
- render a facility-first surface

### Third:
Inspect `MatchDetailSheet.tsx`

Goal:
- explanation first
- evidence second
- links third

---

## Constraints

Do NOT:
- rewrite matcher
- rewrite crawler
- widen scope
- redesign from scratch in JSX without reference to spec
- reintroduce badges/scores/reason pills as primary UI
- expose raw internal matcher language

Do:
- stay surgical
- preserve wiring
- preserve data flow
- improve the visual grammar
- keep the long-game brochure philosophy in mind

---

## One-Line Mission

Turn the working evidence-backed match experience into a calm, premium, facility-first presentation surface without breaking the underlying system.

Before making any file changes, read NRIN_FILE_TREE.md to understand project structure and read NRIN_CODE_MAP.md. Do not guess paths or responsibilities.