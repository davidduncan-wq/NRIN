# NRIN — QUEUE B CLINICAL V1 REPORT — 2026-04-06

## Purpose

Record the first working Queue B clinical-truth reconciliation pass.

Queue B exists to identify facilities where:

- structured truth in `facility_intelligence` is false or null
- but raw crawl language suggests the capability may actually exist

This is a review queue, not an auto-writeback system.

---

## Scope

Clinical-only v1.

Signals included:

- DETOX
- RESIDENTIAL
- PHP
- IOP
- DUAL_DX
- MAT

Signals intentionally excluded from Queue B v1:

- lifestyle / experience
- LGBTQ / trans support
- alumni narrative
- marketing / brochure language

---

## Current Architecture

### Evidence source
- `facility_crawl_results.raw_result.pages[*].rawHtml`

### Entity bridge
- `facility_crawl_results.facility_seed_id`
- `facility_seeds.id`
- `facility_seeds.facility_site_id`

### Truth source
- `facility_intelligence`

### Structured truth fields used
- `offers_detox`
- `offers_residential`
- `offers_php`
- `offers_iop`
- `dual_diagnosis_support`
- `mat_supported`

---

## Clinical Vocabulary Used

### DETOX
- detox
- detoxification
- medical detox
- withdrawal management

### RESIDENTIAL
- residential treatment
- residential rehab
- inpatient residential
- inpatient rehab
- rehab program
- inpatient treatment

### PHP
- partial hospitalization program
- day treatment

### IOP
- intensive outpatient program

### DUAL_DX
- dual diagnosis
- co-occurring disorders
- co-occurring

### MAT
- medication-assisted treatment
- suboxone
- buprenorphine
- methadone
- subutex
- naltrexone

---

## Sampling / Performance Notes

### Stable run configuration
- crawl fetch limit: `250`
- crawl fetch batch size: `10`

### Why
Earlier broader / heavier versions timed out.
The current two-phase fetch strategy is stable:

1. fetch bounded crawl rows
2. fetch seed → site map separately
3. fetch truth rows separately
4. compare locally

---

## First Stable Result

### Run status
- Queue B script working
- stable bounded run
- JSON artifact written to `tmp/queue_b_clinical_v1.json`

### Counts
- crawlRows: 250
- seedToSiteMap: 250
- truthRows: 1000
- total candidates: 9

### Review tiers
- high: 1
- medium: 8

---

## Tier Logic (v1)

### High
Used where phrase is very strong / near-explicit.

Examples:
- `medical detox`
- `partial hospitalization program`
- `intensive outpatient program`
- `medication-assisted treatment`
- `suboxone`
- `buprenorphine`
- `methadone`
- `subutex`
- `naltrexone`
- `dual diagnosis`
- `co-occurring disorders`

### Medium
Used where phrase is valid in NRIN ontology but still benefits from human review.

Examples:
- `detox`
- `detoxification`
- `day treatment`
- `inpatient treatment`
- `residential treatment`

---

## Current Candidate Snapshot

### PHP candidates
Multiple facilities surfaced where:
- `offers_php = false`
- supporting phrase = `day treatment`

Interpretation:
- In NRIN ontology, `day treatment = PHP`
- this appears to be a real synonym normalization gap

### DETOX candidates
Multiple facilities surfaced where:
- `offers_detox = false`
- supporting phrases included:
  - `detox`
  - `detoxification`
  - `medical detox`

Interpretation:
- strong evidence of possible missed DETOX truth
- especially when `medical detox` appears

### RESIDENTIAL candidate
At least one facility surfaced where:
- `offers_residential = false`
- supporting phrase = `inpatient treatment`

Interpretation:
- valid candidate
- still medium review tier in v1

---

## Important Doctrine Decisions Locked During This Work

### 1. NRIN ontology governs phrase meaning
Queue B does not use generic internet semantics.
It uses NRIN system meaning.

Examples:
- `day treatment = PHP`
- `residential treatment / inpatient treatment = RESIDENTIAL`
- `detox = DETOX` within the curated NRIN facility universe
- MAT includes:
  - medication-assisted treatment
  - suboxone
  - buprenorphine
  - methadone
  - subutex
  - naltrexone

### 2. Detox is presumed valid in NRIN universe
Because the facility set is curated SUD / treatment-centered,
plain `detox` is treated as a valid default DETOX signal unless evidence later proves otherwise.

### 3. Queue B is review-first
Queue B v1 does not auto-write back to `facility_intelligence`.

It produces:
- candidate list
- review tiers
- supporting phrases

---

## What This Proves

Queue B clinical-only v1 is now:

- technically functional
- ontology-aligned
- bounded enough to run reliably
- precise enough to produce believable candidates
- capable of surfacing likely structured-truth misses

This is the first working clinical reconciliation queue.

---

## Immediate Next Best Improvements

### 1. Add evidence snippets
For each candidate, capture a short text snippet around the supporting phrase.

Why:
- speeds human review
- increases trust
- reduces need to reopen raw HTML manually

### 2. Scale carefully
Increase from:
- 250 → 500

Only after snippet support is added or performance remains stable.

### 3. Expand vocab selectively
Only when data justifies it.

Near-term likely expansions:
- aftercare / continuing care / alumni (but not inside clinical Queue B unless explicitly mapped to structured truth)
- stronger DUAL_DX phrasing
- stronger residential synonym handling

### 4. Consider future writeback rules
Only after:
- enough reviewed candidates
- false-positive rate is known
- confidence rules are defensible

---

## Not Part of Queue B v1

These were discussed but are separate layers:

- alumni continuity / alumni narrative
- facility CRM alumni tools
- LGBTQ / trans support
- lifestyle / environment
- brochure narrative

Those belong to other queues / layers and must not contaminate clinical truth reconciliation.

---

## One-Line Summary

Queue B clinical-only v1 now produces a small, believable review queue of likely missed DETOX / PHP / RESIDENTIAL truth by reconciling raw crawl language against current `facility_intelligence`.
