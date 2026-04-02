# NRIN — VERIFICATION PROVENANCE MODEL — 2026-04-02

## Purpose

Define how NRIN tracks and separates different sources of truth about a facility.

This ensures:
- clarity of origin
- prevention of truth contamination
- structured verification workflows
- clean matcher inputs

---

## Core Principle

Not all “truth” is equal.

NRIN must always know:

👉 WHO said it  
👉 HOW it was obtained  
👉 HOW trustworthy it is  

---

## Verification Layers

Each field may have multiple inputs from different sources.

These must NEVER overwrite each other blindly.

---

### 1. System-Derived (BASELINE)

Source:
- crawler
- normalization
- resolver (Queue A)
- geo derivation

Characteristics:
- automated
- scalable
- imperfect but structured

Used by:
- matcher (initially)

Example:
- offers_detox_detected = true

---

### 2. Facility-Claimed

Source:
- onboarding
- facility dashboard

Meaning:
“This is what the facility says about itself”

Characteristics:
- editable
- prone to overstatement
- valuable but unverified

Examples:
- offers_detox_claimed = true
- accepts_aetna_claimed = true

RULE:
Does NOT override system truth.
Does NOT directly affect matching.

---

### 3. Facility-Confirmed

Source:
- facility explicitly confirms NRIN’s detected truth

Meaning:
“Yes, NRIN is correct”

Characteristics:
- stronger than claim
- still self-reported

Examples:
- offers_detox_confirmed = true

RULE:
Still not automatically matcher truth.
May increase confidence for verification workflows.

---

### 4. Verified by Web (Queue C)

Source:
- NRIN reviewer
- website inspection
- content verification

Meaning:
“NRIN observed this on the facility’s web presence”

Characteristics:
- human-reviewed
- evidence-backed
- structured

Examples:
- offers_detox_verified_web = true
- insurance_verified_web = ["Aetna", "Cigna"]

Includes:
- source URL
- snippet
- reviewer confidence

---

### 5. Verified by Phone (Queue C)

Source:
- NRIN reviewer phone call

Meaning:
“Facility staff confirmed this verbally”

Characteristics:
- high signal
- may vary by staff quality

Examples:
- MAT_supported_verified_phone = true

Includes:
- call notes
- reviewer interpretation
- confidence level

---

### 6. NRIN Verified (Authoritative)

Source:
- internal review
- uploaded documents
- state databases
- accreditation bodies
- supervisor approval

Meaning:
“NRIN formally confirms this as authoritative truth”

Characteristics:
- highest trust
- auditable
- stable

Examples:
- licensed_state_verified = true
- accredited_carf_verified = true
- insurance_contract_verified = true

RULE:
This is the strongest signal.
Eligible to influence matcher truth when appropriate.

---

## Hierarchy of Trust

Lowest → Highest:

System-derived  
Facility-claimed  
Facility-confirmed  
Verified (web / phone)  
NRIN verified  

---

## Field-Level Provenance

Each important field should eventually track:

- detected value
- claimed value
- confirmed value
- verified_web value
- verified_phone value
- nrin_verified value

NOT all fields must have all layers, but the structure must support it.

---

## Conflict Handling

If sources disagree:

Example:
- system: MAT = false
- facility: MAT = true
- web: unclear
- phone: true

NRIN does NOT collapse into one value automatically.

Instead:
- store all signals
- escalate for verification if needed
- prefer higher-trust layer when required

---

## Matcher Rule

Matcher uses:

👉 system-derived truth (initially)

Future:
- may incorporate verified layers
- must NEVER use facility-claimed truth directly

---

## UI Separation Rule

### Facility-facing UI
Shows:
- system understanding
- allows claim / confirmation

Does NOT show:
- internal NRIN verification layers

---

### NRIN internal UI (Queue C / Admin)
Shows:
- all layers
- provenance
- evidence
- conflict signals

Allows:
- verification
- escalation
- promotion to higher-trust layers

---

## Cultural Competence (Special Case)

Fields like:
- LGBTQ+ responsiveness
- trans-specific competence

Are:

- internal only
- reviewer-derived
- NOT part of core matcher truth (initially)
- stored under verification layers

---

## Strategic Rationale

Prevents:
- marketing distortion
- crawler bias toward loud facilities
- premature trust in unverified claims

Enables:
- layered truth system
- auditability
- progressive accuracy
- high-quality placement decisions

---

## One-Line Summary

NRIN does not ask “what is true?” — it tracks who said what, how it was verified, and how much it can be trusted.
