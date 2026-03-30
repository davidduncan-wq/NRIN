# NRIN — SYSTEM MAP

## Purpose

This file gives any receiving AI or developer a fast, current map of the NRIN system.

It is not a philosophical document.
It is not a session handoff.
It is a practical orientation map.

---

## Project Identity

**NRIN** = National Recovery Intake Network

Core purpose:
- intake patients seeking treatment
- evaluate needs and preferences
- route them toward appropriate treatment options
- support referral workflows across patients, facilities, and organizations

---

## Canonical Repo Structure

### 1. Internal Engineering Repo
- Repo: `NRIN`
- Visibility: Private
- Role: canonical engineering source of truth
- GitHub: `https://github.com/davidduncan-wq/NRIN`

### 2. Public Demo Repo
- Repo: `NRIN-demo`
- Visibility: Public
- Role: investor/stakeholder demo
- GitHub: `https://github.com/davidduncan-wq/NRIN-demo`

### Rule
- `NRIN` is the canonical codebase
- `NRIN-demo` is separate
- `NRIN-demo` may be referenced only for selective design borrowing

---

## Stack

- Next.js 16
- App Router
- TypeScript
- TailwindCSS
- Supabase
- Vercel

---

## Current Product Surfaces

### Patient Intake
Primary multi-step intake flow for patients.

Likely concerns:
- identity / contact
- safety / stability
- clinical / substance use
- preferences
- financial / insurance
- matching / next-step routing

### Facility / Referral Workflows
Administrative and operational flows related to:
- facilities
- referrals
- placement workflows
- internal follow-up actions

### Demo Experience
Separate public-facing presentation version intended for:
- investors
- stakeholders
- walkthroughs

---

## Architectural Direction

Preferred direction:
- keep `NRIN` clean and modular
- preserve canonical engineering logic in `NRIN`
- selectively port visual polish from `NRIN-demo` into `NRIN`
- avoid broad rewrites unless necessary

---

## Design Reality

Current state:
- `NRIN` has the cleaner engineering direction
- `NRIN-demo` has some stronger visual polish

Correct pattern:
- borrow specific design patterns from `NRIN-demo`
- re-implement them cleanly inside `NRIN`
- do not merge or overwrite repos wholesale

---

## Source of Truth Hierarchy

When determining truth, use this order:

1. Current GitHub repo state
2. `project_brain` canonical documents
3. Current local repo state confirmed by Git
4. Recent chat context only if it matches the repo

Do not trust stale chat snippets over GitHub.

---

## Working Norms for Future AI

When helping David:
- be precise
- give exact file paths
- give exact commands
- separate Terminal / VS Code / Browser / Supabase actions when relevant
- prefer surgical edits
- preserve continuity

---

## Current Priority Direction

Default assumption:
- work in `NRIN`
- improve internal product quality
- maintain repo separation
- strengthen project memory
- selectively restore visual quality from `NRIN-demo` where useful

---

## Quick Start for Receiving AI

Read in this order:

1. `project_brain/00_READ_ME_FIRST.md`
2. `project_brain/NRIN_SYSTEM_MAP.md`
3. `project_brain/NRIN_ENGINEERING_HANDOFF.md`
4. `project_brain/NRIN_REPO_STRATEGY.md`
5. `project_brain/NRIN_CANONICAL_STATE.md`
6. `project_brain/NRIN_SURGICAL_EDIT_RULES.md`
7. `project_brain/NRIN_CURRENT_PRIORITIES.md`
8. `project_brain/NRIN_DESIGN_SYSTEM.md`
9. `project_brain/NRIN_PRODUCT_VISION.md`

---

## One-Line Summary

NRIN is a two-repo system: the private `NRIN` repo is the canonical engineering product, while `NRIN-demo` is a separate public demo repo that may supply selective visual inspiration but not core engineering truth.
---

## Update — 2026-03-30 — Insurance enrichment / resolver phase

### Current active files
- `scripts/runQueueAHeadless.ts`
  - runs Queue A enrichment over unresolved private-insurance slice
  - prints end-of-run summary
- `src/crawler/fetchPagesHeadless.ts`
  - fetches homepage + prioritized/fallback insurance/admissions pages
  - now includes image/logo signal support
- `src/crawler/crawlFacilityHeadless.ts`
  - orchestration wrapper for headless crawl path

### Planned next file(s)
- resolver script / module for post-crawl insurance truth interpretation
- likely target:
  - `scripts/runInsuranceTruthResolver.ts`
  - or similar dedicated resolver module

### Important boundary
Crawler and resolver are now separate conceptual layers.

