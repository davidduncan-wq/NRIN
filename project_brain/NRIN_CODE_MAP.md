# NRIN — CODE MAP

## Purpose
This file explains what important files and folders do.
It is not a file tree.
It is a meaning map for future AI and human operators.

Update this file whenever:
- a new major module is added
- responsibilities shift
- a file becomes canonical for a workflow

---

## Core Product Surfaces

### Patient Matching
- `src/app/patient/matches/page.tsx`
  - Patient match experience entry page
  - Fetches facility match inputs and renders match UI

- `src/components/patient/MatchCardStack.tsx`
  - Primary patient-facing match presentation surface
  - Handles navigation/swipe behavior and opening explanation/detail surface

- `src/components/patient/MatchDetailSheet.tsx`
  - Secondary detail/explanation surface
  - Shows deeper rationale and evidence links

---

## Matching Engine

- `src/lib/matching/matchPatientToFacilities.ts`
  - Canonical matcher orchestration
  - Applies filters, scoring, explanation building, and sorting

- `src/lib/matching/hardFilters.ts`
  - Hard inclusion/exclusion logic
  - Should remain logic-only

- `src/lib/matching/scorePrograms.ts`
  - Scores level-of-care and related program fit

- `src/lib/matching/scoreInsurance.ts`
  - Scores insurance compatibility

- `src/lib/matching/scoreSpecialties.ts`
  - Scores specialty/support fit (MAT, family, professional, etc.)

- `src/lib/matching/scoreConfidence.ts`
  - Scores confidence/quality signal from facility intelligence

- `src/lib/matching/buildMatchExplanation.ts`
  - Builds human-facing explanation reasons and cautions
  - Bridges matcher outputs to evidence-backed reasoning

- `src/lib/matching/buildMatchViewModel.ts`
  - Canonical presentation boundary
  - Shapes matcher output into UI-ready presentation and explanation model

- `src/lib/matching/types.ts`
  - Canonical shared types for matching pipeline
  - Keep shape definitions here, not runtime values

- `src/lib/matching/fetchFacilityMatches.ts`
  - Supabase adapter from facility intelligence + facility identity into FacilityMatchingInput

---

## Data Sources

### Canonical identity source
- `facility_sites`
  - Facility name, website, city, identity/location fields

### Canonical capability/evidence source
- `facility_intelligence`
  - Normalized program and insurance signals
  - Evidence arrays and matcher-facing capability layer

---

## Validation / Harness

- `scripts/testMatching.ts`
  - Real-data truth-finding harness for matching
  - Use before blaming the UI
  - Preferred place to validate mapping, hard filters, and evidence quality

---

## Brain / Continuity

- `project_brain/NEXT_SESSION_BOOT.md`
  - Canonical next-session startup instructions

- `project_brain/NRIN_ENGINEERING_HANDOFF.md`
  - Current working engineering continuity document

- `project_brain/NEXT_BUILD_TARGET.md`
  - Immediate build objective

- `project_brain/NRIN_DESIGN_SYSTEM.md`
  - Broad design philosophy and system-level UI principles

- `project_brain/matching/NRIN_MATCH_PRESENTATION_V1.md`
  - Match-surface-specific presentation spec
  - Use before changing patient match UI

- `project_brain/NRIN_FILE_TREE.md`
  - Repo structure snapshot
  - Read before changing files if path is uncertain

---

## Working Rules

- Matcher logic stays separate from presentation shaping
- Presentation shaping belongs in `buildMatchViewModel.ts`
- Components should render, not invent product philosophy
- Use `scripts/testMatching.ts` for real-data diagnosis
- Do not guess paths; consult `NRIN_FILE_TREE.md`

---

## Notes To Update Later

Add sections for:
- intake flow
- facility dashboard
- referral operations
- crawler pipeline
- asset / brochure layer
