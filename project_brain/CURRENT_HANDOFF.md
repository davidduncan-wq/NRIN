# CURRENT HANDOFF — NRIN
Updated: 2026-03-30

## Session outcome
This session successfully stabilized and validated Queue A insurance enrichment v2.

Major result:
- The crawler is no longer the primary blocker.
- The system can now recover private-insurance truth from the previously low-confidence / no-signal bucket.
- The remaining problem is no longer crawler expansion. It is post-crawl truth resolution and classification.

## What was accomplished

### 1. Queue A insurance enrichment runner validated
`scripts/runQueueAHeadless.ts` is now actively processing the low-confidence / unresolved private-insurance universe and persisting results into `facility_intelligence`.

Key current behavior:
- loads Queue A rows
- crawls homepage + prioritized/fallback endpoints
- interprets insurance truth
- persists booleans and carrier results
- prints per-run summary

### 2. Crawler page selection improved
`src/crawler/fetchPagesHeadless.ts` now correctly prioritizes:
- homepage
- `/admissions`
- `/admission`
- `/insurance`
- `/verify-insurance`
- `/check-insurance`
- `/insurance-verification`

This fixed a major prior miss condition where legitimate insurance signal lived on admissions pages and was never fetched.

### 3. Image/logo-based insurance detection added and validated
A major session breakthrough:
- many legitimate facilities do not explicitly list carrier names in parseable text
- instead they show image/logo blocks for payers
- these were previously missed, causing false negatives

The crawler now detects composite insurance image clusters and uses that as a strong acceptance signal.

This solved the core HBFC/Hudson-type problem:
- previously: strong legitimate centers could be classified as false because they were quiet
- now: visual insurance presentation can flip `accepts_private_insurance_detected = true`

This was validated repeatedly with live site checks.

### 4. Verification-flow detection improved
Online verification flow detection now works and is being captured as a high-confidence signal.
Examples included fields / phrases such as:
- insurance verification
- insurance provider
- member ID
- policy ID
- date of birth
- verify your insurance

### 5. Queue A summary telemetry added
`runQueueAHeadless.ts` now prints end-of-run summary:

- processed
- acceptsPrivate
- hasImage
- verifyOnline
- noSignal

This allowed real-time evaluation of distribution and drift.

### 6. Queue A performance results
From repeated runs against the low-confidence/no-private-signal slice:

Representative summary:
- processed: 100
- acceptsPrivate: 66
- hasImage: 66
- verifyOnline: 26
- noSignal: 34

Another representative summary:
- processed: 150
- acceptsPrivate: 80
- hasImage: 80
- verifyOnline: 44
- noSignal: 70

Interpretation:
- the crawler is recovering truth from the hardest slice
- image/logo detection is doing heavy lifting
- verification detection is meaningful and believable
- noSignal remains significant and important, but manageable

### 7. Queue A universe clarified
This session corrected an interpretation mistake:
- `accepts_private_insurance_detected` is effectively binary in `facility_intelligence`
- `null_count = 0`
- unresolved universe lives in the `false` bucket, not `null`

Observed counts:
- website-bearing universe queried: 4752
- true: 2585
- false: 2167
- null: 0

At one measurement point, unresolved Queue A universe was ~2662 false.
Later reduced to ~2167 false.

Meaning:
- approximately ~495 facilities were flipped from false -> true by Queue A work
- crawler is making real progress, not fake progress

### 8. Critical architecture conclusion
Do NOT continue expanding crawler scope right now.

The remaining issue is not:
- page selection
- fetch expansion
- more crawler cleverness

The remaining issue IS:
- post-crawl truth resolution

Specifically:
- some facilities remain `accepts_private_insurance_detected = false`
- while their text implies private/commercial acceptance
- examples include phrases like:
  - “most private insurance”
  - “most commercial insurance”
  - “most major insurers”
  - “most major insurance”

Conversely, exclusion/negation cases also exist:
- “excluding Medicare and Medicaid”
- “No Medicaid accepted”
- “does not accept Medicaid”

Therefore:
- crawler should remain evidence collector
- resolver should interpret evidence after crawl

### 9. Public / indigent path insight
The remaining `false` bucket is not merely crawler failure.
A large portion appears to be:
- public/community/VA/county/state behavioral health
- Medicaid/Medicare-heavy
- weakly marketed but socially important programs
- likely valuable for indigent path enrichment

Important lens:
- no private signal does NOT equal public
- but no private signal should often be viewed through a public/community/indigent-path lens first

### 10. Matching / ranking doctrine reaffirmed
Critical principle reaffirmed this session:
- crawler signal strength must NOT bleed into NRIN ranking
- ranking must not reward loud marketing over actual patient fit
- insurance truth is a filter/truth problem, not a marketing-score problem

HBFC was the core cautionary example:
- false negative on private insurance can eliminate a legit facility before ranking ever begins
- therefore the priority is truth resolution, not crawler confidence scoring

### 11. Batch scaling and runtime envelope
Observed:
- batch sizes like 350 can trigger Playwright launch timeout / throughput ceiling
- 100–150 is stable
- loops can be used to drain Queue A
- current remaining false bucket is still large enough that loops are useful

## Immediate next build
Build a **post-crawl insurance truth resolver** separate from crawler.

That resolver should operate over `facility_intelligence` and do NOT expand crawler scope.

Resolver v1 goals:
1. Promote `accepts_private_insurance_detected = true` when evidence implies private/commercial acceptance, including:
   - most private insurance
   - most commercial insurance
   - most major insurance / insurers
   - private insurance and Medicaid
   - similar phrases
2. Respect exclusion/negation:
   - excluding Medicare and Medicaid
   - no Medicaid accepted
   - does not accept Medicaid
   - similar phrases
3. Leave remaining false-but-alive rows for:
   - public/community classification
   - indigent path enrichment
   - manual review queue

## Critical do-not-do list
- Do NOT re-open crawler scope
- Do NOT let crawler signal strength affect ranking
- Do NOT conflate confidence with truth
- Do NOT assume null-based queue logic; current unresolved universe is false-based
- Do NOT keep trying to make crawler omniscient

## Operational status
Crawler v2 is “good enough to move on.”
Next leverage is resolver + truth layer + public/indigent classification.

