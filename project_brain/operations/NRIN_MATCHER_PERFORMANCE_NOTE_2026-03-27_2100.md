# NRIN — MATCHER PERFORMANCE NOTE — 2026-03-27 9:00 PM

## Current state
The matcher now works against the real facility intelligence universe and produces correct geography-aware results for `close_to_home`, but observed runtime is too slow for production (~18s observed).

## Why this happened
Correctness was restored first:
- full-universe retrieval replaced capped biased retrieval
- city/state/lat/lng signals were propagated
- scoring now uses geography

## Likely next fixes
- insurer-aware DB-side prefilter tuning
- state-aware prefiltering
- radius-aware prefiltering
- caching facility intelligence retrieval
- later: more specialized geographic query strategy

## Important rule
Do not optimize by reintroducing a biased tiny candidate pool.
Correctness first. Then optimize.
