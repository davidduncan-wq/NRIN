# NRIN ACUITY BOUNDARY DOCTRINE (v1)

## PURPOSE
Define the legal, clinical, and system boundary for how NRIN collects, interprets, and uses patient acuity data.

NRIN does NOT perform clinical assessments.
NRIN performs structured self-reported intake and risk signaling only.

---

## SYSTEM ROLE

NRIN is a:
- self-reported intake system
- risk signal aggregator
- matching + routing engine

NRIN is NOT:
- a diagnostic system
- a clinical decision maker
- a medical authority

---

## LAYER MODEL

### LAYER 1 — PATIENT (NRIN OWNED)
- self-reported answers
- structured intake questions
- narrative + selections

### LAYER 2 — SYSTEM (NRIN OWNED)
- risk scoring
- acuity estimation (non-clinical)
- recommendation framing (non-diagnostic)

### LAYER 3 — FACILITY (EXTERNAL)
- prescreen validation
- clinical assessment
- admission decision

---

## ALLOWED DATA COLLECTION

NRIN may collect:

### Substance Use (self-reported)
- substances used
- frequency
- last use
- route of use

### Withdrawal Indicators (self-reported)
- past withdrawal experience
- current symptoms (as described by patient)

### Medical Signals (self-reported)
- known conditions
- medications
- hospitalizations

### Mental Health Signals (self-reported)
- medications
- prior hospitalization
- emotional distress (self-described)

### Functional / Environmental
- housing stability
- support system
- ability to travel

### Narrative Context
- free text descriptions
- goals
- constraints
- preferences

---

## PROHIBITED DATA USE

NRIN must NOT:

- diagnose any condition
- determine medical necessity
- declare severity as clinical fact
- assign definitive level of care
- replace clinician judgment

---

## OUTPUT RULES

### ALLOWED OUTPUTS

NRIN may output:

- risk bands (low / moderate / high)
- probability-style language
- "based on what you shared"
- "may benefit from"
- "often associated with"

### FORBIDDEN OUTPUTS

NRIN must NOT output:

- "you need detox"
- "you have severe withdrawal"
- "you meet criteria for"
- "this is medically necessary"

---

## LANGUAGE STANDARD

ALL system language must be:

- non-diagnostic
- probabilistic
- suggestive, not declarative

Examples:

GOOD:
- "Based on what you shared, programs with medical support may be helpful."

BAD:
- "You require medical detox."

---

## ACUITY DEFINITION (NRIN)

Patient acuity in NRIN is:

> A NON-CLINICAL ESTIMATION of current instability and risk
> derived solely from self-reported data

It is used for:
- routing priority
- prescreen preparation
- facility matching context

---

## FACILITY ACUITY (SEPARATE CONCEPT)

Facility acuity is:

> The level of severity a facility is equipped to handle

NRIN must NEVER assume:
- facility claims are accurate without validation
- facility acuity equals patient acuity

Matching = intersection of:
- patient need (reported)
- facility capability (declared + inferred)

---

## PRESCREEN ROLE

Prescreen exists to:

- validate patient-reported data
- deepen acuity understanding
- complete missing dimensions
- prepare for admission

Prescreen MAY:
- refine acuity
- escalate or de-escalate risk

---

## ADMISSION ROLE

Admission is the ONLY stage where:

- full clinical assessment occurs
- diagnosis may be made
- treatment plan is created

---

## COMPLIANCE PRINCIPLE

NRIN operates as:

> Decision-support infrastructure — NOT clinical authority

All system design must preserve this boundary.

---

## IMPLEMENTATION RULE

If any feature:
- implies diagnosis
- implies medical authority
- replaces clinician judgment

→ DO NOT BUILD IT

---

## VERSION
v1 — Initial doctrine aligned with ASAM-style intake boundaries and self-reported screening standards

