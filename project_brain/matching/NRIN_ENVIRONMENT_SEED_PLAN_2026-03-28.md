# NRIN — ENVIRONMENT SEED PLAN — 2026-03-28

## Purpose

Define the first environment-classification phase for NRIN using existing facility location data before rebuilding the crawler.

This phase is intended to create:
- objective environment truth
- canonical vocabulary for environment / region preferences
- a bridge from intake preferences to matcher-usable signals
- a foundation for later reporting and crawler 2.0 enrichment

---

## Strategic Decision

NRIN should NOT begin environment handling by re-crawling the web.

Phase 1 should instead exploit existing facility data already present in the system:
- facility latitude / longitude
- city / state
- existing matcher-facing facility corpus
- existing patient environment preference strings

Crawler 2.0 should come AFTER:
1. environment ontology is defined
2. objective environment layer exists
3. matcher can already consume canonical environment signals

---

## Core Principle

Environment matching should be built in two layers:

### Layer 1 — Objective Environment Truth
Derived from:
- latitude / longitude
- region
- distance
- topography / biome proxies
- density / urbanicity proxies

This layer should be considered primary for matching.

### Layer 2 — Website / Marketing Environment Language
Derived later from crawler 2.0:
- “beachfront”
- “mountain retreat”
- “private estate”
- “quiet campus”
- “faith-based”
- “LGBTQ-affirming”
- “executive program”
- other brochure-style setting signals

This layer should be secondary / enriching, not primary truth.

---

## Why Phase 1 Comes First

Crawler 1.0 already gives enough location truth to seed environment classification.

This allows NRIN to:
- improve matching now
- avoid waiting on crawler rebuild
- avoid schema drift from unstructured website adjectives
- create a canonical target schema for crawler 2.0

---

## Initial Environment Model

Environment should be split into multiple dimensions.

### 1. Region
Examples:
- west_coast
- east_coast
- pacific_northwest
- southwest
- midwest
- northeast
- southeast
- southern_california

Status:
- scoreable early
- derived from state groups / geography

### 2. Distance / Proximity
Examples:
- close_to_home
- open_to_travel
- nearby
- same_state
- same_metro (future)

Status:
- scoreable now
- derived from patient lat/lng + facility lat/lng

### 3. Objective Setting / Terrain
Examples:
- coastal
- desert
- mountain
- forest
- valley
- plains (future)

Status:
- partially scoreable after environment seed phase
- should be derived from location-based classification, not website adjectives alone

### 4. Density / Urbanicity
Examples:
- urban
- suburban
- rural

Status:
- useful but may require separate enrichment logic or proxy rules
- should not be guessed casually

### 5. Subjective / Marketing Setting
Examples:
- quiet
- luxury
- private
- retreat
- resort-like
- campus-like

Status:
- crawler 2.0 / enrichment phase
- not objective truth

---

## Canonical Rule

NRIN must distinguish between:

### Objective environment truth
what the location actually is

and

### Subjective environment language
how the facility describes itself

Do not collapse these into one field.

---

## Immediate Engineering Finding (Verified)

The current system already carries patient environment preference strings into the matcher-facing profile.

However, preference strings such as:
- west_coast

are currently preserved as strings but are NOT yet operationalized in scoring.

Also verified:
- current facility retrieval is pulling the full available facility corpus (not a hidden tiny slice)
- current close-to-home scoring logic is narrower than the product now requires
- scoreConfidence currently contains duplicated distance bonus logic in the close_to_home branch and should be corrected later

This means the current problem is not primarily crawler coverage.
It is ontology + scoring translation.

---

## Phase 1 Deliverables

### A. Canonical vocabulary
Define allowed values for:
- region preferences
- distance preferences
- objective terrain/setting values
- density values
- future subjective setting values

### B. Seed classifier
Using existing facility location data, produce initial facility-side environment attributes.

Potential outputs:
- region
- coastal_flag
- desert_flag
- mountain_flag
- distance_band support
- density placeholder / unknown where unsupported

### C. Matcher bridge
Teach scoring layer to interpret canonical patient preferences using the seed classifier.

### D. Reporting seed
Ensure environment preference and environment match context can later be logged in recommendation sessions and outcome reporting.

---

## Suggested Data Strategy

### Use existing data first
Input sources already available:
- facility_sites latitude / longitude
- city / state
- existing matching payload

### Add computed facility environment fields
Preferred approach:
- computed / normalized environment attributes at DB layer or enrichment script layer
- not embedded as ad hoc string logic scattered across matcher code

### Preserve unsupported values
If a preference exists but cannot yet be scored reliably:
- store it
- do not fake scoring
- mark as captured_only until support exists

---

## Crawler 2.0 Role

Crawler 2.0 should come after environment vocabulary exists.

Its job should be to enrich:
- subjective setting language
- deeper site navigation surfaces (headless / hamburger aware)
- faith-based signals
- LGBTQ / trans policy signals
- facility cultural / program identity
- additional setting claims not recoverable from location data alone

Crawler 2.0 should map findings INTO the canonical schema, not invent the schema on the fly.

---

## Current Recommendation

Do not patch west_coast alone.

First:
1. define canonical environment vocabulary
2. seed objective environment classification from existing location data
3. then wire scoring
4. only then expand crawler

This preserves architectural clarity.

---

## One-Line Summary

Environment matching should begin by deriving objective environment truth from existing facility location data, then later be enriched by crawler 2.0’s subjective/marketing setting signals.

