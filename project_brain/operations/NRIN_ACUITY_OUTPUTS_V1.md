# NRIN ACUITY OUTPUTS (v1)

## PURPOSE
Define the non-clinical output structure produced from NRIN self-reported acuity inputs.

These outputs support:
- routing priority
- matcher context
- prescreen preparation

They do NOT constitute diagnosis or medical necessity.

---

## OUTPUT SHAPE

### DIMENSION SCORES

Each core dimension may produce:

- 0 = no current signal
- 1 = mild signal
- 2 = moderate signal
- 3 = significant signal
- 4 = urgent / severe signal

V1 dimensions:
- withdrawalSeverity
- psychiatricSeverity
- biomedicalSeverity

---

## SUMMARY FLAGS

Boolean flags may be derived for workflow use:

- urgentWithdrawalNeed
- urgentPsychNeed
- urgentMedicalNeed

These are workflow escalation signals only.

---

## OVERALL ACUITY BAND

The system may assign one of:

- low
- moderate
- high
- critical

### Intended meaning

#### low
No strong immediate instability signal based on self-report

#### moderate
Meaningful support or structure likely needed

#### high
Substantial instability or elevated withdrawal / psychiatric / biomedical concern

#### critical
Immediate escalation signal; requires rapid human review

---

## RATIONALE

Each output should preserve simple rationale strings such as:

- "Recent daily alcohol use with withdrawal history"
- "Psychiatric hospitalization reported"
- "Housing instability increases lower-level risk"

These support:
- transparency
- facility review
- future auditing

---

## FORBIDDEN OUTPUT INTERPRETATION

These outputs must NOT be presented as:

- diagnosis
- medical clearance
- clinical severity determination
- definitive placement order

---

## UI LANGUAGE RULE

User-facing language must remain:

- probabilistic
- self-report based
- non-diagnostic

Examples:

GOOD:
- "Based on what you shared, added medical support may be worth confirming."

BAD:
- "You are high acuity and require detox."

---

## DOWNSTREAM USE

These outputs may be used for:

- routing priority
- queue ordering
- prescreen depth
- facility fit context

They may NOT independently authorize admission decisions.

---

## VERSION
v1 — non-clinical acuity output contract

