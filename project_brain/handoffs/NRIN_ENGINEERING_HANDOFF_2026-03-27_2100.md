# NRIN — ENGINEERING HANDOFF — 2026-03-27 9:00 PM

## Session outcome
This session materially advanced the patient-side matcher from a partially static recommendation layer into a real, geography-aware matching engine operating over the full facility intelligence universe instead of a tiny capped subset.

## Major wins completed

### 1. Matcher universe fixed
The patient matcher was still capped inside `src/lib/matching/fetchFacilityMatches.ts`.
That cap was removed and replaced with paged retrieval.
The matcher is now pulling the real facility intelligence universe instead of a tiny biased subset.

Observed result:
- previous match pool: 200
- expanded live pool observed: ~4752

Important:
- this fixed the false “Trinity in Whittier always wins” problem.
- this was a real matcher-universe bug, not a scoring bug.

### 2. Geography / close-to-home matching is now real
The system now supports a real `close_to_home` preference path:
- patient city/state/lat/lng propagate into the matcher
- facility city/state/lat/lng propagate into the matcher
- scoring now boosts:
  - same city
  - same state
  - distance by haversine thresholds

Observed proof:
- New York / Kentucky tests returned local-state/local-region facilities instead of California defaults.

Important:
- only `close_to_home` is truly wired right now.
- other environment preferences remain mostly inert until further logic is added.

### 3. Facility state normalization fixed at DB layer
`facility_sites.state` was added and normalized.
The state field is now clean 2-letter abbreviations plus acceptable nulls / territory codes.
This removed repeated parsing bugs and unlocked stable geography logic.

### 4. Step 5 life-fit / insurance flow improved materially
Step 5 now has working progressive logic for insurance capture.
Current logic now supports:
- Do you have insurance?
- insurance type
- conditional carrier entry
- add-now / add-later concept
- self-pay branch

Important:
- logic is now functionally working
- UX / visual polish is still needed
- stale field reset behavior should still be reviewed in future polish pass

### 5. Admin referrals visibility added
A global admin view was created:
- `src/app/admin/referrals/page.tsx`

This was added after confusion around “missing referrals.”
Major realization:
- patient rows were still being inserted into DB
- referrals were not “missing because Supabase broke”
- the tester simply was not proceeding to successful prescreen confirmation in many cases
- additionally, facility referrals page is not yet truly scoped to current facility identity

### 6. Important conceptual clarification
NRIN currently has:
- patient-side recommendation flow
- facility-side referral/workflow view
- new admin/global referrals control view

What it still lacks:
- true NRIN admin operating surface beyond the new referral list
- true facility auth-based scoping for facility inbox
- a patient “none of these / refine / manual search” loop after rejecting matches

## Important truths learned

### A. Only close_to_home is real right now
Current preference behavior:
- `close_to_home` = live, real, scored
- `east_coast`, `west_coast`, `mountains`, `desert`, `island`, `urban` = captured but not meaningfully scored yet

Do NOT misrepresent those as working geography filters yet.

### B. Full-universe matching is correct but still slow
Observed render:
- ~18.8 seconds on full-universe geography-aware runs

This is acceptable as a proof-of-correctness checkpoint but not acceptable as final product performance.

### C. Insurance prefilter work began but is not yet validated as final
A clean options-style prefilter hook was added to `fetchFacilityMatchingInputs`.
This is the right boundary.
However, performance optimization remains incomplete and should be treated as next-build work, not declared solved.

### D. Referral creation path is still present
The prescreen page still:
- updates case
- inserts referral
- routes to confirmation

Recent missing-referral confusion appears to have been caused primarily by testers rejecting matches before reaching successful prescreen completion, not by a dead insert path.

## Files materially touched this session
- `src/lib/matching/fetchFacilityMatches.ts`
- `src/lib/matching/types.ts`
- `src/lib/matching/buildPatientProfile.ts`
- `src/lib/matching/scoreConfidence.ts`
- `src/app/patient/page.tsx`
- `src/app/patient/matches/page.tsx`
- `src/app/patient/components/Step5LifeFit.tsx`
- `src/app/admin/referrals/page.tsx`

## Current product state after this session

### Working
- full-universe patient matcher
- geography-aware `close_to_home`
- patient location propagation into matcher
- facility location propagation into matcher
- normalized facility state field
- global admin referrals visibility
- Step 5 insurance logic functioning at baseline

### Not complete
- performance optimization
- insurer prefilter tuning / fallback behavior
- facility inbox scoping by current facility identity
- “none of these feel right” branch on patient matches
- environment preferences beyond `close_to_home`
- Step 5 UX polish / reset polish / scan/manual buildout
- OCR insurance-card flow

## Highest-value next work
1. performance: reduce full-universe match latency
2. add patient-side “none of these” / refine / manual-search loop
3. scope facility referrals page to actual facility context
4. make east/west coast and other environment preferences real or remove implied effect
5. tighten Step 5 insurance UX and optional capture depth

## Strong recommendation for next session
Do NOT return to crawler.
Do NOT broaden architecture.
Stay focused on:
- matcher performance
- patient refinement loop
- facility/admin visibility
