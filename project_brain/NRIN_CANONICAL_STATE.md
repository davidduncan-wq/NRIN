# NRIN — CANONICAL STATE

**Last Updated:** 2026-03-06

## Purpose

This file records the current canonical state of the NRIN project.

It should contain only current truth.
It should avoid speculation, stale plans, or outdated assumptions.

If this file conflicts with old chat memory, prefer this file and current GitHub state.

---

## 1. Canonical Repositories

### Internal Engineering Repo
- Name: `NRIN`
- Visibility: Private
- GitHub: `https://github.com/davidduncan-wq/NRIN`

### Public Demo Repo
- Name: `NRIN-demo`
- Visibility: Public
- GitHub: `https://github.com/davidduncan-wq/NRIN-demo`

### Repository Rule
- `NRIN` is the canonical engineering source of truth
- `NRIN-demo` is a separate public demo repo
- `NRIN-demo` may be referenced only for selective design borrowing

---

## 2. Current Local Structure

Expected local folders:

```text
Desktop/
  NRIN
  NRIN-demo

Current primary working folder:
NRIN
3. Current Git State at Time of Update
Internal repo NRIN is clean and synced with GitHub.
Confirmed state:
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
Confirmed latest relevant commits during project_brain setup:
ddf2b26 — Add canonical project brain docs
0f0d902 — Add NRIN system map
4. Canonical Working Rule
Default assumption for future work:
work in NRIN
treat NRIN as canonical
use NRIN-demo only as an isolated demo reference
Do not merge repos wholesale.
Do not overwrite NRIN with NRIN-demo.
5. Current Product Direction
Primary engineering focus is the internal NRIN application.
Current strategic goals:
continue internal app development
preserve architectural cleanliness
improve continuity through project_brain
selectively restore visual polish from NRIN-demo into NRIN where useful
The public demo is considered good enough for stakeholder/investor viewing for now.
6. Current Design Reality
NRIN
cleaner engineering direction
more canonical internal codebase
less polished visual design in some areas
NRIN-demo
stronger visual polish in some areas
presentation-oriented
not the canonical engineering base
Required Design Rule
AI may inspect NRIN-demo and selectively port specific design elements into NRIN, but only surgically.
7. Current Stack
Next.js 16
App Router
TypeScript
TailwindCSS
Supabase
Vercel
8. Current Documentation Core
Canonical project memory now includes:
project_brain/00_READ_ME_FIRST.md
project_brain/NRIN_SYSTEM_MAP.md
project_brain/NRIN_ENGINEERING_HANDOFF.md
project_brain/NRIN_REPO_STRATEGY.md
project_brain/NRIN_CANONICAL_STATE.md
Additional supporting docs exist and should be maintained as needed.
9. Continuity Rule
When determining project truth, use this order:
Current GitHub repo state
project_brain canonical docs
Confirmed local Git state
Recent chat context only if consistent with the repo
Do not treat stale chat memory as authoritative over repo state.
10. Practical Summary
NRIN currently operates as a two-repo system:
NRIN = private canonical engineering repo
NRIN-demo = public demo repo
Future work should continue in NRIN, with only selective design borrowing from NRIN-demo.
