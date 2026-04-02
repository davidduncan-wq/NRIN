# NRIN — NEXT SESSION BOOT — 2026-04-01

## Read this first

This session ended after:
- Queue A completion
- resolver instrumentation + full run
- matcher insurance patch
- discovery of geo drift and indigent flow ambiguity

The next session must begin by re-establishing discipline.

---

## Absolute rules

1. **Inspect before editing**
2. Do not patch cross-layer behavior from grep alone
3. Respect design / logic bifurcation
4. Matcher owns recommendation truth
5. Case / facility workflow / indigent handling are separate layers

---

## First files to read

### Session handoff
- `project_brain/handoffs/NRIN_ENGINEERING_HANDOFF_2026-04-01_END_OF_SESSION.md`

### Facility onboarding doctrine created this session
- `project_brain/facility_onboarding/NRIN_FACILITY_ONBOARDING_INDEX_2026-03-31.md`
- `project_brain/facility_onboarding/NRIN_ENVIRONMENT_ONBOARDING_RULE_2026-03-31.md`
- `project_brain/facility_onboarding/NRIN_INSURANCE_ONBOARDING_RULE_2026-03-31.md`
- `project_brain/facility_onboarding/NRIN_PROGRAM_OFFERINGS_ONBOARDING_RULE_2026-03-31.md`
- `project_brain/facility_onboarding/NRIN_MAT_MEDICAL_ONBOARDING_RULE_2026-03-31.md`

### Matcher doctrine / philosophy
- matching doctrine
- match performance note
- patient refinement loop note
- needs / wants / offerings doctrine
- match presentation doctrine
- any geo / location / funding / case bridge doctrine files available

---

## First implementation files to inspect

- `src/app/patient/page.tsx`
- `src/lib/matching/buildPatientProfile.ts`
- `src/app/patient/indigent-path/page.tsx`
- `src/app/patient/matches/page.tsx`
- `src/lib/matching/fetchFacilityMatches.ts`

---

## Current known truths

### Completed
- Queue A complete
- resolver working
- matcher now prefers resolved insurance truth

### Not yet resolved
- “close_to_home” / geo alignment
- indigent routing and ownership
- timeout behavior in broad-match scenarios

---

## First question for next session

Before any code edit:

> What is the correct doctrinal ownership of:
- geo refinement
- indigent fork
- patient intake submit routing
- matcher prefiltering

---

## Immediate caution

The current `fetchFacilityMatches.ts` patch appears coherent and should not be reverted casually.
Geo and indigent issues are separate from resolver integration.

---

## One-line boot

Resolver and insurance truth are in better shape than before; next session is about re-aligning intake → profile → matcher → routing without breaking doctrine.
