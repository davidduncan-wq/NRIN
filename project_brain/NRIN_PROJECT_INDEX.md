PROJECT_INDEX.md
Place at:
project_brain/PROJECT_INDEX.md
# NRIN — PROJECT INDEX
Canonical orientation document for the NRIN project.

This file provides a **stable structural map of the system** for engineers and AI agents.  
It should contain **no session-specific information** and should change only when the **system architecture itself changes**.

For current work status, see:

CURRENT_HANDOFF.md

---

# 1. Project Overview

NRIN (National Recovery Intake Network) is a system designed to:

1. intake patients seeking substance use treatment
2. evaluate clinical and situational signals
3. generate treatment recommendations
4. route referrals to appropriate treatment facilities
5. allow facilities to review and manage referrals

The system functions as a **central intake and triage layer** between patients and treatment providers.

---

# 2. Core System Pipeline

The NRIN system currently follows this pipeline:
Patient Intake
↓
Patient Record (Supabase)
↓
Clinical Evaluation / Recommendation
↓
Referral Creation
↓
Facility Routing
↓
Facility Review / Assignment

---

# 3. Canonical Repositories

## Brain / Project Memory

NRIN Brain Repository

https://github.com/davidduncan-wq/NRIN-brain

Contains:
AI_SESSION_PROTOCOL.md
PROJECT_INDEX.md
NRIN_CANONICAL_STATE.md
NRIN_SYSTEM_MAP.md
NRIN_SURGICAL_EDIT_RULES.md
CURRENT_HANDOFF.md

The brain repository acts as the **persistent engineering memory** of the project.

---

## Engineering Code Repository

NRIN Production Code

https://github.com/davidduncan-wq/NRIN

This repository contains the **modular production implementation** of the NRIN platform.

Primary code areas:
src/app/patient
src/app/facility
src/components/ui
src/lib

---

## Intake Design Reference Repository

NRIN Demo Repository

https://github.com/davidduncan-wq/NRIN-demo

This repository contains the **canonical reference implementation of the patient intake UI and behavior**.

Important reference file:

https://github.com/davidduncan-wq/NRIN-demo/blob/main/src/app/patient/page.tsx

Important rule:
NRIN-demo defines intake behavior and UI.
NRIN defines production architecture.

The demo repository should **not be copied directly into the production codebase**.

Instead, the behavior and design should be **ported into NRIN's modular structure**.

---

# 4. Patient Intake Architecture

The intake system currently consists of a **multi-step patient workflow**.
Step1 — Demographics
Step2 — Identity & Address
Step3 — Housing
Step4 — Substances
Step5 — Review & Confirmation
Step6 — Recommendation

These steps exist in the engineering repository under:
src/app/patient/components/

Each step is implemented as an independent modular component.

---

# 5. UI Component System

Reusable UI primitives live in:
src/components/ui

Common components include:
ChoiceButton
CheckIcon
Input
Select
FieldCheck
PhoneInput
DateInput

These primitives are used across intake steps to ensure visual and interaction consistency.

---

# 6. Database Layer

The backend database uses **Supabase**.

Primary data entities include:
patients
referrals
facility_sites
facilities

The system currently creates:
Patient record
Referral record
Facility assignment

Additional routing and evaluation logic will expand this layer.

---

# 7. Facility Routing Model

NRIN will assign treatment facilities through a routing process.

The intended architecture:
Patient Intake
↓
Referral Created
↓
NRIN Routing Engine selects facility_site_id
↓
Facility receives referral
↓
Facility may accept, reject, or reassign

Routing logic will evaluate factors such as:
clinical severity
housing stability
substance profile
geographic constraints
facility capacity

---

# 8. Architectural Principles

The NRIN system follows several guiding principles.

### Modular Architecture

Production code should remain modular and maintainable.

Large monolithic files should be avoided.

---

### Behavioral Parity With Demo

The demo intake flow defines the **expected user behavior and design**.

Production implementation should match demo behavior while preserving modular architecture.

---

### Deterministic Edits

All engineering changes should follow the rules defined in:
NRIN_SURGICAL_EDIT_RULES.md

Changes should be:
small
precise
predictable
reversible

---

# 9. Key Code Areas

The following files are frequently referenced during development:

Patient Intake Controller
src/app/patient/page.tsx

Housing Logic
src/app/patient/components/Step3Housing.tsx

Substances Step
src/app/patient/components/Step4Substances.tsx

Facility Referral Views
src/app/facility/referrals

---

# 10. AI Session Workflow

AI agents working on NRIN should follow this sequence:

1. Read PROJECT_INDEX.md
2. Read CURRENT_HANDOFF.md
3. Read NRIN_SURGICAL_EDIT_RULES.md
4. Review relevant engineering files
5. Perform small deterministic edits

The brain repository exists to maintain **continuity across AI sessions**.

---

# 11. Maintenance Rule

This document should only be updated when:
system architecture changes
major subsystems are added
core repositories change

Session work, bug fixes, and next tasks should **never be recorded here**.

Those belong in:
CURRENT_HANDOFF.md