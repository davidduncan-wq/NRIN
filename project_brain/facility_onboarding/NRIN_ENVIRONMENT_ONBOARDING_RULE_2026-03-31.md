# NRIN — ENVIRONMENT ONBOARDING RULE — 2026-03-31

## Purpose

Define the correct separation between:
- system-derived environment truth
- facility-provided environment narrative

This ensures:
- clean matcher inputs
- prevention of marketing pollution
- alignment with classifier architecture

---

## Boundary

This file covers:
- environment handling in facility onboarding
- what the system owns
- what the facility may describe

This file does NOT cover:
- environment classifier implementation
- environment scoring rules
- patient-side life-fit doctrine

---

## Core Principle

Environment is NOT declared by facilities.

Environment is:
- derived
- deterministic
- system-owned

Facilities only describe:
- what it feels like to be there

---

## System-Owned Environment

Derived from:
- facility latitude
- facility longitude
- facility city
- facility state

Via:
- environment classifier

Includes:
- region
- terrain flags
- proximity
- density (future)

Facilities must not input or override these values.

---

## Facility Role

Facilities may provide:

### Environment narrative only

Prompt:
“What would you want a patient to understand about your setting as they consider it?”

Free text only.

No structured environment inputs.
No region checkboxes.
No terrain declarations.
No local/out-of-area questions.

---

## Explicitly Forbidden in Onboarding

Do NOT ask facilities:
- region
- mountain / desert / coastal truth
- urban / suburban / rural
- local vs out-of-area patient mix
- proximity or travel patterns

These are:
- noisy
- inconsistent
- system-derivable

---

## Presentation Model

Patient-facing environment should combine:

1. System truth
   - region
   - terrain
   - distance

2. Facility voice
   - free text description of setting

Rule:
System truth defines reality.
Facility voice describes experience.

---

## Matching Rule

No matching logic may use:
- facility-entered environment claims
- free-text environment narrative

Matcher must use:
- classifier outputs only

---

## Strategic Rationale

Prevent:
- marketing distortion
- inconsistent environment labeling
- data drift across facilities

Enable:
- reliable matching
- future scoring
- environment-vs-outcome analysis

---

## One-Line Summary

Environment is system-derived truth; facilities only describe the human experience of it.
