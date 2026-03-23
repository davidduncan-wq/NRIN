# NRIN — NEGATIVE FIT SIGNAL DOCTRINE

## Purpose

This document defines how NRIN should represent important mismatches, missing requirements, and non-recommended options in patient-facing recommendation surfaces.

NRIN should not only show why a facility fits.
NRIN should also be willing to show why a facility does not fit.

This is a trust feature.

It prevents the system from feeling like it is selling every option equally and helps the patient understand why a preferred or familiar facility may not actually be the right recommendation.

---

## Core Principle

NRIN should be willing to say:

- this fits because of these reasons
- this does not fit because of these missing requirements

The system should not oversell.
It should discriminate honestly.

---

## Signal Types

### Positive signal
Meaning:
- this facility meets an important need, preference, or practical requirement

Visual role:
- check
- supportive / confirming
- used primarily on the main recommended option

Examples:
- Detox available
- Insurance accepted
- MAT available
- Family support available

---

### Negative signal
Meaning:
- this facility is missing something important
- or it conflicts with a meaningful clinical, logistical, or life-fit requirement

Visual role:
- red X or equivalent negative indicator
- cautionary but calm
- used especially on secondary, user-requested, or non-recommended options

Examples:
- Detox not available
- MAT not available
- Family program not available
- Insurance not confirmed
- Not aligned with required level of care

---

## Product Rule

NRIN should not use negative fit signals to scare or coerce.
They should be presented as clear informational reasons, not sales pressure.

The tone should be:

- calm
- honest
- selective
- clinically grounded
- non-defensive

Not:

- alarmist
- manipulative
- pushy
- argumentative

---

## Where Negative Signals Matter Most

Negative fit signals are especially important when:

- the patient asks to see more treatment centers
- the patient prefers a destination or geography that conflicts with care needs
- the patient wants a place a friend attended
- a facility looks attractive but is missing a key support
- a facility declines the patient and recommends another facility
- a secondary option is shown for comparison

---

## Main Recommendation vs Alternative Option Rule

### Main recommended option
Default behavior:
- show positive signals only
- keep the surface clean and confident

Use negative signals on the main recommendation only when a caveat is truly important and needs to be disclosed.

### Alternative or user-requested option
Default behavior:
- show both positive and negative signals when useful
- make the important gaps visible

This is where negative fit signals are most valuable.

---

## Example Use Cases

### Hawaii example
The patient wants a facility in Hawaii.
However, the available option does not offer detox or MAT.

NRIN should be able to show:

- Detox not available
- MAT not available

This lets the patient understand why the option is not recommended, without the system sounding defensive or salesy.

### Los Angeles example
The patient wants Los Angeles, but reunification with children is important and the option lacks family programming.

NRIN should be able to show:

- Family program not available

This makes clear why the option may not support the patient’s stated goals.

---

## Recommended Framing for Non-Recommended Options

Preferred labels:

- Important gaps to consider
- Why this may not be the right fit
- Not our recommendation

Use the gentlest wording that preserves honesty.

"Important gaps to consider" is usually the best default.

---

## Architecture Rule

Negative fit signaling should remain bifurcated like the rest of the recommendation system.

### Matching / scoring layer
Canonical truth about:
- required needs
- missing supports
- failed fit criteria

### View-model layer
Transforms those misses into:
- patient-facing negative signals
- short explanatory language

### UI layer
Renders those signals with a distinct visual treatment from positive signals.

### Feature composition layer
Decides when to show:
- positive-only recommendation surfaces
- mixed positive/negative comparison surfaces

---

## Future UI Rule

The UI should support at least two signal variants:

- positive
- negative

Examples:
- positive = check
- negative = X

These should remain visually distinct from:
- user choice / completion checks
- system-positive recommendation signals
- system-negative fit signals

This distinction is important because:

- user action is not the same as system assertion
- positive fit is not the same as missing requirement

---

## Strategic Reminder

NRIN builds trust not only by recommending well, but by refusing poorly.

A high-trust recommendation system should be able to say:

- this is why we recommend this option
- this is why we do not recommend that option

That is a core part of the product’s credibility.
