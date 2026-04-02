# NRIN — INSURANCE ONBOARDING RULE — 2026-03-31

## Purpose

Define how insurance acceptance is handled during facility onboarding.

This must:
- start from system-detected insurance truth
- allow facilities to confirm or refine it
- avoid corrupting matcher truth
- keep onboarding low-friction

---

## Boundary

This file covers:
- insurance confirmation-first UX
- facility insurance claims
- separation between detected truth and claimed truth
- self-pay guidance framing

This file does NOT cover:
- insurer reimbursement contracts
- insurance billing mechanics
- claims submission
- facility accounting systems

---

## Core Principle

Insurance onboarding is:
- confirmation-first
- refinement-second
- non-blocking
- separate from pricing

Facilities should not be asked to build insurance truth from scratch if the system already has a strong understanding.

---

## Current Truth Layers

### 1. System-detected truth
Derived from:
- crawler
- Queue A enrichment
- insurance truth resolver

Examples:
- accepts_private_insurance_detected
- accepts_medicaid_detected
- accepts_medicare_detected
- detected_insurance_carriers
- accepted_insurance_providers_detected

This is matcher-facing truth.

### 2. Facility-claimed truth
Collected during onboarding.

This is:
- confirmation
- correction
- refinement

This must not overwrite detected truth directly.

---

## UX Rule

Do NOT ask:
“What insurance do you take?” as a blank form.

Do say:
“Here’s what we currently understand about how you work with insurance.”

Then allow:
- Yes — this looks right
- Not quite

If yes:
- collapse section
- continue

If not:
- expand into refinement controls

---

## Refinement Inputs

### Commercial insurance
Prompt:
“How does insurance usually work when someone comes to you?”

Options:
- Most commercial plans work
- Some plans work
- Usually out-of-network
- Self-pay only

### Medicaid / Medicare
Prompt:
“Do you work with:”
- Medicaid: Yes / No
- Medicare: Yes / No

### Carrier list
Prompt:
“We’ve seen these come up.”
- pre-filled from detected carriers
- allow add/remove

### Optional patient-facing note
Prompt:
“Anything patients should know before they call?”

This is presentation-layer guidance, not matcher truth.

---

## Self-Pay Guidance

Self-pay is optional and secondary.

Prompt:
“For people paying out of pocket, we may share a general sense of cost — just so there are no surprises.”

Preferred structure:
- price ranges first
- detailed day rates optional

Examples of ranges:
- Under $10,000
- $10,000–$20,000
- $20,000–$30,000
- $30,000–$50,000
- $50,000–$70,000
- $70,000+

Detailed pricing remains internal to the facility.
NRIN uses general ranges to guide patient expectations and matching.

Self-pay pricing shown to patients is:
- general guidance
- not a final quote
- distinct from insurance-based billing

Insurance-specific details are not shown publicly.

---

## Real-Time Update Rule

Facilities must be reassured:

“You can update this at any time — changes take effect immediately.”

Purpose:
- reduce fear of being locked in
- support occupancy/seasonality changes
- encourage honest participation

---

## Matching Rule

Matching uses:
- system-detected insurance truth
- resolver outputs
- later verified layers

Matching does not directly trust facility-entered insurance claims until verification layers exist.

---

## Downstream Use

Facility insurance claims may be used for:
- onboarding refinement
- internal review
- future facility-verified truth
- future NRIN-verified truth
- patient-facing guidance where appropriate

They should not directly override matcher truth.

---

## Strategic Rationale

Prevent:
- blank-slate onboarding friction
- matcher corruption
- exposure of internal pricing/accounting logic

Allow:
- crawler gap correction
- better patient expectation setting
- future verification
- future CRM separation between matching and billing

---

## One-Line Summary

Insurance onboarding starts with system understanding, allows low-friction refinement, and preserves a clean separation between matcher truth, patient guidance, and internal facility accounting.
