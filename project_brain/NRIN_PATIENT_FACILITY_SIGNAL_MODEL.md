# NRIN — PATIENT / FACILITY SIGNAL MODEL

## Purpose

This document defines the canonical visual and logical relationship between:

- patient needs
- facility capabilities
- patient preferences

This is the core ontology of NRIN’s recommendation system.

---

## Core Principle

NRIN separates:

- what the patient needs
- what the facility provides
- what the patient wants

These must never be conflated.

---

## Signal Types

### 1. Patient Needs (PILLS)

Meaning:
- required clinical, logistical, or life-fit criteria

Examples:
- Detox
- Residential
- MAT
- Dual diagnosis
- Family support

Rules:
- displayed as pills
- NEVER shown as “checked”
- represent requirements, not outcomes

Interpretation:
These define the **question set**.

---

### 2. Facility Capabilities (CHECKS)

Meaning:
- what the facility appears to provide

Examples:
- ✓ Detox available
- ✓ Residential confirmed
- ✓ Insurance signals found

Rules:
- shown as positive confirmation (check)
- must be supported by evidence (crawler / data)

Interpretation:
These define the **answer set**.

---

### 3. Gaps / Uncertainty (NEGATIVE / AMBER)

Meaning:
- missing or unverified capabilities

Types:

#### Confirmed Gap
- ❌ capability is known to be absent

Example:
- ❌ No detox

#### Not Confirmed
- ⚠️ capability not verified yet

Example:
- ⚠️ Detox not confirmed

Rules:
- must be calm, not alarmist
- must not fabricate negatives
- uncertainty is allowed and preferred over false claims

Interpretation:
These define the **challenge set**.

---

### 4. Patient Wants (TIE BREAKERS)

Meaning:
- preferences that matter AFTER needs are satisfied

Examples:
- beach / island
- near family
- specific location
- brand familiarity

Rules:
- never override unmet needs
- only influence ranking among valid options

Interpretation:
These define the **tie-break layer**.

---

## Decision Order (NON-NEGOTIABLE)

1. Patient needs are defined
2. Facility capabilities are evaluated
3. Gaps / uncertainty are surfaced
4. Patient wants break ties among valid options

---

## Anti-Pattern (DO NOT DO)

- Showing patient needs as already satisfied
- Turning all facilities into positive matches
- Using wants to override unmet needs
- Hiding uncertainty
- Overstating capability without evidence

---

## Product Philosophy

NRIN does not say:
“this is a great option”

NRIN says:
“this meets these needs, is unclear on these, and misses these”

That is how trust is built.

---

## Strategic Reminder

Patient pills define need.
Facility checks confirm support.
Gaps reveal truth.
Patient wants break ties.

This model governs:
- patient matching UI
- facility workflow UI
- manual override systems
- future admin / caseworker tools

