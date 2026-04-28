# NRIN NEXT BUILD — 2026-04-28

## PRIMARY NEXT BUILD OPTIONS

## Option A — Previous Matches Recovery
Problem:
After resume, patient is returned to Step 5, but there is no clear path to see the matches already generated.

Build:
- Query match_sessions by caseId
- Add UI affordance:
  "See previous matches"
- Route to /patient/matches with preserved params or a match-session reconstruction path.

## Option B — Admin Command Center
Problem:
Admin surfaces are fragmented.

Build:
- /admin landing page
- cards for:
  - Cases
  - Referrals
  - Facilities
  - System health
  - Test mode status

## Option C — External DB Migration Inspection
Problem:
A separate facility DB was created by another method and may be better/more efficient than crawler output.

Build:
- Inspect schema and sample rows.
- Compare to NRIN canonical tables:
  - facility_sites
  - facility_intelligence
  - facility_classification
  - facility_crawl_results
  - facility_identity / Queue E if relevant
- Create migration doctrine before importing anything.

## DO NOT DO

- Do not replace facility_site_id with facility_code.
- Do not erase insurance fields on resume.
- Do not make patient return flow serve org/provider/court multi-case workflows.
- Do not merge external DB into production until schema and provenance are understood.
