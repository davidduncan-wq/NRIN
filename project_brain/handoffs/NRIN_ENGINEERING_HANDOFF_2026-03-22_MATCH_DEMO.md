# NRIN — ENGINEERING HANDOFF — 2026-03-22 — MATCH DEMO STATE

## Session Outcome

This session successfully restored the correct product separation between:

- intake flow
- recommendation flow
- future adaptive expansion flow

The system is now back on the right structural track for demo use.

---

## What Was Accomplished

### 1. Recommendation was removed from intake Step 7
The earlier mistake of embedding the recommendation surface inside:

`src/app/patient/page.tsx`

was reversed.

Step 7 is now once again:
- summary
- initials
- submit intake

It is no longer:
- summary + recommendation jammed together

This restored design integrity and product flow clarity.

---

### 2. Routing was restored
The patient flow now correctly works as:

- intake in `src/app/patient/page.tsx`
- submit intake
- redirect to `src/app/patient/matches/page.tsx`

This is the correct architecture.

---

### 3. Recommendation surface was preserved and improved
The recommendation page in:

`src/app/patient/matches/page.tsx`

and supporting UI in:

`src/components/patient/MatchCardStack.tsx`

are now in a strong demo-ready state.

Major improvements made this session:
- swipe model removed
- modal/detail-sheet-as-dating-card feel removed
- inline explanation model used instead
- recommendation card cleaned up significantly
- signal pills introduced and refined
- subtle entry motion added
- recommendation flow now feels much more like a product decision surface

---

### 4. Design / logic separation improved
This session corrected multiple instances of design drifting into the wrong layer.

Current intended separation:

- `src/lib/matching/buildMatchViewModel.ts`
  - language / presentation shaping
- `src/components/ui/SignalPill.tsx`
  - signal visual primitive
- `src/components/ui/SurfaceCard.tsx`
  - shared card material / shell
- `src/components/patient/MatchCardStack.tsx`
  - recommendation composition
- `src/app/patient/matches/page.tsx`
  - page composition and routing destination
- `src/app/patient/page.tsx`
  - intake flow only

This separation should be preserved.

---

### 5. Step 5 annoying follow-up was disabled
The intrusive follow-up logic in:

`src/app/patient/components/Step5LifeFit.tsx`

was identified as the source of the annoying “Is there anything about work or career we should consider?” behavior.

This was disabled for now by replacing the follow-up return logic with:
- `return null;`

This keeps Step 5 clean for demo purposes.

Important:
This logic was not conceptually abandoned.
It was determined to be in the wrong place.

It should later be repurposed for post-recommendation adaptive prompting only.

---

### 6. AIR / adaptive prompt groundwork exists but is dormant
These files now exist:

- `src/components/patient/AdaptiveIntakePrompt.tsx`
- `src/lib/patient/getAdaptivePrompt.ts`

They are intentionally not wired into current live recommendation flow.

Reason:
Adaptive prompting should only happen after:
- patient sees recommendation
- patient asks for more options
- system determines not enough Step 5 / preference signal exists

It should NOT fire during normal Step 5 completion.

---

### 7. Matching recommendation page is now much cleaner
Current general state of:

`src/app/patient/matches/page.tsx`

- simpler header
- better hierarchy
- no more smashed intake + recommendation layout
- card is the hero
- recommendation page is much more stakeholder-presentable

---

## Important Product Realizations From This Session

### A. Need, want, and offering must be separated
This session clarified a major doctrine shift:

1. what the patient needs
2. what the patient wants
3. what the facility offers

These should not be blended.

Correct product flow:

- first determine need
- then show facilities that deliver that need
- only if patient wants more or different options should preference detail become more important

This doctrine was captured in:
`project_brain/matching/NRIN_NEEDS_WANTS_OFFERINGS_DOCTRINE.md`

---

### B. Adaptive prompting belongs behind “more options”
Adaptive prompting should only be used after the patient rejects or is unsatisfied with initial recommendation options.

Not during:
- initial Step 5
- summary
- first recommendation render

This is now canonical.

---

### C. Progress bar vs placement timeline are different systems
This session also clarified that:
- intake progress
- placement progress

are not the same thing.

Intake progress is a form-step model.
Placement progress should later be a live operational timeline (FedEx / Uber / Instacart style).

This doctrine was captured in:
`project_brain/operations/NRIN_PLACEMENT_TIMELINE_DOCTRINE.md`

---

### D. Facility asset/language priority doctrine was captured
This was also locked in:

1. facility-provided onboarding/dashboard content first
2. crawler-derived content second
3. normalized NRIN fallback third

Captured in:
`project_brain/matching/NRIN_BROCHURE_ASSET_PRIORITY_DOCTRINE.md`

---

### E. Negative fit / red-X doctrine was captured
The concept that NRIN should eventually show:
- not only what fits
- but also what does NOT fit

especially for alternative or user-requested facilities, was captured in:
`project_brain/matching/NRIN_NEGATIVE_FIT_SIGNAL_DOCTRINE.md`

This is important future trust infrastructure, but was not implemented in this session.

---

## Current Demo State

### What works now
- intake flow
- Step 7 summary-only
- submit intake
- redirect to `/patient/matches`
- recommendation page
- recommendation card
- signal pills
- subtle entry motion
- cleaner hierarchy

### What is intentionally NOT wired now
- adaptive prompt in live recommendation flow
- more-options expansion flow
- red-X negative fit comparisons
- real post-recommendation preference refinement loop
- placement timeline
- facility-side acceptance / rejection loop

---

## Files Most Relevant To Next Session

### Intake
- `src/app/patient/page.tsx`
- `src/app/patient/components/Step5LifeFit.tsx`

### Matches page
- `src/app/patient/matches/page.tsx`
- `src/components/patient/MatchCardStack.tsx`
- `src/components/patient/MatchDetailSheet.tsx`

### UI primitives
- `src/components/ui/SignalPill.tsx`
- `src/components/ui/SurfaceCard.tsx`

### Matching language / shaping
- `src/lib/matching/buildMatchViewModel.ts`

### Dormant adaptive prompt groundwork
- `src/components/patient/AdaptiveIntakePrompt.tsx`
- `src/lib/patient/getAdaptivePrompt.ts`

### New doctrine files from this session
- `project_brain/matching/NRIN_BROCHURE_ASSET_PRIORITY_DOCTRINE.md`
- `project_brain/matching/NRIN_NEGATIVE_FIT_SIGNAL_DOCTRINE.md`
- `project_brain/matching/NRIN_NEEDS_WANTS_OFFERINGS_DOCTRINE.md`
- `project_brain/operations/NRIN_PLACEMENT_TIMELINE_DOCTRINE.md`

---

## Strong Recommendation For Next Session

Do NOT start by adding more logic.

Next session should focus on:
- getting the demo page state clean and stable
- tightening copy
- ensuring Step 7 → matches redirect flow is smooth
- deciding whether to add a minimal “See more options” entry point on the matches page

Do NOT re-embed recommendation into intake.

Do NOT re-activate Step 5 follow-up questioning inside intake.

Do NOT drift design decisions into random page files without tracing source-of-truth first.

---

## Proposed Next Infrastructure Task (Important)

Create a living UI map / schematic file.

Not just a file tree.

Something like:
`project_brain/NRIN_UI_COMPONENT_MAP.md`

It should describe:
- where headings come from
- where page-level typography lives
- where card shell lives
- where signal pill lives
- where page composition lives
- where matching language comes from

This will save significant time and prevent future “hunt the header / font / wrapper” waste.

