# NRIN — UI COMPONENT MAP

## Purpose

This file is not a file tree.

It is a practical map of:
- where UI responsibilities actually live
- where to look before editing
- which files own typography, layout, card presentation, signals, and routing
- how intake, recommendation, and future placement tracking are separated

This file exists to prevent wasted time hunting through the repo for:
- the wrong header
- the wrong card
- the wrong wrapper
- the wrong typography source
- the wrong page composition layer

---

## Core UI Principle

Do not assume the visible UI is controlled by the nearest component.

Always trace:
1. page composition
2. feature composition
3. shared UI primitive
4. language / view-model shaping

before editing.

---

# 1. PRIMARY PRODUCT SURFACES

## Intake Flow
### File
`src/app/patient/page.tsx`

### Owns
- overall intake page composition
- step switching
- step header block
- progress sidebar / step progress
- summary step
- submit / route to matches

### Important note
This file is the source of truth for the intake step header styling currently visible above each step.

If the question is:
- where does the intake page heading style come from?
- where does the “Basic information” visible heading style come from?

Start here first, not in a step child component.

### Current rule
This file should remain:
- intake-only
- summary-only at Step 7
- routing out to recommendation page after submit

Do not re-embed recommendation UI here.

---

## Matches / Recommendation Flow
### File
`src/app/patient/matches/page.tsx`

### Owns
- recommendation page composition
- recommendation page header
- page-level spacing above recommendation card
- passing matches into recommendation card surface

### Important note
This file should own:
- recommendation page context
- recommendation page framing
- recommendation page copy above the card

It should not own:
- detailed card styling
- signal pill styling
- matching logic
- facility-level microcopy

---

## Future Placement / Status Flow
### Not yet built
Suggested future files:
- `src/app/patient/status/page.tsx`
- or `src/app/patient/referral/[id]/page.tsx`

### Intended ownership
- post-recommendation progress
- facility selected
- referral sent
- facility reviewing
- accepted / declined / alternative suggested
- travel / arrival / admitted timeline
- future map / check-in / location-sharing layer

### Important distinction
This must remain separate from:
- intake step progress
- recommendation page

This should follow placement timeline doctrine, not intake wizard doctrine.

---

# 2. FEATURE COMPOSITION FILES

## Recommendation Card Surface
### File
`src/components/patient/MatchCardStack.tsx`

### Owns
- the main recommendation card composition
- facility headline placement
- card-level action row
- signal pill sequencing / timing trigger
- inline detail reveal trigger
- card-level motion timing trigger

### Does NOT own
- signal visual design primitive
- shared card material design
- matching language generation
- routing
- global page spacing

### Current role
This file is the main feature-composition layer for the recommendation object.

If the question is:
- where does the recommendation card layout live?
- where do the action buttons live?
- where are signals mapped into the card?
- where does the entry motion start?

Start here.

---

## Recommendation Detail / Inline Explanation
### File
`src/components/patient/MatchDetailSheet.tsx`

### Owns
- inline expanded explanation content
- supporting information reveal
- next-step text block
- deeper rationale under the main recommendation

### Important note
This should feel like:
- a deeper product explanation surface

It should NOT feel like:
- a dating-card modal
- a chatbot pane
- a debug drawer

---

## Dormant Adaptive Prompt Surface
### File
`src/components/patient/AdaptiveIntakePrompt.tsx`

### Owns
- the UI for future adaptive post-recommendation prompting
- the conversational intake card surface
- future “tell us more so we can improve the options” experience

### Current state
Exists, but intentionally not wired into live flow.

### Important rule
Do not mount this during normal Step 5 intake.
This belongs behind:
- “See more options”
- after initial recommendation
- only when signal is insufficient

---

# 3. SHARED UI PRIMITIVES

## Signal Pill
### File
`src/components/ui/SignalPill.tsx`

### Owns
- signal pill visual design
- signal pill checked state presentation
- signal pill animation behavior
- future signal variants (positive / negative / inspectable)

### Does NOT own
- what the signal means
- whether it should appear
- whether it is a need, want, or facility offering

Those decisions belong higher up.

### Important note
This is the correct file for:
- check styling
- check animation
- pill shell styling

Not `MatchCardStack.tsx`

---

## Surface Card
### File
`src/components/ui/SurfaceCard.tsx`

### Owns
- the material shell of the recommendation card
- border strength
- background material tone
- shadow / surface presence

### Important note
If the question is:
- why doesn’t the card feel premium enough?
- where does the card material / paper tone live?
- how do we make this feel more Apple-like?

Start here.

Do not randomly tune card material in feature composition files.

---

## Form Inputs / Shared Intake UI
### Examples
- `src/components/ui/Input.tsx`
- `src/components/ui/PhoneInput.tsx`
- `src/components/ui/FieldCheck.tsx`

### Own
- shared low-level form interactions
- reusable input primitives
- form check visuals

### Important distinction
These are not recommendation primitives.
Do not use them as justification for matches page design without checking semantic meaning.

---

# 4. MATCHING LANGUAGE / VIEW-MODEL SHAPING

## View-Model Boundary
### File
`src/lib/matching/buildMatchViewModel.ts`

### Owns
- recommendation copy shaping
- facility presentation text
- explanation summary text
- signal / pill content labels
- brochure-facing presentation text

### Important note
If the question is:
- where does “Detox available” come from?
- where does “Our recommendation” source label come from?
- where does explanation CTA copy come from?
- why is the recommendation language redundant?

Start here.

### Does NOT own
- actual component layout
- actual card styling
- motion
- routing

---

## Matching Orchestration
### File
`src/lib/matching/matchPatientToFacilities.ts`

### Owns
- matching logic
- filters
- scoring
- ranking
- matching truth

