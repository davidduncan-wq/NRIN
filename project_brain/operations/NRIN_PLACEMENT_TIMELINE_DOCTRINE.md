# NRIN — PLACEMENT TIMELINE DOCTRINE

## Purpose

This document defines the distinction between intake progress and placement progress in NRIN.

The system should not treat these as the same thing.

---

## Core Distinction

### 1. Intake Progress
Intake progress is form completion.

This is the current patient intake step system.

Examples:
- Basic information
- Identity and address
- Housing
- Substances and treatment
- Life situation and preferences
- Review and confirm
- Recommendation

This belongs to the intake flow and should end when intake is complete.

---

### 2. Placement Progress
Placement progress is operational status.

This begins after intake and recommendation.

It is not a form wizard.
It is a live status timeline.

This model should feel closer to:
- FedEx package tracking
- Uber trip progress
- Instacart order / delivery status

Not:
- static form steps

---

## Product Rule

NRIN should eventually support a separate patient placement timeline after recommendation and facility selection.

This should be a distinct product surface from intake.

Do not overload the intake sidebar with post-intake operational tracking.

---

## Future Placement Timeline States

Likely examples:

- Intake received
- Recommendation delivered
- Facility selected
- Referral sent
- Facility reviewing
- Accepted
- Alternative suggested
- Travel in progress
- Arrived
- Admitted

These states may not always be perfectly linear.

The system should be designed for real-world status transitions rather than rigid form progression.

---

## Location / Check-In Principle

NRIN may eventually support patient location sharing or lightweight check-in updates during the placement and travel phase.

Possible future mechanisms:
- text message prompts
- “send location” request
- shared location link
- map-based travel confirmation
- check-in / arrival confirmation

Examples:
- Last check-in: 4:00 AM, DFW Airport
- En route to facility
- Arrived near facility
- Awaiting intake

This is useful for:
- facility operations
- referral coordination
- patient support
- arrival confidence

---

## Clinical / Safety Reminder

This timeline is not only about convenience.

There is a safety layer.

A patient may be accepted and physically near the facility, but still remain at risk until safely inside and admitted.

This means future placement tracking should eventually account for:
- arrival
- handoff
- admission confirmation

Not just:
- referral sent
- patient en route

---

## Architecture Rule

Keep these systems separate:

### Intake UI
- form progress
- completion steps
- current patient intake surface

### Recommendation UI
- recommendation presentation
- match explanation
- additional options

### Placement Timeline UI
- operational tracking
- referral status
- travel / arrival / admission status
- future map / location / check-in layer

These surfaces are related but should not be collapsed into a single overloaded page.

---

## Strategic Principle

NRIN should eventually evolve from:
- intake software
to:
- intake + recommendation + placement coordination system

The placement timeline is a key part of that evolution.

---

## Current Rule

Do not build this now.

But preserve this doctrine because it should guide future decisions around:
- patient status UX
- facility dashboard expectations
- texting / check-in workflows
- travel / arrival / admission tracking
