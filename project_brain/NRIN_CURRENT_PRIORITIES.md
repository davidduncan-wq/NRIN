# NRIN — CURRENT PRIORITIES

Last Updated: 2026-03-06

This document tracks the immediate development priorities for the NRIN project.

It should remain short and updated frequently.

---

## Primary Engineering Focus

Continue development in the **NRIN private repo**, which is the canonical engineering codebase.

The **NRIN-demo repo is considered good enough for stakeholder demonstration for now** and should remain isolated unless demo fixes are required.

---

## Current Development Goals

### 1. Strengthen Core Intake Flow

Focus on stabilizing and refining the patient intake process.

Goals:
- improve clarity of intake steps
- ensure clean component structure
- maintain mobile-first usability
- preserve modular design

---

### 2. Maintain Architectural Cleanliness

The NRIN repo represents the cleaner architectural direction.

Future work should:
- avoid introducing demo-specific shortcuts
- maintain modular component design
- prefer surgical edits over large rewrites

---

### 3. Selectively Restore Visual Polish

Some UI polish exists in `NRIN-demo`.

When useful:

- inspect `NRIN-demo`
- port specific design elements
- re-implement them cleanly inside `NRIN`

Never merge repos wholesale.

---

### 4. Continue Building Referral Infrastructure

Continue development around:

- patient records
- facility matching
- referral workflows
- administrative interfaces

---

## Paused / Lower Priority

- major demo enhancements
- advanced matching engine logic
- complex analytics layers
- large architectural changes

---

## Guiding Principle

Build the **real product** in `NRIN`.

Use `NRIN-demo` only for selective design inspiration.