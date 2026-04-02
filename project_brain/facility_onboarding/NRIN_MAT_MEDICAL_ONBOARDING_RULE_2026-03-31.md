# NRIN — MAT / MEDICAL ONBOARDING RULE — 2026-03-31

## Purpose

Define how facility onboarding captures:
- medication-assisted treatment capability
- medication / psychiatric support depth
- medical staffing reality

This must:
- preserve trust in matching
- avoid vague “med friendly” language
- distinguish true MAT capability from general medication support

---

## Boundary

This file covers:
- MAT support truth
- psychiatric / medical provider presence
- onboarding phrasing for clinical support

This file does NOT cover:
- full admission assessment
- patient medication reconciliation
- prescreen clinical deepening
- facility billing / prescribing workflows

---

## Core Principle

NRIN must distinguish between:

1. True MAT capability
2. General medication / psychiatric support

These are related but not interchangeable.

---

## MAT Rule

MAT must remain strict.

For onboarding purposes, MAT refers to clinically recognized addiction-treatment medications such as:
- buprenorphine / Suboxone / Sublocade
- methadone
- naltrexone / Vivitrol

MAT must NOT be expanded to include:
- general psychiatric medication support
- anti-craving support in the abstract
- vague holistic “medication-friendly” language
- non-specific recovery or wellness claims

---

## MAT Prompting Rule

Do NOT ask:
- “Are you MAT friendly?”
- “Do you support all pathways?”
- “Do you believe in MAT?”

Do ask:
- whether the facility can support patients who require MAT
- how MAT is operationally handled

Preferred onboarding structure:

### Core prompt
“Can you support patients who require medication-assisted treatment (MAT)?”

- Yes
- No

### Operational refinement (if Yes)
“How do you support medication-assisted treatment?”

Examples:
- We can initiate MAT
- We continue MAT if the patient is already prescribed
- We coordinate MAT through external providers
- We support MAT but do not prescribe on-site

### Optional clarification
“Anything you want us to know about how you approach medication support?”

---

## Medical / Psychiatric Support Rule

Separate from MAT, onboarding should capture real provider depth.

Purpose:
- understand acuity-handling capacity
- understand medication / psychiatric support availability
- improve routing and explanation

Do NOT ask vague questions like:
- “Do you treat dual diagnosis?”
- “Do you offer psychiatric care?”

Do ask concrete questions like:
- whether medical or psychiatric providers are involved
- which types of providers are involved
- how they are available

---

## Preferred Medical Support Structure

### Core prompt
“Do you have medical or psychiatric providers involved in patient care?”

- Yes
- No

### Provider types (if Yes)
- Psychiatrist (MD/DO)
- Nurse Practitioner (NP)
- Physician Assistant (PA)
- Medical doctor (non-psychiatric)

### Availability model
- On-site full-time
- On-site part-time
- Telehealth / remote
- On-call only

### Optional clarification
“Anything you want us to know about your clinical support?”

---

## Matching Rule

Matcher should treat MAT as a hard / high-weight capability signal when patient need requires it.

General medication / psychiatric support should be:
- separate from MAT
- useful for acuity understanding
- available for future routing refinement
- not collapsed into a single boolean

---

## Presentation Rule

Patient-facing language should never imply MAT support when the facility only offers:
- general medication management
- psychiatric support
- outside coordination without actual MAT continuation or initiation

The system must not blur:
- “can prescribe / continue MAT”
with
- “has some medical support”

---

## Strategic Rationale

Prevent:
- breathwork / wellness language substituting for actual MAT support
- patient mistrust caused by clinical mismatch
- inflation of psychiatric capability

Allow:
- real differentiation between facilities
- better routing for opioid / alcohol medication support needs
- future refinement around provider depth and acuity handling

---

## One-Line Summary

MAT capability and medical / psychiatric support must be captured separately so NRIN can distinguish true addiction-medication support from general clinical coverage.
