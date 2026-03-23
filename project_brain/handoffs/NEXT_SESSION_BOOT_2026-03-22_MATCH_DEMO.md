# NRIN — NEXT SESSION BOOT — 2026-03-22 — MATCH DEMO

YOU ARE THE RECEIVING AI.

Do not create a new handoff.
Do not summarize old handoffs unless explicitly asked.
Do not guess where design lives.
Trace the real source before editing.

---

## Read These First In This Order

1. `project_brain/NRIN_CANONICAL_STATE.md`
2. `project_brain/NRIN_SURGICAL_EDIT_RULES.md`
3. `project_brain/handoffs/NRIN_ENGINEERING_HANDOFF_2026-03-22_MATCH_DEMO.md`
4. `project_brain/handoffs/NEXT_BUILD_TARGET_2026-03-22_MATCH_DEMO.md`
5. `project_brain/matching/NRIN_NEEDS_WANTS_OFFERINGS_DOCTRINE.md`
6. `project_brain/matching/NRIN_NEGATIVE_FIT_SIGNAL_DOCTRINE.md`
7. `project_brain/matching/NRIN_BROCHURE_ASSET_PRIORITY_DOCTRINE.md`
8. `project_brain/operations/NRIN_PLACEMENT_TIMELINE_DOCTRINE.md`

---

## Current Product Truth

The recommendation must NOT be embedded into intake Step 7.

Correct flow is:

- `src/app/patient/page.tsx`
  - intake only
  - summary only at Step 7
  - submit intake
- `src/app/patient/matches/page.tsx`
  - recommendation surface

This was a major correction from this session and must not be undone.

---

## Current Recommendation Philosophy

NRIN should communicate in this order:

1. what the patient needs
2. which facilities deliver that need
3. if the patient wants more options, gather more preference signal and refine recommendation

Do not blend:
- need
- want
- facility offering

This separation is now doctrine.

---

## Current Adaptive Prompt Rule

Adaptive prompting is not currently active in live flow.

Groundwork files exist:
- `src/components/patient/AdaptiveIntakePrompt.tsx`
- `src/lib/patient/getAdaptivePrompt.ts`

These should only be used later behind:
- “See more options”
- after initial recommendation
- and only when Step 5 / preference signal is insufficient

Do NOT re-enable Step 5 intrusive follow-up inside intake.

---

## Files To Inspect Before Editing

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

### Matching language
- `src/lib/matching/buildMatchViewModel.ts`

---

## Current Demo Goal

The next session should optimize for:
- a clean visible demo
- stable routing
- polished recommendation surface
- no premature AI behavior
- no Step 5 annoying follow-up
- no blended intake/matches page

---

## Editing Rules For This Session

- Prefer full-file rewrites when safe
- If surgical, always cite exact path and line numbers
- If surgical, work bottom-up when possible to preserve line numbers
- Do not guess source-of-truth for typography or layout
- Search first, then edit

---

## Immediate Warning

If something feels wrong visually, do NOT assume the source is:
- Step component
- StepShell
- random child

Trace it first.

This session wasted significant time earlier because source-of-truth was guessed incorrectly.

