# NRIN — PROGRAM OFFERINGS ONBOARDING RULE — 2026-03-31

## Purpose

Define how facilities declare what they offer:
- levels of care
- core program offerings

This must:
- remain simple for onboarding
- not corrupt system-derived truth
- allow facilities to express capability

---

## Boundary

This file covers:
- facility-declared levels of care
- onboarding presentation of those levels
- separation between detected truth and claimed truth

This file does NOT cover:
- live bed management
- real-time admissions availability
- routing logic
- verification workflow

---

## Core Principle

There are TWO sources of truth:

1. System-detected truth
2. Facility-claimed truth

These must never overwrite each other.

---

## System Role

System determines matcher-facing level-of-care truth from:
- crawler
- normalization
- facility_intelligence

Canonical system-owned fields include:
- offers_detox
- offers_residential
- offers_php
- offers_iop
- offers_outpatient
- offers_aftercare

Matcher uses system-detected truth.

---

## Facility Role

Facility onboarding may collect claims for:

### Prompt
“We currently understand your program includes the following. You can adjust this if needed.”

### Structured options
- Detox
- Residential / Inpatient
- PHP
- IOP
- Outpatient
- Aftercare

Optional:
- Other [free text]

---

## Data Model Rule

Facility onboarding claims must be stored separately from detected truth.

Example shape:

facility_offerings_claimed = {
  detox: boolean,
  residential: boolean,
  php: boolean,
  iop: boolean,
  outpatient: boolean,
  aftercare: boolean,
  other: string[]
}

---

## Matching Rule

Matching must use:
- system-detected offerings only

Matching must NOT use:
- facility-declared offerings directly

Facility claims may later influence:
- verification workflows
- staff review
- future confirmed layers

But not initial matcher truth.

---

## UX Rule

Do NOT ask:
“What levels of care do you offer?” as a blank form.

Do ask:
“Here’s what we currently understand about your program.”

Then allow:
- confirm
- adjust
- continue

The goal is:
- confirmation-first
- refinement-second

---

## Downstream Use

Facility-declared offerings may be used for:
- onboarding confirmation
- internal review
- future facility-verified truth
- future NRIN-verified truth

They should not be treated as patient-facing truth until verified.

---

## Strategic Rationale

Prevent:
- facilities over-claiming capabilities
- mismatch between expectation and actual care
- corruption of matcher truth

Allow:
- crawler gap correction
- gradual truth alignment
- future verification

---

## One-Line Summary

Facilities can declare what they offer, but matching continues to rely on system-detected truth until verification layers are introduced.
