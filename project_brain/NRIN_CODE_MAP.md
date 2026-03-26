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

### Patient Intake
- `src/app/patient/page.tsx`
  - Canonical patient intake orchestrator
  - Owns `FormState`, step flow, recommendation handoff, and patient-side match launch

- `src/app/patient/components/Step5LifeFit.tsx`
  - Soft-signal / optional life-fit and funding-preference capture
  - Feeds matcher-facing life-fit and payment-path signals
  - Must remain intake UI, not matcher logic

### Patient Matching
- `src/app/patient/matches/page.tsx`
  - Patient match experience entry page
  - Fetches facility match inputs and renders match UI

- `src/components/patient/MatchCardStack.tsx`
  - Primary patient-facing match presentation surface
  - Handles single-card navigation, card-level pills, and opening detail surface

- `src/components/patient/MatchDetailSheet.tsx`
  - Secondary detail/explanation surface
  - Shows deeper rationale, evidence-backed strengths, cautions, and next-step guidance

---

## Matching Engine

### Input boundary
- `src/lib/matching/buildPatientProfile.ts`
  - Canonical intake-to-matcher translator
  - Converts patient form state + recommendation result into `PatientMatchingInput`
  - Builds life-fit signals, funding/insurance state, specialty desires, and desired levels of care

### Matcher orchestration
- `src/lib/matching/matchPatientToFacilities.ts`
  - Canonical matcher orchestration
  - Applies filters, scoring, explanation building, sorting, and top-result diversification

- `src/lib/matching/hardFilters.ts`
  - Hard inclusion/exclusion logic
  - Should remain logic-only

### Scoring
- `src/lib/matching/scorePrograms.ts`
  - Scores level-of-care fit
  - Primary-vs-secondary level weighting
  - Must remain clinical/program logic only

- `src/lib/matching/scoreInsurance.ts`
  - Scores financial compatibility
  - Supports progressive certainty:
    - exact carrier match
    - likely insurance compatibility
    - self-pay / indigent fallback

- `src/lib/matching/scoreSpecialties.ts`
  - Scores specialty/support fit
  - Current structured signals:
    - MAT
    - family program
    - professional program

- `src/lib/matching/scoreConfidence.ts`
  - Scores confidence / quality signal from facility intelligence

### Explanation / output boundary
- `src/lib/matching/buildMatchExplanation.ts`
  - Builds human-facing reasons and cautions
  - Evidence-aware explanation layer
  - Should describe certainty honestly

- `src/lib/matching/buildMatchViewModel.ts`
  - Canonical presentation boundary
  - Shapes matcher output into UI-ready presentation and explanation model
  - This is the output bridge between engine and UI

- `src/lib/matching/types.ts`
  - Canonical shared types for matching pipeline
  - Keep shape definitions here, not runtime values

### Data adapter
- `src/lib/matching/fetchFacilityMatches.ts`
  - Supabase adapter from facility intelligence + facility identity into `FacilityMatchingInput`

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

- `project_brain/NRIN_COMMAND_CENTER.md`
  - Active execution doctrine / current state file
  - Read first in new coding chats

---

## Shared / Planned Presentation Bridge

- `src/components/matching/*`
  - Not active runtime surface right now
  - Zero-byte stubs / unfinished extraction targets
  - Likely intended future shared presentation bridge between patient match UI and facility-side/shared matching surfaces
  - Do not delete casually
  - Do not treat as canonical runtime until intentionally activated

---

## Working Rules

- `buildPatientProfile.ts` is the input boundary
- `buildMatchViewModel.ts` is the output boundary
- Matcher logic stays separate from presentation shaping
- Presentation shaping belongs in `buildMatchViewModel.ts`
- Components should render, not invent product philosophy
- Use `scripts/testMatching.ts` for real-data diagnosis
- Do not guess paths; consult `NRIN_FILE_TREE.md`

---

## Notes To Update Later

Add sections for:
- facility dashboard
- referral operations
- crawler pipeline
- asset / brochure layer
- life-fit preference scoring once facility-side structured signals exist
