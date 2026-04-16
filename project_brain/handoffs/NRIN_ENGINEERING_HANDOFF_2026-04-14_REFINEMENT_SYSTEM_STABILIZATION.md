# NRIN ENGINEERING HANDOFF — 2026-04-14
## REFINEMENT SYSTEM STABILIZATION

---

## SESSION PURPOSE

Stabilize patient refinement layer and align:
- matcher behavior
- UI/UX flow
- semantic system doctrine

---

## CURRENT SYSTEM STATE

### MATCHING
- Core matcher stable
- Environment scoring active (scoreEnvironment.ts)
- Experience scoring added (scoreExperience.ts)
- Refinement params flowing end-to-end:
  - refineGeo
  - refineEnvironment
  - refineExperience

---

### REFINEMENT UI

File:
src/components/patient/PatientRefinementPanel.tsx

State:
- Multi-step guided refinement (step 1–4)
- NOT finalized UX
- Stable enough to freeze

Known issues:
- selection clarity (no checkmarks)
- color misuse (stone used as selected)
- language still partially legacy
- interaction model still semi-control-panel

---

## CRITICAL DOCTRINE CLARIFICATIONS (NEW)

### 1. GEO vs ENVIRONMENT vs EXPERIENCE

These are NOT the same:

- GEO (hard constraint)
  → proximity / radius / travel willingness

- ENVIRONMENT (tradeoff layer)
  → mountain / desert / coastal

- EXPERIENCE (soft preference)
  → yoga / luxury / faith / etc.

These MUST remain separated across:
- intake
- refinement
- matcher

---

### 2. REFINEMENT IS NOT ERROR CORRECTION

Old model:
"something feels off"

New model:
"we found strong matches → refine toward preference"

This is a fundamental UX shift.

---

### 3. COLOR SYSTEM (LOCK THIS)

- BLUE = patient choice / active selection
- INDIGO = facility identity
- STONE = negative / muted / caution state

STONE MUST NEVER BE USED AS ACTIVE SELECTION

---

## WHAT IS COMPLETE

- refinement parameter wiring
- environment scoring
- experience scoring
- refinement → matcher connection
- refinement UI scaffold

---

## WHAT IS NOT COMPLETE

### UI / UX
- proper selection states (checkmarks vs removal)
- visual hierarchy consistency
- mobile optimization refinement
- guided questioning (one-at-a-time flow)

### SYSTEM
- VA route
- indigent route
- alumni layer
- facility-side parity

---

## KNOWN RISKS

- UI drift from doctrine
- mixing environment vs geo again
- overloading refinement panel
- losing conversational flow

---

## NEXT BUILD PRIORITIES

1. Stabilize refinement UX model (guided vs panel)
2. Implement true selection state system
3. Lock color system across components
4. Begin VA routing system

---

## FINAL NOTE

This session was not about features.

It was about:
- separating concepts
- correcting mental model
- preventing future system collapse

