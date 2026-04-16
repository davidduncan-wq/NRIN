# CURRENT HANDOFF — 2026-04-02

Read this first, then read the detailed handoff:

- `project_brain/handoffs/NRIN_ENGINEERING_HANDOFF_2026-04-02_END_OF_SESSION.md`

Then read these doctrine files:

- `project_brain/facility_onboarding/NRIN_FACILITY_ONBOARDING_VERIFICATION_MODEL_2026-04-02.md`
- `project_brain/facility_onboarding/NRIN_VERIFICATION_PROVENANCE_MODEL_2026-04-02.md`
- `project_brain/facility_onboarding/NRIN_FACILITY_PORTAL_BOUNDARY_2026-04-02.md`
- `project_brain/operations/NRIN_QUEUE_B_QUEUE_C_DOCTRINE_2026-04-02.md`

## Immediate reality

The session ended with:
- Queue C internal verification working locally
- local production build eventually passing
- Vercel deploy eventually succeeding at least once
- user reporting the live demo is not working
- browser instability preventing further validation

## Immediate next task

Do NOT assume the demo is good.

First task next session:
- validate the live public demo
- identify which routes are safe to show
- identify which routes were disabled from build and are not demo-safe

## Core routes to inspect first

Likely usable:
- `/patient`
- `/patient/matches`
- `/patient/confirmation`
- `/facility/dashboard`

Potentially disabled / unstable:
- `/patient/prescreen`
- `/facility/portal`

