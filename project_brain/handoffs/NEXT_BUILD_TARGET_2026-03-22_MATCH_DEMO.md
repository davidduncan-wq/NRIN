# NRIN — NEXT BUILD TARGET — 2026-03-22 — MATCH DEMO

## Goal

Get the next stakeholder demo visibly clean and coherent.

The priority is not new infrastructure.
The priority is a stable and compelling intake → recommendation experience.

---

## Current Correct Flow

- patient completes intake in `src/app/patient/page.tsx`
- Step 7 shows summary + initials + submit
- successful submit redirects to `src/app/patient/matches/page.tsx`
- recommendation page presents the recommendation cleanly

This flow must remain intact.

---

## What To Improve Next

### 1. Demo polish on recommendation page
Primary files:
- `src/app/patient/matches/page.tsx`
- `src/components/patient/MatchCardStack.tsx`
- `src/lib/matching/buildMatchViewModel.ts`

Focus:
- reduce redundancy
- make the card the hero
- keep recommendation language calm and sharp
- keep the experience feeling like decision support, not a chatbot

---

### 2. Decide on a minimal “See more options” entry point
Do not fully wire AIR yet unless necessary.

Possible next move:
- add a visible but disciplined “See more options” entry point
- no intrusive adaptive prompts yet
- no Step 5 interruption

This should only be built if it helps demo clarity.

---

### 3. Build a UI component / source-of-truth map
Add a new file like:
`project_brain/NRIN_UI_COMPONENT_MAP.md`

It should explain:
- where page headlines live
- where shared cards live
- where signal pill design lives
- where matching language lives
- where routing logic lives

This is important to reduce future wasted time.

---

## What NOT To Do Next

- do not re-embed recommendation into `src/app/patient/page.tsx`
- do not re-enable Step 5 follow-up interrogation
- do not start red-X implementation yet unless demo polish is complete
- do not wire adaptive prompt into live path prematurely
- do not hunt visual issues by guessing file ownership

---

## Best Candidate For The Session After Next

After demo polish is stable, the next major product feature should likely be:

### controlled “more options” flow
with:
- gating
- adaptive prompt only if needed
- eventually needs / wants / offerings refinement

That feature should be built from the new doctrine, not improvised.

