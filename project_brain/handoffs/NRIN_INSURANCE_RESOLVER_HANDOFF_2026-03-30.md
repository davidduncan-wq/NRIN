# ENGINEERING HANDOFF — NRIN INSURANCE RESOLVER
Date: 2026-03-30

## Scope
This handoff is for the next engineering session.
The next session should NOT continue broad crawler experimentation.
The next session should build a **post-crawl insurance truth resolver** over `facility_intelligence`.

## Why this is the correct next phase
Queue A crawler enrichment v2 succeeded.

Evidence:
- image/logo signal works
- admissions path prioritization works
- verification-flow detection works
- low-confidence/no-signal slice now converts a large percentage of false -> true
- crawler is no longer the bottleneck

Remaining misses are interpretive, not fetch-related.

## Core architecture decision
Separate responsibilities:

### Crawler
Responsible for:
- fetching candidate pages
- extracting evidence
- storing booleans / carriers / signals
- staying narrow and predictable

### Resolver
Responsible for:
- interpreting text and evidence
- promoting private truth when warranted
- respecting exclusion / negation
- reducing false negatives without making crawler more complex

## Current relevant files

### Runner / Queue A
- `scripts/runQueueAHeadless.ts`

### Fetch / crawl
- `src/crawler/fetchPagesHeadless.ts`
- `src/crawler/crawlFacilityHeadless.ts`

### Insurance parsing
- `src/crawler/parseInsurance.ts`

### Intelligence layer target
- `facility_intelligence` table

## Current live insight
A large remaining slice of `accepts_private_insurance_detected = false` appears to contain:
- public/community/VA/county facilities
- Medicaid/Medicare-heavy organizations
- weak-marketing facilities
- some genuine private misses due to interpretive weakness

The resolver must reduce the private misses while preserving the public/community residue.

## Resolver v1 requirements

### 1. Promote private acceptance from implied commercial/private text
If text implies private/commercial insurance acceptance, resolver should set:
- `accepts_private_insurance_detected = true`

Target phrase families:
- most private insurance
- most commercial insurance
- commercial insurance accepted
- most major insurance
- most major insurers
- major insurance plans
- private insurance and Medicaid
- Medicaid, Medicare, and most commercial insurance
- most insurance plans, including Medicaid/Medicare and commercial
- similar patterns

### 2. Respect negation / exclusion
Must NOT incorrectly interpret excluded carriers as accepted.

Examples:
- excluding Medicare and Medicaid
- no Medicaid accepted
- does not accept Medicaid
- not accepted
- does not take
- similar exclusion language

Hazelden-style case is the caution example:
- “in-network with most major insurers (excluding Medicare and Medicaid)”
- resolver must not convert Medicare/Medicaid to positive acceptance from that sentence
- but should still recognize private/commercial acceptance

### 3. Preserve public/community residue
Do NOT force the remaining false bucket into private.
That residue should remain available for:
- public/community classification
- indigent path enrichment
- manual review

## Desired output behavior
After resolver pass:
- more legitimate private sites should flip false -> true
- exclusion/negation should reduce false public positives
- remaining false bucket should become cleaner and more meaningfully public/community-oriented

## Important ranking doctrine
Do NOT let resolver confidence or crawler signal strength directly affect facility ranking.
NRIN ranking must remain about:
- patient fit
- level of care
- geography
- availability (later)
- truth constraints

Insurance truth is a filter/truth problem.
It is NOT a marketing intensity score.

## Data model notes
Observed current state:
- `facility_intelligence.accepts_private_insurance_detected` is binary
- unresolved universe currently lives in `false`, not `null`

Relevant columns on `facility_intelligence`:
- `accepts_private_insurance_detected`
- `can_verify_insurance_online_detected`
- `accepted_insurance_providers_detected`
- `detected_insurance_carriers`
- `accepts_medicaid_detected`
- `accepts_medicare_detected`
- `public_facility_signal`
- `updated_at`
- `confidence_score`

## Recommended implementation shape
Prefer a separate script or resolver layer rather than embedding more logic into the crawler.

Possible implementation candidates:
- `scripts/runInsuranceTruthResolver.ts`
- or `src/lib/resolver/resolveInsuranceTruth.ts`
- or similar

Recommended sequence:
1. query `facility_intelligence` rows where `accepts_private_insurance_detected = false`
2. evaluate carrier/evidence text
3. apply promotion rules for private/commercial acceptance
4. apply exclusion/negation rules
5. persist updated truth fields
6. leave unresolved remainder unchanged

## Session reminder
Do not get sucked back into crawler Groundhog Day.
The win from this session is that crawler is now sufficient.
The leverage now is interpretation.

