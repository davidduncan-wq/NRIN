# CURRENT_HANDOFF.md
Current NRIN development handoff.
This file reflects the active engineering state of the project and the next development priorities.

---

# 1. Current Project State

NRIN patient intake is now visually and structurally polished through Steps 1–6.

This phase focused on:
- desktop / mobile parity
- consistent layout rhythm
- modular component architecture
- premium product-level UX
- alignment with the NRIN-demo visual standard

Current intake structure:

Step 1 — Basic information  
Step 2 — Identity & address  
Step 3 — Housing  
Step 4 — Substances & treatment  
Step 5 — Review & confirm  
Step 6 — Recommendation / submit intake

Engineering implementation:

Steps 1–5 exist as modular components located in:

src/app/patient/components/

Step 6 remains inline in:

src/app/patient/page.tsx

This is acceptable for now and does not require immediate refactoring.

Shared design improvements:

- patient page wrapper spacing refined
- intake content card proportions improved
- progress rail polished
- `ChoiceButton` upgraded as canonical UI primitive

The intake experience now exceeds demo quality in several areas and is considered stable enough to move forward into the next product phase.

---

# 2. Canonical Engineering Repository

Engineering repo:

https://github.com/davidduncan-wq/NRIN

Latest intake polish commit:

23c5ac4 — Polish patient intake Steps 1-6 and unify intake design system

Recent modifications include:

- Step1Demographics.tsx
- Step2Contact.tsx
- Step3Housing.tsx
- Step4Substances.tsx
- Step5Review.tsx
- patient/page.tsx
- components/ui/ChoiceButton.tsx

No database schema changes occurred during this phase.

The recent work was primarily:

- layout refinement
- component cleanup
- UX improvement
- design system alignment

---

# 3. Important Implementation Notes

During the intake redesign phase the following were intentionally preserved:

- patient intake logic
- repaired Step 3 housing logic
- modular component structure
- Supabase wiring
- form state structure
- API integration points

The redesign focused on UI/UX quality rather than architectural changes.

This keeps the system stable while preparing for the next major capability layer.

---

# 4. Product Direction Shift

The project priority has now moved beyond intake polish.

NRIN is evolving into a recovery routing and admissions orchestration platform.

The next product phase begins immediately after patient intake completion.

Target workflow:

Patient completes intake  
↓  
NRIN computes weighted facility matches  
↓  
Patient sees 3–5 best-fit treatment centers  
↓  
Patient selects a preferred treatment center  
↓  
Treatment center performs pre-screen  
↓  
Facility accepts / rejects / escalates  
↓  
Accepted patients move into admissions operations  
↓  
Rejected patients re-enter the matching system

This is now the primary architectural focus.

---

# 5. Treatment Center Pre-Screen Concept

After the patient selects a facility, the case enters a treatment center pre-screen workflow.

This step typically occurs over the phone between the admissions coordinator and the patient.

Purpose:

- fill missing intake information
- validate early patient responses
- determine proper level of care
- identify clinical escalation requirements
- prepare the file before patient arrival

Pre-screen sections should include:

- safety & immediate support
- motivation for treatment
- social / environmental context
- substance use history
- placement questions
- medical / mental health history

The workflow should be modular and structured rather than a single long form.

---

# 6. Acceptance / Rejection Workflow

After pre-screen the treatment center must disposition the case.

Possible outcomes:

- accepted
- rejected
- conditionally accepted pending clinical review
- escalated to licensed clinical reviewer

If accepted:

- admissions workflow begins
- transport coordination may trigger
- insurance verification may begin
- bed inventory may update
- ETA should be tracked
- patient identity and arrival time should be visible to the facility

If rejected:

- facility must provide rejection reason
- rejection reason becomes routing signal
- case returns to NRIN matching engine
- system reroutes patient toward better-fit facilities

Important principle:

Rejection reasons should influence routing but must not permanently brand the patient.

---

# 7. Core Architectural Principle — Forgiving Data Model

NRIN must prevent permanent misclassification of patients.

Patients may provide inaccurate information due to:

- intoxication
- confusion
- fear
- incomplete memory
- changing disclosure
- staff interpretation error

Therefore:

Patient files should be revision-based rather than static.

Important data should preserve:

- current value
- source
- timestamp
- confidence level
- revision history
- reviewer role

High-impact classifications must remain editable and reviewable.

Examples:

- co-occurring capability
- suicidality
- homelessness
- medical instability
- placement restrictions

---

# 8. Presentation Status vs Permanent Labels

Temporary conditions should not become fixed identity attributes.

Example:

A patient who appears intoxicated during a phone call should not be permanently labeled as intoxicated.

Instead, the system should store presentation status such as:

- appears sober
- possibly intoxicated
- clearly intoxicated
- in withdrawal
- unknown

These observations should be:

- time-stamped
- source-attributed
- revisable

The intake flow already partially captures this through last-use timing, reducing the need for permanent intoxication flags.

---

# 9. Admissions Operations Layer (Future)

After acceptance the system may eventually coordinate:

- transport logistics
- insurance verification
- authorization workflow
- bed inventory
- bed holds
- ETA tracking
- admissions readiness
- clinical documentation completion

Insurance API integration may be explored later.

Initial architecture should support manual workflow first, automation later.

---

# 10. Immediate Next Build Order

The next development phase should proceed in this order:

1. Define case-state model
2. Design facility matching interface
3. Build patient facility selection UI
4. Design treatment center pre-screen workflow
5. Implement rejection / rerouting architecture
6. Design clinical escalation workflow
7. Expand admissions operations layer

This marks the transition from intake system to recovery placement platform.

---

# 11. Next Engineering Session Starting Point

The next session should begin with:

Designing the facility matching flow.

Questions to solve:

- how NRIN presents the 3–5 facility matches
- what information each facility card shows
- how the patient chooses a facility
- how the chosen facility receives the case
- what the first facility-side screen looks like

This is the hinge between the completed intake system and the facility pre-screen workflow.

---

# 12. Brain File Read Order for New AI Session

Any new AI session should read the following files in this order:

- project_brain/NRIN_PROJECT_INDEX.md
- project_brain/NRIN_CANONICAL_STATE.md
- project_brain/NRIN_SYSTEM_MAP.md
- project_brain/NRIN_SURGICAL_EDIT_RULES.md
- project_brain/CURRENT_HANDOFF.md
- project_brain/NRIN_PRODUCT_ARCHITECTURE.md
