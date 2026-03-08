# Next Build Target

## Title
NRIN Treatment Center Intake + Case State Machine

## Objective
Build the next major operational layer of NRIN:
the treatment-center-side intake and the canonical case state machine that governs referral progression from patient submission to admission or escalation.

## Why This Matters
The current system has intake and referral foundations, but the real engine of NRIN is the operational flow that begins after a patient is matched.

That engine is:

Patient Intake
→ Match Engine
→ Top 3–5 Facilities
→ Tinder-style facility selection
→ Treatment Center Pre-Screen
→ Accept / Reject
→ Transportation + Insurance + Bed
→ Clinical Escalation

Without this layer, NRIN is only a form and referral surface.
With it, NRIN becomes a treatment placement operating system.

## In Scope
- Define canonical case states
- Define allowed state transitions
- Build treatment center pre-screen intake flow
- Connect facility review actions to case state updates
- Prepare operational handling for:
  - acceptance
  - rejection
  - bed availability
  - transportation coordination
  - insurance barriers
  - clinical escalation

## Out of Scope
- Full production automation for every downstream task
- Deep billing workflows
- Final analytics/reporting layer
- Broad UI redesign unrelated to this milestone
- Unrelated refactors

## Expected Functional Shape
1. Patient submits intake
2. System runs match logic
3. System presents top 3–5 facilities
4. Facility selection is captured
5. Treatment center completes pre-screen / review
6. Case is updated through explicit state transitions
7. Outcome is visible and operationally actionable

## Candidate Canonical States
These are directional and may be refined during implementation:

- NEW_INTAKE
- MATCHED
- FACILITY_SELECTED
- FACILITY_REVIEWING
- ACCEPTED
- REJECTED
- TRANSPORT_PENDING
- BED_CONFIRMED
- INSURANCE_PENDING
- CLINICAL_ESCALATION
- ADMITTED
- CLOSED

## Acceptance Criteria
This milestone is successful when:

- treatment-center-side intake/review exists in the repo
- case state progression is explicit and structured
- referral movement is no longer ad hoc
- the next AI session can clearly identify the active lifecycle model
- the architecture remains consistent with existing NRIN design and repo structure

## Implementation Notes
- Preserve the existing design system
- Follow surgical edit rules
- Avoid broad rewrites
- Keep GitHub as source of truth
- Align implementation with:
  - project_brain/NRIN_CANONICAL_STATE.md
  - project_brain/NRIN_SYSTEM_MAP.md
  - project_brain/CURRENT_HANDOFF.md
  - project_brain/NRIN_PRODUCT_ARCHITECTURE.md

## Owner
Current active milestone for all new AI sessions unless explicitly replaced by a newer target.
