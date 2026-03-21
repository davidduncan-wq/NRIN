# NRIN — ACTIVATION FLOW V1

## Purpose

Define the first operational version of NRIN’s activation flow:
the moment a patient selects a facility → to the moment a facility engages.

This flow must:

* preserve patient trust
* minimize friction
* create real-world connection
* remain operationally simple

This is not the final system.

This is the **first working loop**.

---

## Core Principle

NRIN does not feel like a system coordinating events.

It feels like:

> **help is already in motion**

---

## Activation Trigger

The flow begins when the patient clicks:

> **“Explore this option” → “Continue with this facility” (future)**

---

## System Actions (Immediate)

Upon click:

### 1. Facility is notified

* Intake contact receives referral
* Status = `Pending`

### 2. Patient receives confirmation (UI)

**Headline**
Help is on the way.

**Sub**
We’ve alerted the admissions team at [Facility Name].

**Status**
They’ll contact you shortly.

**Optional (small text)**
Most facilities respond within a few minutes.

---

### 3. Patient receives SMS

**Primary**
NRIN: Help is on the way.
We’ve contacted [Facility Name].
Expect a call shortly from their admissions team.

**Optional second line**
Stay available — you’ve taken an important step.

---

## Facility Notification (SMS / Intake Alert)

**Message**

NRIN Referral
New patient ready for intake

Name: [if available]
Phone: [required] (text OK if applicable)
Needs: [detox / residential / etc]
Insurance: [carrier]

Status: Pending response
Move to “In Review” to claim

---

## Status Model (V1)

### 1. Pending

* Default state after patient action
* Facility has been notified
* Awaiting engagement

---

### 2. In Review

Triggered by facility.

Meaning:

* Facility has seen the referral
* Intake is reviewing / preparing to contact

---

### Patient UI Update

[Facility Name] is reviewing your information.
They’ll be reaching out shortly.

---

### 3. Contacted

Triggered by facility.

Meaning:

* Call or text has been initiated
* Human connection underway

---

## Patient Experience Rules

* No timers are shown
* No urgency pressure is displayed
* No system language is exposed
* No failure states are surfaced in V1

The experience should feel:

* calm
* stable
* certain

---

## Facility Experience Rules

Facilities must be able to:

* receive referral instantly
* move status to “In Review”
* initiate contact quickly

Future capabilities (not in V1):

* response timers
* extension requests
* availability signaling

---

## Admin (NRIN) Observability

NRIN tracks internally:

* time to “In Review”
* time to “Contacted”
* facility responsiveness patterns

This data is:

* not visible to patient
* not enforced yet
* used for future system intelligence

---

## Explicitly Out of Scope (V1)

Do NOT implement:

* multi-facility routing
* fallback escalation logic
* after-hours logic
* transport coordination
* intake completion flows
* insurance verification workflows
* extended messaging states
* audio / content engagement
* location sharing

---

## Success Criteria

This flow is successful if:

1. Patient clicks → feels immediate reassurance
2. Facility receives → understands exactly what to do
3. Facility responds → makes contact
4. Patient connects → without confusion or friction

---

## Strategic Note

This is not a marketplace interaction.

This is:

> **a handoff between a person asking for help and a place that can provide it**

The system exists only to make that handoff feel:

* immediate
* human
* trustworthy

---

## Future Layers (Not V1)

* Time-aware routing
* Facility response SLAs
* Escalation logic
* Transport coordination (Uber-style)
* Intake completion / pre-screen
* Outcome tracking + reporting
* Compliance + documentation systems
* Facility dashboard expansion
* Patient engagement content

---

## One-Line Summary

> When a patient chooses a facility, NRIN ensures the facility is alerted instantly and the patient feels that help is already in motion.
