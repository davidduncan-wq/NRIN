# NRIN — MATCH PERFORMANCE NOTE — 2026-03-28

## Current State

Observed runtime for match render:

- ~18–21 seconds per request
- includes:
  - full facility universe retrieval (~4700+ facilities)
  - scoring pipeline
  - view model build
  - NOW: match_sessions DB insert

System is currently:
→ correctness-first
→ not production-performant yet

---

## Why This Is Acceptable (for now)

Recent changes intentionally prioritized:

- removal of biased small candidate pool
- restoration of full-universe matching
- correct geographic handling
- refinement loop integration
- match session persistence (DB logging)

This establishes:
→ recommendation integrity
→ behavioral data capture
→ system learning foundation

---

## Known Risks

- UI feels slow / heavy (~20s)
- refinement loop multiplies latency
- DB insert now adds slight additional overhead
- user perception risk if not addressed before production

---

## Future Optimization Directions (DO NOT IMPLEMENT YET)

1. DB-side prefiltering
   - insurance-aware filtering
   - state / radius constraints
   - reduce candidate set BEFORE scoring

2. Facility input caching
   - cache facility intelligence payload
   - avoid repeated large fetch

3. Async match session logging
   - decouple DB insert from request path

4. Incremental / streaming match rendering (later)

---

## Critical Rule

DO NOT:
- reintroduce small biased candidate pools
- sacrifice match correctness for speed

Correctness → then optimization

---

## Strategic Insight

System is transitioning from:

"fast demo matcher"

to:

"accurate, learnable placement system"

Performance work must preserve:
→ recommendation truth
→ refinement loop integrity
→ data capture fidelity

---

## Status

Logged as known issue.
No action required in current build phase.

Next phase will include dedicated performance optimization pass.

