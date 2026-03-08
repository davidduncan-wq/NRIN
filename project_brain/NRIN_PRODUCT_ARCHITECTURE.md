# NRIN — PRODUCT ARCHITECTURE
Working product architecture for NRIN after patient intake completion.

This document captures the **current product-direction architecture** for the next system phase after the patient intake flow.

It is intended to bridge:
- patient intake
- facility matching
- treatment center pre-screen
- acceptance / rejection routing
- admissions escalation workflow

This document may evolve as the product matures, but it should remain focused on **system-level product architecture**, not session chatter.

---

# 1. Current Product State

The patient intake flow is now visually and structurally polished through Steps 1–6.

Current implementation state:

- Step 1 — Basic information
- Step 2 — Identity & address
- Step 3 — Housing
- Step 4 — Substances & treatment
- Step 5 — Review & confirm
- Step 6 — Recommendation / submit intake

Engineering status:
- Steps 1–5 are modular step components
- Step 6 currently remains inline inside `src/app/patient/page.tsx`
- Shared intake design language is now established
- `ChoiceButton` has been upgraded as a canonical shared UI primitive

This means the **patient-facing intake UX is now considered functionally and visually mature enough** to move into the next system phase.

---

# 2. Product Direction — Beyond Intake

NRIN is not just an intake form.

It is evolving into a **recovery routing and admissions orchestration system**.

The intended flow after patient intake is:

Patient Intake Complete
↓
NRIN calculates weighted facility matches
↓
Patient sees 3–5 best-fit treatment center options
↓
Patient selects a preferred treatment center
↓
Treatment Center Pre-Screen begins
↓
Facility accepts / rejects / conditionally escalates
↓
Accepted cases move into admissions operations
↓
Rejected cases reroute back through matching logic

---

# 3. Facility Matching Layer

After intake, NRIN should recommend a shortlist of facilities based on weighted match criteria.

Target recommendation count:
- likely 3–5 facilities
- exact count still to be finalized

The matching engine should consider factors such as:
- level of care fit
- substance profile
- withdrawal risk
- relapse risk
- housing instability
- support needs
- co-occurring capability
- geographic fit
- insurance compatibility
- program specialty / patient fit
- bed availability (eventually)

The patient should then choose among these options through a highly usable, emotionally respectful UI.

Important UX principle:
- the interaction may be card-based or swipe-like
- but the tone must remain calm, dignified, and recovery-oriented
- never gamified in a flippant way

---

# 4. Treatment Center Pre-Screen Workflow

Once the patient selects a treatment center, the case enters a **Treatment Center Pre-Screen workflow**.

This pre-screen is typically conducted over the phone with the patient.

Goals:
- gather missing gold-standard intake data
- validate or revise the initial intake picture
- determine whether the patient is appropriate for admission
- identify whether a higher clinical review is needed
- prepare the file as fully as possible before arrival

The pre-screen should be modular and structured.

Primary sections include:

## 4.1 Safety / Immediate Support
- Are you safe right now?
- Is anyone with you supporting you?
- Immediate risk concerns
- current presentation context if relevant

## 4.2 Motivation / Goals
- What is motivating you to seek treatment now?
- What do you hope to get out of treatment?
- What needs most urgently need to be addressed?

## 4.3 Social / Environmental Context
- living situation
- stable home environment
- safety at home
- support system
- recovery support
- work / financial / relationship stressors
- legal issues / pending charges / DUI history

## 4.4 Placement / Substance Use Questions
- drug of choice
- other substances used
- last use
- frequency
- route of administration
- years of use
- age of first use
- prior attempts at sobriety
- prior treatment history
- family history of substance use

## 4.5 Medical / Mental Health History
- medical conditions worsened by use or withdrawal
- current medications / OTC / supplements
- known mental health diagnoses
- hospitalization history
- psychiatric facility history
- depression symptoms
- suicidal / homicidal thoughts
- prior suicide attempts
- medications currently taken

---

# 5. Acceptance / Rejection Logic

After pre-screen, the treatment center must be able to disposition the case.

Possible outcomes:
- accepted
- rejected
- conditionally accepted pending clinical review
- escalated to higher clinical level

If accepted:
- file proceeds to admissions operations
- transport workflow may be triggered
- ETA should be tracked
- insurance verification should begin
- bed inventory / reservation should update
- patient name, age, and ETA should be visible in the treatment center workflow

If rejected:
- facility must provide a reason
- rejection reason becomes a routing signal
- case is returned to the NRIN matching system
- patient is re-stratified toward better-fit facilities

Important principle:
- rejection reasons should influence future routing
- but should not permanently brand the patient with a fixed label

---

# 6. Clinical Escalation Layer

Some pre-screen questions or admissions decisions require licensed review.

Once a case is accepted or conditionally escalated, the file should move to the proper clinical role:
- physician
- nurse practitioner
- nurse
- therapist
- certified admissions / clinical staff
- other licensed reviewer as required

This escalation should trigger a secure link that can be opened on:
- mobile
- desktop

The receiving staff member should be able to:
- open the case quickly
- see the patient summary
- see current status
- complete only the fields relevant to their role
- continue the intake / admissions workflow

This layer should feel like **task-based role escalation**, not simply “more fields on one giant form.”

---

# 7. Forgiving Data Model / Anti-Branding Principle

NRIN must be designed so that patients are **not permanently misclassified** because of:
- intoxication
- confusion
- fear
- misinformation
- staff error
- premature assumptions
- changing disclosure

This is one of the core philosophical and architectural principles of the product.

Therefore:

## 7.1 The patient file must be revision-based
Important data should not be treated as permanent truth from the first answer.

Instead, the system should preserve:
- current value
- source
- timestamp
- confidence
- revision history
- reviewer role

## 7.2 High-impact classifications must be reviewable
Examples:
- co-occurring capability needed
- suicidality concern
- homelessness
- medical instability
- placement restrictions

These should remain:
- revisable
- attributed
- confidence-aware
- open to higher-level override

## 7.3 The system should distinguish:
- patient self-report
- staff observation
- clinical confirmation

These are different kinds of truth and must not be conflated.

---

# 8. Presentation Status (Instead of Permanent Labels)

NRIN should avoid creating static labels from temporary states.

Example:
A patient who appears intoxicated during a call should not be permanently labeled as “intoxicated.”

Instead, use a time-based presentation concept such as:
- appears sober
- possibly intoxicated
- clearly intoxicated
- in withdrawal
- unknown

This should be:
- observational
- time-stamped
- source-attributed
- updateable

This is a dynamic operational signal, not a permanent identity marker.

The initial patient intake already partially captures this through last-use timing.
Future staff workflows may add presentation-status observations where appropriate.

---

# 9. Insurance / Admissions Operations

Once a facility accepts a patient, admissions-related operations should eventually include:
- insurance verification
- authorization workflow
- transport coordination
- bed assignment / bed hold
- ETA tracking
- admissions readiness
- outstanding clinical requirements

Insurance API integration may be explored in the future, but the system should not depend on payer APIs in the first version.

The architecture should support:
- manual workflow first
- automation later

---

# 10. Recommended Immediate Next Build Phase

The next major product phase should proceed in this order:

1. Define patient case-state model
2. Design facility matching / selection UI
3. Design treatment center pre-screen workflow
4. Design rejection / rerouting workflow
5. Design clinical escalation workflow
6. Add admissions operations layers (transport, insurance, bed status, ETA)

This is the point where NRIN transitions from:
- a polished intake experience

to:

- a true routing and admissions operating system for recovery placement