### Important note
Do not edit this when you are trying to fix:
- copy
- card design
- signal wording
- page hierarchy

Only touch this for actual matching logic changes.

---

## Facility Input Adapter
### File
`src/lib/matching/fetchFacilityMatches.ts`

### Owns
- loading facility match inputs
- pulling in facility identity fields
- bringing in data needed for matching and presentation

### Important note
If a facility is missing:
- city
- logo
- website
- identity fields

Check this file before assuming the card is wrong.

---

## Shared Matching Types
### File
`src/lib/matching/types.ts`

### Owns
- shared matching interfaces
- patient matching input
- facility matching input
- result contracts

### Important note
Type changes belong here, not randomly in page files.

---

# 5. INTAKE-SPECIFIC CHILD COMPONENTS

## Step 1
### File
`src/app/patient/components/Step1Demographics.tsx`

### Owns
- input fields for basic demographic capture
- step content only

### Does NOT own
- actual step header visual styling
- overall page headline presentation

It passes values to the wrapper/layout; it is not the true design source for the visible page heading.

---

## Step 5
### File
`src/app/patient/components/Step5LifeFit.tsx`

### Owns
- freeform life situation / preferences capture

### Important note
This file previously contained follow-up logic that created intrusive extra questions.
That was intentionally disabled for demo flow.

### Current rule
Step 5 should remain:
- freeform
- non-intrusive
- optional in feel

Do not re-add adaptive questioning here unless product doctrine changes explicitly.

---

# 6. ROUTING / FLOW OWNERSHIP

## Intake submit routing
### File
`src/app/patient/page.tsx`

### Owns
- successful submit path
- route push to:
`/patient/matches`

### Current rule
The recommendation flow begins after successful submit, not before.

---

## Recommendation page loading
### File
`src/app/patient/matches/page.tsx`

### Owns
- reading query params
- constructing patient matching input from submit result
- calling matching engine
- rendering recommendation page

### Important note
This file is the correct place for:
- recommendation page framing
- recommendation page intro copy
- routing destination behavior

---

# 7. DORMANT / FUTURE LOGIC FILES

## Adaptive Prompt Logic
### File
`src/lib/patient/getAdaptivePrompt.ts`

### Owns
- future adaptive question selection
- future “need more signal before showing more options” logic

### Current state
Exists but intentionally dormant.

### Rule
Do not wire directly into current intake flow.
Future correct location is behind:
- “See more options”
- post-recommendation
- signal insufficiency check

---

# 8. CURRENT DOCTRINE FILES TO READ BEFORE MATCHES WORK

## Matching doctrine
- `project_brain/matching/NRIN_NEEDS_WANTS_OFFERINGS_DOCTRINE.md`
- `project_brain/matching/NRIN_NEGATIVE_FIT_SIGNAL_DOCTRINE.md`
- `project_brain/matching/NRIN_BROCHURE_ASSET_PRIORITY_DOCTRINE.md`

## Operations doctrine
- `project_brain/operations/NRIN_PLACEMENT_TIMELINE_DOCTRINE.md`

## Session continuity
- `project_brain/handoffs/NRIN_ENGINEERING_HANDOFF_2026-03-22_MATCH_DEMO.md`
- `project_brain/handoffs/NEXT_SESSION_BOOT_2026-03-22_MATCH_DEMO.md`
- `project_brain/handoffs/NEXT_BUILD_TARGET_2026-03-22_MATCH_DEMO.md`

---

# 9. PRACTICAL LOOKUP GUIDE

## “Where does this page headline come from?”
Start with:
- page file first
- then shared page/header primitive if one exists

Currently:
- intake headline visible styling is in `src/app/patient/page.tsx`
- matches headline visible styling is in `src/app/patient/matches/page.tsx`

---

## “Where does this card background / border / shadow come from?”
Start with:
- `src/components/ui/SurfaceCard.tsx`

---

## “Where do these pills / checks / check animations come from?”
Start with:
- `src/components/ui/SignalPill.tsx`

Then inspect:
- `src/components/patient/MatchCardStack.tsx`
for sequencing/timing trigger only

---

## “Where does this recommendation wording come from?”
Start with:
- `src/lib/matching/buildMatchViewModel.ts`

---

## “Why is Step 5 asking annoying follow-up questions?”
Start with:
- `src/app/patient/components/Step5LifeFit.tsx`

---

## “Why is recommendation showing up too early?”
Start with:
- `src/app/patient/page.tsx`

If recommendation is inside intake Step 7 again, that is almost certainly wrong.

---

## “Where should more-options / adaptive prompt logic live?”
Eventually:
- trigger in `src/components/patient/MatchCardStack.tsx`
- prompt UI in `src/components/patient/AdaptiveIntakePrompt.tsx`
- prompt logic in `src/lib/patient/getAdaptivePrompt.ts`

Not in:
- `src/app/patient/components/Step5LifeFit.tsx`

---

# 10. CURRENT PRODUCT FLOW MAP

## Current correct flow
1. patient intake
2. summary / initials / submit
3. redirect to matches page
4. recommendation card shown
5. deeper explanation optionally expanded

## Future desired flow
1. patient intake
2. summary / submit
3. recommendation page
4. patient asks for more options
5. adaptive prompt if signal insufficient
6. more refined matches
7. eventual selection
8. future placement timeline

---

# 11. FINAL RULE

When something looks wrong:

Do NOT guess:
- nearest component
- nearest title prop
- nearest wrapper

Instead:
1. search the visible text
2. inspect the real rendering file
3. trace the composition chain
4. edit at the correct ownership layer

This file exists because a large amount of time was wasted earlier by editing the wrong layer first.
