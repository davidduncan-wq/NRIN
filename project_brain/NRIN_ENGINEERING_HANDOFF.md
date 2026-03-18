# NRIN — ENGINEERING HANDOFF

## Session Outcome

This session moved NRIN patient matching from a mostly demo-style surface to a real-data, evidence-backed matching flow.

By end of session:

- `/patient/matches` uses real `facility_intelligence` data with demo fallback
- facility identity is joined from `facility_sites`
- real facility names now display instead of `matcher_summary` as headline
- match reasons support:
  - `label`
  - `snippet`
  - `sourceUrl`
  - `sourceLabel`
  - `anchorId`
- insurance evidence is flowing from normalized crawler evidence into match explanation
- detox and MAT evidence are also flowing from normalized crawler evidence into match explanation
- real matching against Supabase was validated through `scripts/testMatching.ts`
- patient matches UI is functional on desktop and mobile
- design quality is still rough and is the next focus

---

## Most Important Product Breakthrough

NRIN now has the beginnings of a true evidence-backed placement engine.

The system can now show:

- the match
- the explanation
- the actual supporting snippet from the facility site
- the page URL where the evidence came from

This is no longer just a scoring demo.

---

## What Changed

### 1. View model became evidence-aware

File:
- `src/lib/matching/buildMatchViewModel.ts`

Changes:
- `reasons` are now normalized into structured reason objects
- `MatchViewModel` now supports:
  - `presentation`
  - `explanation`
- this creates the correct boundary between:
  - matcher logic
  - presentation shaping
  - UI rendering

Current direction:
- presentation should be shaped in the view model
- UI should render the shaped presentation
- matcher should remain logic-only

---

### 2. Matching types expanded safely

File:
- `src/lib/matching/types.ts`

Key additions:
- `MatchReasonEvidence`
- optional passthrough identity fields on `FacilityMatchingInput`
- optional passthrough identity fields on `FacilityMatchResult`
- optional evidence arrays:
  - `rawProgramEvidence`
  - `rawInsuranceEvidence`

Important note:
During the session, a bad type line was briefly introduced:
- `logoUrl: undefined,`

That was incorrect in a type definition.
Correct form is:
- `logoUrl?: string`

Current rule:
Types define shape only. No runtime values inside type declarations.

---

### 3. Explanation layer now supports real crawler evidence

File:
- `src/lib/matching/buildMatchExplanation.ts`

Current state:
- insurance reason uses real evidence snippet + page URL
- detox reason uses real evidence snippet + page URL
- MAT reason uses real evidence snippet + page URL
- other reasons still partly rely on fallback copy

This file is now the bridge between:
- matcher output
- crawler evidence
- humane explanation surface

---

### 4. Real Supabase adapter now exists for matches

File:
- `src/lib/matching/fetchFacilityMatches.ts`

Purpose:
- fetch `facility_intelligence`
- join identity from `facility_sites`
- map into `FacilityMatchingInput[]`

Important mapping truths:
- `facility_intelligence` = capabilities + evidence
- `facility_sites` = identity

`facility_intelligence` contains:
- `offers_*`
- `detected_program_types`
- `detected_insurance_carriers`
- `matcher_summary`
- `confidence_score`

`facility_sites` contains:
- `name`
- `website`
- `city`

Important join note:
The `facility_sites` join was validated directly from Supabase.
Returned shape was an object in the observed query result, not a missing relation.

---

### 5. `/patient/matches` now uses real data with fallback

File:
- `src/app/patient/matches/page.tsx`

Current behavior:
- fetches real facilities through `fetchFacilityMatchingInputs()`
- falls back to `demoFacilities` if fetch returns nothing

This route should remain:
- stable
- presentational
- not a debugging harness

---

### 6. `scripts/testMatching.ts` became the real-data harness

File:
- `scripts/testMatching.ts`

This was used to validate matching against real Supabase rows before trusting the UI.

Key result from session:
- fetched 100 rows
- mapped 100 rows
- found 52 matches for test patient

This proved:
- hard filters are working
- insurance normalization is working
- real matching is working
- evidence arrays contain usable snippets and URLs

Important continuity rule:
Use the script for truth-finding before using the UI for interpretation.

---

## Data Model Truths Confirmed

### `facility_intelligence` is not the presentation table

It contains:
- capability booleans
- normalized evidence arrays
- matcher summary
- confidence score

It does not contain:
- polished brochure identity
- hero assets
- usable premium imagery by default

