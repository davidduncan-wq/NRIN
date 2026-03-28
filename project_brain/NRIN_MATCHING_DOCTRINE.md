# nrin — MATCHING DOCTRINE

## Purpose

This document defines the role of the matching engine inside nrin.

The matcher is responsible for recommendation truth.
It is not the case layer.
It is not the facility workflow layer.
It is not the referral exchange layer.

---

## Core Principle

The matching engine is the primary authority for recommendation quality.

It determines best-fit treatment options based on:
- patient needs
- verified facility capabilities
- financial plausibility
- contextual support factors

---

## Matching Is Not Referral Exchange

nrin recommendation output should be described as:

- recommendation
- recommended facility
- recommended options

Do not use "referral" as the generic label for system recommendation output.

"Referral exchange" is a distinct facility-to-facility transfer concept and belongs to a different layer.

---

## Ranking Layers

1. hard filters
2. clinical / viability fit
3. financial plausibility
4. specialty / support fit
5. future preference tie-breakers

---

## Product Rule

The matcher recommends.
It does not admit.
It does not disposition.
It does not control facility workflow.

Once a patient selects a facility and facility-side handling begins, the system moves from:
- recommendation truth

into:
- case truth
- facility workflow truth

---

## Current Doctrine

- recommendation output must stay distinct from case status
- case status must stay distinct from facility workflow status
- facility workflow status must stay distinct from referral exchange behavior

---

## Referral Exchange Reminder

Facilities may later recommend / pass a patient to another facility.
That does not invalidate the matcher.
It means the system is moving from recommendation into exchange-aware operational reality.

---

## Design Reminder

nrin may use crawler- or asset-derived facility brand colors as restrained accents in recommendation and brochure surfaces, while preserving nrin typography, layout, readability, and design-system control.

