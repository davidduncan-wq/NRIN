# NRIN — ENGINEERING HANDOFF — 2026-04-01 (END OF SESSION)

## Session Outcome

This session produced three major outcomes:

1. **Queue A finished**
2. **Insurance resolver was successfully run with before/after summary instrumentation**
3. **`fetchFacilityMatches.ts` was patched to prefer resolved insurance truth over detected truth**

At the same time, this session also exposed a process failure:

> we edited across layers before fully re-inspecting doctrine / ownership

That must be corrected next session.

---

## What was completed

### 1. Queue A completed
Queue A headless enrichment is no longer the active bottleneck.

### 2. Resolver was instrumented and run with summary
A wrapper script was created:

- `scripts/runInsuranceTruthResolverWithSummary.ts`

Purpose:
- capture BEFORE summary
- run resolver
- capture AFTER summary
- print DELTA summary

### 3. Resolver runner was fixed
`scripts/runInsuranceTruthResolver.ts` was initially only running a sample.
It was corrected to:
- load the full dataset via pagination
- skip already-resolved rows correctly
- write deterministically

### 4. Resolver produced real movement
Most important observed DELTA:

- `resolved_true_total`: **+71**
- `resolved_false_total`: **+107**
- `resolved_null_total`: **-178**
- `recovered_private_from_detected_false`: **+71**
- `confirmed_public_from_detected_false`: **+107**
- `queue_a_resolved`: **+97**
- `queue_a_unresolved`: **-97**

Interpretation:

- resolver is now doing real work
- Queue A evidence is now being converted into usable truth
- unresolved residue remains and is expected
- unresolved residue validates need for facility onboarding / confirmation layer

### 5. Matcher was patched to consume resolved truth
Tracked file changed:

- `src/lib/matching/fetchFacilityMatches.ts`

Current state of that file is now clean and coherent.

Important matcher changes now in place:

#### a. Type/select additions
Added:
- `accepts_private_insurance_resolved`
- `accepted_private_insurance_carriers_resolved`

#### b. Carrier precedence
`acceptedInsurance` now prefers:

1. `accepted_private_insurance_carriers_resolved`
2. `accepted_insurance_providers_detected`
3. `detected_insurance_carriers`
4. `[]`

#### c. Private insurance truth precedence
`acceptsPrivateInsurance` now uses:

1. `accepts_private_insurance_resolved`
2. `accepts_private_insurance_detected`
3. `false`

#### d. Private insurance DB filter
Private insurance query now uses:

- resolved true OR detected true

This is correct and should be kept unless doctrine review explicitly overturns it.

### 6. Facility onboarding doctrine folder was created
Folder created:

- `project_brain/facility_onboarding/`

Files currently created:

- `NRIN_FACILITY_ONBOARDING_INDEX_2026-03-31.md`
- `NRIN_ENVIRONMENT_ONBOARDING_RULE_2026-03-31.md`
- `NRIN_INSURANCE_ONBOARDING_RULE_2026-03-31.md`
- `NRIN_PROGRAM_OFFERINGS_ONBOARDING_RULE_2026-03-31.md`
- `NRIN_MAT_MEDICAL_ONBOARDING_RULE_2026-03-31.md`

These should be preserved.

---

## Important failures / discoveries from this session

### 1. Geo handling is misaligned across layers
Observed issue:
- patient selected “Keep me close to home”
- matcher returned far-away facilities (including Washington in one scenario)

Inspected reality:

In `src/app/patient/page.tsx`, intake submit sends:
- `environmentPreference=close_to_home`

In `src/lib/matching/buildPatientProfile.ts`:
- `refineGeo` is separately read from search params
- `environmentPreference` is separately read
- `closeToHome` is currently derived as:

`refineGeo !== "open"`

This means:
- intake is speaking in `environmentPreference`
- matcher profile logic is partially keyed off `refineGeo`
- those systems are not aligned

This was **inspected**, but NOT safely fixed yet.

### 2. Indigent path is present but not wired as a complete flow
Inspected reality:

- `src/app/patient/indigent-path/page.tsx` exists
- it is currently a simple landing / holding page
- intake submit in `src/app/patient/page.tsx` still unconditionally pushes to:

`/patient/matches?...`

This means indigent users are currently being sent into the normal matcher path.

Observed symptom:
- indigent military scenario produced:
  - no matches
  - Supabase statement timeout
  - matches page error surface

Important caution:
- do NOT blindly patch routing until doctrine / ownership is re-read
- the indigent page exists, but the full indigent system may not yet be implemented

### 3. We broke process discipline
This session included matcher edits before fully re-reading:
- geo doctrine
- indigent / funding doctrine
- routing / case bridge ownership

That is a process failure.

Next session must return to:
- inspect first
- edit second

---

## Current working tree status at end of session

As last inspected:

Tracked modified:
- `scripts/runQueueAHeadless.ts`
- `src/lib/matching/fetchFacilityMatches.ts`

Untracked:
- `project_brain/facility_onboarding/`
- `scripts/debugSandiegoAssets.ts`
- `scripts/runInsuranceTruthResolver.ts`
- `scripts/runInsuranceTruthResolverWithSummary.ts`
- `scripts/testSandiegoAdmissions.ts`
- `src/lib/resolvers/`

Before any commit next session:
- inspect all diffs carefully
- decide which experimental files to keep
- do NOT push blindly

---

## Current architectural truth

### What is now correct
- crawler is no longer the main bottleneck
- Queue A improved insurance evidence
- resolver now converts that evidence into usable truth
- matcher now consumes resolved insurance truth

### What is not yet corrected
- intake → geo/profile alignment
- indigent routing ownership / flow
- matcher performance under broad unfiltered scenarios

---

## Strategic interpretation

The session validated the intended stack:

crawler → Queue A enrichment → resolver → matcher → onboarding closes remaining truth gaps

That is the right architecture.

The remaining unresolved rows are not a failure.
They are the exact justification for:
- facility claims
- facility verified
- NRIN verified

---

## Hard rule for next session

Do NOT patch forward blindly.

Next session must:

1. inspect doctrine / brain files relevant to:
   - geo
   - funding / indigent
   - matcher ownership
   - case / routing ownership

2. inspect the relevant implementation files again

3. only then make surgical fixes

---

## One-line summary

Queue A and resolver are now real; matcher insurance truth improved; geo and indigent failures are confirmed but must be fixed only after doctrine-first inspection.
