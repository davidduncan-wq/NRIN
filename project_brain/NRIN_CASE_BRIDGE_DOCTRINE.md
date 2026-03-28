cat > project_brain/operations/NRIN_CASE_BRIDGE_DOCTRINE.md <<'EOF'
# NRIN — CASE BRIDGE DOCTRINE

## Purpose

This document defines the case layer as the operational bridge between patient-side and facility-side NRIN surfaces.

The case is not the matcher.
The case is not the facility workflow.
The case is the shared chart shell tying both sides together.

---

## Core Principle

The case owns shared operational truth between:

- patient-side journey
- facility-side workflow
- placement coordination
- packet/document completeness
- timeline visibility

---

## Layer Separation

### Patient Layer Owns
- intake
- match selection
- patient-facing pre-screen / ratification
- patient-uploaded packet items
- patient-visible status

### Facility Layer Owns
- facility profile verification
- operational status
- referral inbox
- facility-side pre-screen completion
- internal review
- disposition
- transport/admission readiness
- internal facility notes

### Case Layer Owns
- case number
- patient linkage
- placement linkage
- packet completeness
- pre-screen completeness
- journey timeline
- readiness state
- shared chart shell

---

## Case Vs Referral

### Case
Answers:
"What is happening in this patient's overall journey?"

### Referral
Answers:
"What is this facility doing with this patient right now?"

The case is shared.
The referral is facility-specific.

---

## Current Product Truth

`cases.state` should represent journey-level truth.

Examples:
- `NEW_INTAKE`
- `MATCH_SELECTED`
- future placement/admission journey states

`referrals.status` should represent facility workflow truth.

Examples:
- `new`
- `in_review`
- `awaiting_patient_info`
- `internal_review`
- `accepted`
- `not_fit`
- `recommended_elsewhere`

---

## Placement Bridge Principle

The case must know the active placement target.

Operationally, NRIN is routing to facility sites, not abstract parent facilities.

The case layer should therefore preserve site-level placement truth.

---

## Packet / Chart Principle

The case should become the canonical home for:
- patient-uploaded identity/payment documents
- shared intake / pre-screen completeness
- admissions-readiness indicators
- timeline visibility
- future revision-aware chart truth

Not all of this must be built immediately.
But this is the boundary.

---

## Strategic Reminder

The case is the bridge between:

- patient chooses a place
- facility evaluates the patient
- the system tracks the placement journey

Do not smear this across patient pages, facility pages, or match presentation components.

EOF