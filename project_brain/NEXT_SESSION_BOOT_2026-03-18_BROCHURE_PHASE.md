# NRIN — NEXT SESSION BOOT

## Phase
Match → Brochure → Activation

---

## Current State

Matching system is COMPLETE and working with real data.

Presentation layer has been improved but is not yet premium.

Key realization:
→ Tinder/swipe model is incorrect.

System must move toward:
→ Apple Store / Concierge / Placement experience

---

## What Must Be Built Next

### 1. BROCHURE EXPERIENCE

Replace:
- explanation sheet

With:
- facility exploration surface

Must include:
- identity
- narrative
- confidence
- optional deeper explanation
- future space for media

---

### 2. ACTIVATION FLOW

After user commits:

System must:
- send facility referral
- send patient reassurance message
- start facility timer
- track status

---

### 3. KEEP USER ON PLATFORM

DO NOT:
- send to facility website early

DO:
- control decision flow
- create confidence inside NRIN

---

## Key Concepts Introduced

- Referral Contribution Ledger
- Behavioral Intelligence Network
- Clinical Intelligence (future)

---

## Files To Inspect First

View model:
src/lib/matching/buildMatchViewModel.ts

UI:
src/components/patient/MatchCardStack.tsx
src/components/patient/MatchDetailSheet.tsx

---

## Immediate Task

Design and implement:

→ BROCHURE V1

This is:
- not a modal
- not a list
- not a dashboard

It is:
→ a place the user can sit, read, and feel confident

---

## Constraints

Do NOT:
- rebuild matcher
- expand crawler
- introduce new systems prematurely

---

## Success Criteria

User feels:
"This is a real place I could go."

NOT:
"This is a system recommending something."

---

## One-Line Mission

Turn NRIN from a matching interface into a trusted placement experience.
