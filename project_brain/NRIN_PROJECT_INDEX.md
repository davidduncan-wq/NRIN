# NRIN — PROJECT INDEX — 2026-03-27 9:00 PM

## Latest control files
- `project_brain/CURRENT_HANDOFF.md`
- `project_brain/NEXT_SESSION_BOOT.md`
- `project_brain/nrin_engineering_handoff.md`
- `project_brain/nrin_next_build_target.md`
- `project_brain/NRIN_COMMAND_CENTER.md`

## Latest dated session docs
- `project_brain/handoffs/NRIN_ENGINEERING_HANDOFF_2026-03-27_2100.md`
- `project_brain/handoffs/NRIN_NEXT_SESSION_BOOT_2026-03-27_2100.md`

## Operations / doctrine files still relevant
- `project_brain/operations/NRIN_CASE_BRIDGE_DOCTRINE.md`
- `project_brain/operations/NRIN_FACILITY_WORKFLOW_DOCTRINE.md`
- `project_brain/operations/NRIN_INTAKE_SCOPE_V1.md`
- `project_brain/operations/NRIN_PRESCREEN_SCOPE_V1.md`
- `project_brain/operations/NRIN_CRISIS_BOUNDARY_RULE.md`
- `project_brain/operations/NRIN_ACUITY_BOUNDARY_DOCTRINE.md`
- `project_brain/operations/NRIN_ACUITY_INPUTS_V1.md`
- `project_brain/operations/NRIN_ACUITY_OUTPUTS_V1.md`
- `project_brain/operations/NRIN_ACUITY_STORAGE_V1.md`

## Current engineering hotspot files
- `src/lib/matching/fetchFacilityMatches.ts`
- `src/lib/matching/scoreConfidence.ts`
- `src/lib/matching/buildPatientProfile.ts`
- `src/app/patient/page.tsx`
- `src/app/patient/matches/page.tsx`
- `src/app/patient/components/Step5LifeFit.tsx`
- `src/app/admin/referrals/page.tsx`

## Important current truth
The dated handoff/boot pair should be treated as canonical for this checkpoint.

---

## Update — 2026-03-30
Current active engineering phase:
- Queue A crawler enrichment v2 completed to “good enough”
- next target is separate post-crawl insurance truth resolver

Key files now central to this phase:
- `scripts/runQueueAHeadless.ts`
- `src/crawler/fetchPagesHeadless.ts`
- `src/crawler/crawlFacilityHeadless.ts`
- future resolver file to be created in next session

