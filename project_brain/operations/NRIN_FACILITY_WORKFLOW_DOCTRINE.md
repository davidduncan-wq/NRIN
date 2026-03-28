# nrin — FACILITY WORKFLOW DOCTRINE

## Core Principle

Facility workflow is operational handling of a case.
It is not the matcher.
It is not the patient-facing recommendation surface.

---

## Current Workflow Truth

Facility can now:
- move a case through review states
- recommend elsewhere
- return to nrin
- create real downstream operational movement

---

## Current Status Model

- new
- in_review
- awaiting_info
- internal_review
- accepted
- returned_to_nrin
- recommended_elsewhere
- expired
- closed

---

## Important Behavioral Rule

Some statuses are workflow branches, not raw direct-save actions.

Interactive pill ≠ immediate DB mutation

Correct pattern:
- click pill
- open workflow branch
- explicit submit button executes action

This applies to:
- returned_to_nrin
- recommended_elsewhere

---

## returned_to_nrin
Current behavior:
- current referral row is marked returned_to_nrin
- recommendation reason is stored
- a v1 reroute creates a new referral row

Still needed:
- replace fallback reroute with matcher-grade reroute

---

## recommended_elsewhere
Current behavior:
- current referral row is marked recommended_elsewhere
- target facility and reason are stored
- new receiving referral row is created

This is now a real facility-to-facility exchange execution path.

---

## Facility-facing UI rule
Facility workflow should NOT expose raw admin reassignment tools.
The old assign-facility-site control is hidden from facility-facing UI and should remain admin-only in spirit until a real nrin admin surface exists.

