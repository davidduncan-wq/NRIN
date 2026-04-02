# NRIN — FACILITY ONBOARDING VERIFICATION MODEL — 2026-04-02

## Purpose

Define how NRIN aligns three sources of truth:

1. System-derived truth
2. Facility-declared truth
3. NRIN-verified truth (Queue C)

This ensures:
- clean matcher inputs
- prevention of marketing distortion
- progressive truth refinement
- alignment with patient intake signals

---

## Core Principle

Facilities do not configure NRIN.

They:

👉 align, confirm, and refine how they are understood

NRIN owns:
- baseline truth
- structure
- matcher inputs

Facilities contribute:
- confirmation
- correction
- narrative

NRIN verifies:
- ambiguous or high-impact truth

---

## Three Layers of Truth

### 1. System-Derived Truth (FOUNDATION)

Source:
- crawler
- normalization
- resolver (Queue A)
- geo derivation
- facility_intelligence

Characteristics:
- deterministic
- structured
- matcher-facing

Examples:
- offers_detox
- offers_residential
- MAT_supported
- accepted_insurance_detected
- latitude / longitude
- environment classification

RULE:
This is the ONLY layer used by the matcher (initially).

---

### 2. Facility-Declared Truth (ONBOARDING)

Source:
- onboarding flow

Characteristics:
- editable
- confirm / adjust model
- stored separately

Examples:
- facility_offerings_claimed
- insurance_claimed
- MAT_claimed
- program descriptions

RULE:
Facility claims do NOT overwrite system truth.

They are:
- signals
- candidates for verification
- inputs to Queue C

---

### 3. NRIN-Verified Truth (QUEUE C)

Source:
- human review (web + phone)

Characteristics:
- evidence-backed
- structured
- auditable

Examples:
- verified MAT support
- verified insurance carriers
- verified detox/residential availability
- verified admissions phone
- verified contradictions

RULE:
Only verified truth may be promoted toward matcher influence.

---

## Relationship Between Layers

System Truth → baseline reality  
Facility Claim → proposed correction  
NRIN Verification → confirmed truth  

Hierarchy:

System < Verified (after promotion)  
Facility Claim never overrides directly  

---

## Onboarding Model

Onboarding must always follow:

### “Here is what we understand → help us refine it”

NOT:

“What do you offer?”

---

## Page Structure Pattern

Each onboarding page must include:

### 1. System Understanding (read-only)
“What we currently understand”

### 2. Facility Input (editable)
“Confirm or adjust”

### 3. Boundary Reminder
“What this does / does not affect”

### 4. Continue Flow
Non-blocking progression

---

## Initial Onboarding Pages (v1)

### 1. Program Offerings
- show detected levels
- allow confirm / adjust
- store as claims

### 2. Insurance
- show detected carriers
- allow paste / confirm
- capture exact wording if possible

### 3. MAT / Medical
- MAT supported?
- how described?
- medications referenced?

### 4. Environment Narrative
- free text only
- no structured inputs

### 5. Contact / Admissions
- confirm phone number
- confirm admissions path

---

## Matching Rule

Matcher uses:
- system-derived truth ONLY

Matcher does NOT use:
- facility-declared inputs
- onboarding claims

Until:
- verified layer is introduced

---

## Queue C Integration

Queue C operates on top of onboarding + system truth.

Queue C tasks are generated when:

- high-value facility has ambiguous truth
- facility claims contradict system detection
- matcher results appear incorrect
- key signals (MAT, detox, insurance) are weak or missing

Queue C sees:
- system truth
- facility claims
- evidence (if available)

Queue C outputs:
- verified truth
- evidence
- reviewer confidence

---

## Queue C Writeback Rule

Queue C does NOT write directly to matcher truth.

Flow:

Queue C Review → Stored in review table → Controlled promotion → facility_intelligence update

---

## Cultural Competence (Internal Layer)

Queue C may capture:

- LGBTQ+ responsiveness
- trans-specific competence
- tone of phone interaction
- clarity vs vagueness

This is:

- internal only
- not matcher-facing
- not publicly displayed
- used for future intelligence layers

---

## Strategic Rationale

Prevent:
- facilities over-claiming
- loud marketing dominating ranking
- crawler bias toward verbosity

Enable:
- truth convergence over time
- high-quality local matching
- evidence-backed facility profiles
- future reputation layer

---

## One-Line Summary

NRIN onboarding aligns system truth, facility claims, and human verification into a single coherent understanding — without ever allowing unverified inputs to corrupt matching.
