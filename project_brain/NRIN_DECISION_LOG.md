# NRIN Decision Log

Purpose:
Record major architectural and product decisions that are considered settled unless explicitly superseded.
This file exists to prevent AI drift, repeated debates, and accidental reversal of intentional system choices.

Rules:
- Log only meaningful decisions
- Keep entries short and precise
- Do not turn this into a bug log
- If a decision is later replaced, mark the old one as superseded rather than deleting history

---

## 2026-03-07 — GitHub Is Canonical Source of Truth
Status: active

Decision:
The GitHub repo is the authoritative source of truth for NRIN.

Why:
Chat context can drift, truncate, or lose continuity. GitHub preserves exact current state.

Impacted Areas:
- All AI boot instructions
- All engineering handoffs
- All code-reading workflows

Notes:
AI should read files directly from GitHub when links are provided.
AI should not ask David to paste files that already exist in the repo.

---

## 2026-03-07 — Fixed Boot Read Order
Status: active

Decision:
New AI sessions should read project brain files in this order:

1. project_brain/NRIN_PROJECT_INDEX.md
2. project_brain/NRIN_CANONICAL_STATE.md
3. project_brain/NRIN_SYSTEM_MAP.md
4. project_brain/NRIN_SURGICAL_EDIT_RULES.md
5. project_brain/CURRENT_HANDOFF.md
6. project_brain/NRIN_PRODUCT_ARCHITECTURE.md

Why:
This sequence loads orientation first, then current truth, then structure, then editing discipline, then the latest baton pass, then strategic architecture.

Impacted Areas:
- AI boot prompt
- New session startup flow
- Handoff consistency

---

## 2026-03-07 — Surgical Edit Discipline
Status: active

Decision:
NRIN should be edited surgically, not through broad rewrites, unless explicitly authorized.

Why:
Large AI rewrites increase drift risk, break working UI, and destabilize connected flows.

Impacted Areas:
- App router pages
- Shared UI primitives
- Referral and intake flows
- Future state machine work

Notes:
Prefer exact file paths, exact blocks, and minimal diffs.

---

## 2026-03-07 — Preserve Existing Design System and Architecture
Status: active

Decision:
AI sessions must preserve the established NRIN design system, UI primitives, and architecture.

Why:
Visual and structural consistency matter across patient, facility, and referral flows.

Impacted Areas:
- src/components/ui/*
- patient intake pages
- facility pages
- shared flow components

---

## 2026-03-07 — Next Major Milestone Is Treatment Center Intake + Case State Machine
Status: active

Decision:
The next major build target is the NRIN Treatment Center Intake + Case State Machine.

Why:
This is the operational engine that transforms NRIN from intake UI into a real treatment placement system.

Impacted Areas:
- Match flow
- Facility selection flow
- Treatment center intake
- Referral lifecycle management
- Operational state transitions

---

## 2026-03-07 — Core Placement Flow
Status: active

Decision:
NRIN’s core intended placement flow is:

Patient Intake
→ Match Engine
→ Top 3–5 Facilities
→ Tinder-style facility selection
→ Treatment Center Pre-Screen
→ Accept / Reject
→ Transportation + Insurance + Bed
→ Clinical Escalation

Why:
This defines the product’s true operational sequence and should guide future architecture.

Impacted Areas:
- Product architecture
- State machine design
- Future routing and data model decisions
