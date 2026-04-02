# NRIN — FACILITY PORTAL BOUNDARY — 2026-04-02

## Purpose

Define the separation between:

- NRIN internal facility console
- facility-facing portal

This boundary is critical for:
- privacy
- access control
- clean onboarding architecture
- future verification workflows

---

## Core Principle

Facilities must never have access to other facilities.

NRIN staff may access:
- all facilities
- all verification layers
- all operational views

Facility users may access:
- only their own facility
- only their own site(s), if explicitly authorized

---

## Two Distinct Surfaces

### 1. NRIN Internal Facility Console

This is the internal admin/operator surface.

Examples:
- full facility directory
- Queue B analysis
- Queue C verification
- provenance review
- operations control
- cross-facility comparison

The current route:

`/facility/dashboard`

should be treated as:

👉 NRIN internal only

This is NOT the facility-facing onboarding page.

---

### 2. Facility-Facing Portal

This is the facility’s own portal.

Purpose:
- onboarding
- profile confirmation
- claim / correction
- document upload
- limited status visibility

A facility user must see only:
- their own facility record
- their own site-specific onboarding flow
- their own verification / claim history

They must not see:
- any other facility
- any directory
- any cross-facility comparison
- internal NRIN verification notes
- Queue C reviewer observations
- internal ranking logic

---

## Route Model

### Internal NRIN surface
Examples:
- `/facility/dashboard`
- future internal review routes

### Facility portal
Should be a separate facility-scoped route, for example:
- `/facility/portal`
- `/facility/onboarding`
- `/facility/profile`

Exact path may change, but the separation must remain absolute.

---

## Authentication Rule

NRIN internal auth and facility auth are not the same thing.

### NRIN internal user
May access:
- all facilities
- verification layers
- internal notes
- queue workflows

### Facility user
May access:
- only authorized facility/site records

No facility login may ever fall through to the NRIN internal facility console.

---

## Authorization Rule

Authorization must be facility-scoped.

A facility user must resolve to:
- one facility site
- or an explicitly allowed facility group / set of sites

This scope must be enforced in:
- route loading
- DB queries
- mutations
- uploads
- review history visibility

---

## Onboarding Rule

Facility onboarding belongs in the facility-facing portal, not in the internal dashboard.

The internal dashboard may preview or inspect onboarding state, but it is not the facility’s entry point.

---

## Verification Visibility Rule

### Facility user may see:
- system understanding of their own facility
- their own claims / confirmations
- selected verification status where appropriate

### Facility user may not see:
- internal NRIN review notes
- Queue C web/phone reviewer comments
- internal cultural competence observations
- other facilities’ data
- internal ranking or queue prioritization logic

---

## Queue C Rule

Queue C remains NRIN internal.

Queue C is never exposed directly to facilities.

Facilities may indirectly influence future verification by:
- confirming data
- uploading documents
- correcting claims

But Queue C itself is part of the NRIN internal verification system.

---

## Data Model Implication

The system must support:

- internal cross-facility access for NRIN
- facility-scoped access for portal users

This means all facility-facing reads and writes must be tied to:
- `facility_site_id`
- or equivalent facility authorization mapping

---

## Strategic Rationale

Prevent:
- privacy violations
- accidental cross-facility exposure
- confusion between internal ops and facility onboarding
- contamination of internal verification layers

Enable:
- secure onboarding
- clear ownership
- clean future auth model
- trustworthy facility participation

---

## One-Line Summary

`/facility/dashboard` is NRIN internal; facility onboarding must live in a separate facility-scoped portal where each facility sees only its own record.
