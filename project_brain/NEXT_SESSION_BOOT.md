# NRIN — NEXT SESSION BOOT

## Current Phase
Patient matching + selection UI (post-intake)

## System Status
- Crawler v1 complete (~97% coverage)
- Facility intelligence populated
- Matching engine functional
- View-model adapter implemented
- Swipe-based browsing UI working (non-destructive, circular)
- Detail sheet (v1) implemented

## Core Principles (DO NOT VIOLATE)

1. Matching hierarchy:
   - Needs (primary, hard filters)
   - Financial (secondary)
   - Preference (tertiary, final differentiator)

2. Selection is high-consequence:
   - NEVER triggered by gesture
   - ALWAYS explicit + confirmable

3. UI is decoupled from logic:
   - Matcher is canonical
   - UI is swappable / A/B testable

4. Swipe = navigation only
   - Non-destructive
   - Circular browsing
   - No forced decisions

## Current Architecture

Matching:
- src/lib/matching/*

View model:
- src/lib/matching/buildMatchViewModel.ts

UI:
- src/components/patient/MatchCardStack.tsx
- src/components/patient/MatchDetailSheet.tsx

Page:
- src/app/patient/matches/page.tsx

## Immediate Next Task

Add **evidence-ready structure** to match view model:

Goal:
- Each reason becomes evidence-addressable
- Supports:
  - snippet
  - source URL
  - future deep-linking to facility content

## Do NOT:
- Rewrite matcher
- Rework crawler
- Overcomplicate UI
- Add new systems

## Do:
- Extend view model
- Keep changes surgical
- Maintain design quality (Airbnb/Stripe level)
