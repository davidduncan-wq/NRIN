# NRIN — NEXT BUILD TARGET

## Phase
Patient Matching → Match Presentation V1

## Objective
Transform the current working patient match experience into a high-trust, premium, facility-first presentation surface.

The matching system already works.

The next task is to make the experience feel:
- calm
- trustworthy
- humane
- premium

without changing the underlying matcher.

---

## Current Truth

### Working
- real `facility_intelligence` fetch
- real `facility_sites` identity join
- evidence-backed explanations
- detail sheet with real snippets + URLs
- demo fallback preserved

### Not yet strong enough
- visual language still feels too much like AI/SaaS product grammar
- match card still feels too much like a widget/component
- facility presentation is not yet brochure-quality
- explanation hierarchy still needs refinement

---

## Core Rule

The card should sell the facility.

The explanation should sell the recommendation.

The evidence should defend the explanation.

---

## Build Priorities

### 1. View model as presentation boundary
File:
- `src/lib/matching/buildMatchViewModel.ts`

Ensure this layer owns:
- title
- subtitle
- location
- optional logo
- optional hero image
- CTA labels
- humane explanation summary

### 2. Facility-first card surface
File:
- `src/components/patient/MatchCardStack.tsx`

Render only what belongs on the primary surface:
- identity
- reassurance
- action
- subtle navigation

No score leakage.
No reason pills.
No debug-style boxes.

### 3. Explanation-first detail sheet
File:
- `src/components/patient/MatchDetailSheet.tsx`

Hierarchy:
1. humane explanation summary
2. structured reasons
3. evidence links

### 4. Preserve future brochure path
Current pass should remain compatible with later:
- logos
- hero imagery
- brochure-level facility assets

---

## Non-Goals

Do NOT:
- change scoring
- change filters
- change crawler
- build crawler v2
- widen into other product surfaces

---

## Success Criteria

When this pass is done, the user should feel:

“This looks like a real place I could go.”

Not:

“This is an AI system recommending something.”