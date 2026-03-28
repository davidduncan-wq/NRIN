# NRIN — NEXT SESSION BOOT — 2026-03-27 9:00 PM

## READ FIRST
You are entering an active system build.
Do not guess.
Do not rewrite working layers.
Do not drift into crawler work.

## REQUIRED IMMEDIATE CONTEXT
Read these first:
1. `project_brain/CURRENT_HANDOFF.md`
2. `project_brain/NEXT_SESSION_BOOT.md`
3. `project_brain/nrin_next_build_target.md`
4. `project_brain/operations/NRIN_CASE_BRIDGE_DOCTRINE.md`
5. `project_brain/operations/NRIN_INTAKE_SCOPE_V1.md`
6. `project_brain/operations/NRIN_PRESCREEN_SCOPE_V1.md`
7. `project_brain/operations/NRIN_CRISIS_BOUNDARY_RULE.md`
8. `project_brain/operations/NRIN_ACUITY_BOUNDARY_DOCTRINE.md`

## CURRENT REALITY
The matcher was successfully upgraded this session:
- patient matcher now pulls the real facility intelligence universe in pages
- `close_to_home` is now a real scored signal using city/state/lat/lng
- facility states were normalized in DB and are now usable
- a global admin referrals page was added

## IMPORTANT TRUTHS
- only `close_to_home` is truly wired
- other environment preferences are still mostly inert
- full-universe matching works but is slow (~18s observed)
- insurance prefilter architecture started but performance work is not complete
- admin referrals page exists
- facility referrals page is still not truly scoped to current facility identity
- referrals were not “lost”; testers often did not complete prescreen because they disliked results

## WHAT NOT TO DO
- do not touch crawler
- do not smear case logic into matching components
- do not claim east/west coast or mountain/desert logic is live unless you wire it
- do not bloat patient pages with matching-query logic that belongs in `src/lib/matching/*`

## PRIMARY NEXT BUILD TARGETS
1. add patient-side “none of these” / refine / manual-search path
2. reduce matcher latency without breaking correctness
3. scope facility inbox correctly
4. polish Step 5 insurance UX only after logic remains stable

## REMINDER
The matcher recommends.
The case tracks journey truth.
Facility workflow handles operational truth.
Keep those layers separate.
