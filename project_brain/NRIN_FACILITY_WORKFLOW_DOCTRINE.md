cat > project_brain/operations/NRIN_FACILITY_WORKFLOW_DOCTRINE.md <<'EOF'
# NRIN — FACILITY WORKFLOW DOCTRINE

## Purpose

This document defines the facility-side operational workflow after a patient has been recommended and a facility-side record has been created.

This is not the patient journey.
This is not the matching engine.
This is the facility admissions workflow.

---

## Core Principle

Facility workflow truth belongs to the facility-side operational layer.

It should remain distinct from:

- patient intake progress
- match presentation
- case journey state

NRIN must distinguish:

- what the system recommends
- what the patient selected
- what the facility is doing right now

---

## Layer Distinction

### Recommendation
System-level fit output.

Examples:
- recommended facility
- recommended options
- recommendation reasons

### Case
Shared patient/facility chart shell and operational bridge.

Examples:
- case number
- patient linkage
- active placement target
- packet completeness
- placement timeline

### Facility Workflow
Facility-specific review and admissions activity.

Examples:
- new patient
- pre-screen started
- awaiting patient info
- internal review
- accepted
- not fit
- recommended elsewhere

---

## Referral Status Doctrine

`referrals.status` should represent facility workflow state.

Recommended status set:

- `new`
- `in_review`
- `awaiting_patient_info`
- `internal_review`
- `accepted`
- `not_fit`
- `recommended_elsewhere`
- `closed`

---

## Meaning Of Each Status

### `new`
A new patient/case has arrived for this facility.
SLA clock starts here.

### `in_review`
Treatment coordinator or admissions staff has started pre-screen / triage.

### `awaiting_patient_info`
Facility cannot continue review until additional patient / NRIN information is provided.

Examples:
- insurance/payment clarification
- ID
- medication list
- substance-use detail
- medical detail
- legal / monitoring detail
- transport / arrival detail

This is not a decline.

### `internal_review`
The case has enough initial information and is now being escalated internally.

Examples:
- admissions director
- clinical director
- NP
- MD / medical director
- utilization review

### `accepted`
Facility has approved the patient for admission path.

### `not_fit`
Facility determined the patient is not the right fit and is not yet recommending another facility.

### `recommended_elsewhere`
Facility determined the patient is not the right fit and has recommended/passed the case to another facility.

This is where the transparent exchange model begins to operate.

### `closed`
Terminal state for this facility's workflow on this case.

---

## Action Doctrine

Statuses are not actions.

Actions move a referral from one status to another.

Examples:

- Start pre-screen -> `in_review`
- Request patient info -> `awaiting_patient_info`
- Escalate internally -> `internal_review`
- Accept -> `accepted`
- Mark not fit -> `not_fit`
- Recommend better-fit facility -> `recommended_elsewhere`

---

## Required Metadata By Action

### Request patient info
Require:
- missing info category/categories
- optional note

Suggested categories:
- insurance/payment
- ID/documents
- medications
- substance-use detail
- mental health detail
- medical history
- legal/monitoring detail
- travel/arrival logistics
- other

### Escalate internally
Require:
- escalation target
- optional note

Suggested targets:
- admissions director
- clinical director
- NP
- MD / medical director
- utilization review
- other

### Accept
Require:
- optional note for now

Later:
- bed hold
- ETA
- arrival window
- admitting level of care

### Not fit
Require:
- reason to NRIN

Suggested reason categories:
- no bed
- clinical capability mismatch
- dual-diagnosis limitation
- medical acuity
- payment mismatch
- geographic/logistical issue
- documentation incomplete
- other

### Recommend better-fit facility
Require:
- receiving facility
- reason to NRIN
- optional exchange note

---

## Product Rule

"Need more information" is not a final disposition.
It is a workflow branch inside review.

Do not model it as a terminal outcome.

---

## Strategic Principle

NRIN should help facilities avoid inappropriate admits driven by marketing spend or payment pressure.

Facilities should be able to preserve value while routing patients toward the best available treatment environment.

This is part of NRIN's role in transforming opaque industry behavior into transparent, accountable workflow.

EOF