### `facility_sites` is the identity table

It contains:
- `id`
- `name`
- `website`
- `city`
- location/contact-style identity fields

Correct architecture:
- `facility_intelligence` = capability + evidence
- `facility_sites` = identity
- future asset layer = logo / hero image / brochure assets

---

## Design/Product Insight Established

A major design principle was clarified this session:

### The card should sell the facility
Not show the system’s internal reasoning

### The explanation should sell the recommendation
Not expose matcher math

### The evidence should defend the explanation
Only after the user wants to drill down

This means the correct hierarchy is:

1. facility presentation
2. human explanation
3. evidence / links

Not:
1. reasons
2. scores
3. system signals

---

## Design Philosophy Established

NRIN should not feel like:
- ChatGPT
- an AI copilot
- a dashboard
- a reasoning console
- a debug surface

NRIN should feel closer to:
- Apple product page
- luxury brochure
- concierge medical referral
- private placement memo

The system must feel:
- calm
- confident
- human
- grounded
- non-urgent

Not:
- machine-explanatory
- pill-heavy
- score-heavy
- “AI-looking”

---

## Important Design Discovery

Real logo testing was attempted.

What was learned:
- logos/favicons are useful identity support
- logos alone do not create a premium surface
- low-resolution logos can feel underwhelming when oversized
- logos should be supporting identity, not hero content

Strategic conclusion:
- brochure layer remains the right long-game
- logo is useful
- hero/media asset layer will matter more than favicon alone

---

## Match Presentation Spec Was Defined

A new brain/spec direction was created:

Suggested file:
- `project_brain/NRIN_MATCH_PRESENTATION_V1.md`

That spec establishes:
- facility-first presentation
- explanation on demand
- evidence one layer deeper
- identity > reassurance > CTA > explanation > verification

The next chat should read and use that spec before doing more UI work.

---

## Current UX Reality

### Working
- real match data
- real facility names
- evidence-backed detail sheet
- explanation CTA direction established
- desktop and mobile functional

### Not yet good enough
- visual language still feels too much like an AI/SaaS tool
- card/page composition still carries OpenAI-like fingerprints
- typography and layout need a stronger non-widget grammar
- premium brochure feel is not there yet

---

## Architectural Continuity Rules

Do not forget these:

### 1. Presentation shaping belongs in the view model
Not in JSX improvisation

### 2. UI components should render, not invent design language
Design intent should come from:
- brain/spec
- view model
- then component

### 3. Test before wiring
Especially when crossing:
- type boundaries
- result shapes
- joined data
- asset fields

### 4. Do not widen scope
Do not pivot to crawler v2 right now.
Current answer remains:
- keep current crawler
- finish the design/presentation layer first

---

## Immediate Next Priority

### NOT:
- more crawler work
- more scoring work
- more matching logic

### YES:
- implement Match Presentation V1 cleanly
- preserve the evidence pipeline
- preserve real-data adapter
- reduce AI-looking UI patterns
- move toward facility-first, brochure-ready presentation

---

## Files Most Relevant Next Session

### Brain / spec
- `project_brain/NRIN_MATCH_PRESENTATION_V1.md`
- `project_brain/NRIN_DESIGN_SYSTEM.md`
- `project_brain/NEXT_BUILD_TARGET.md`

### Data / view model
- `src/lib/matching/types.ts`
- `src/lib/matching/fetchFacilityMatches.ts`
- `src/lib/matching/buildMatchViewModel.ts`
- `src/lib/matching/buildMatchExplanation.ts`
- `src/lib/matching/matchPatientToFacilities.ts`

### UI
- `src/app/patient/matches/page.tsx`
- `src/components/patient/MatchCardStack.tsx`
- `src/components/patient/MatchDetailSheet.tsx`

### Harness
- `scripts/testMatching.ts`

---

## Warning For Next AI

Do not keep making design decisions directly in Tailwind class edits without reference to the presentation spec.

The drift risk is:
- endless cosmetic iteration
- component-level taste decisions
- reintroducing AI/SaaS grammar
- breaking the separation between presentation and rendering

The correct order is:
1. brain/spec
2. view model
3. component render

---

## Executive Summary

NRIN now has:

- real-data matching
- evidence-backed explanations
- identity joined from canonical facility table
- a functioning patient match experience

The next phase is not more intelligence work.

The next phase is:
**turning the working match system into a facility-first, humane, premium placement surface without breaking the underlying evidence pipeline.**