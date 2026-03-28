# NRIN ACUITY INPUTS (v1)

## PURPOSE
Define the minimal, legally safe, self-reported inputs used to estimate patient acuity.

This is NOT full ASAM.
This is a curated subset for early-stage intake.

---

## CORE DIMENSIONS (V1)

### 1. WITHDRAWAL RISK (PRIMARY)

Inputs:
- substances used
- frequency (daily / frequent / occasional)
- last use (today → 30+ days)
- history of withdrawal (yes/no)
- severe withdrawal history (yes/no)
- current symptoms (yes/no)

Goal:
Detect likelihood of medically significant withdrawal

---

### 2. PSYCHIATRIC / BEHAVIORAL RISK

Inputs:
- mental health medications (yes/no)
- prior psychiatric hospitalization (yes/no)
- self-described emotional distress (future expansion)

Goal:
Detect instability requiring structured environment

---

### 3. BIOMEDICAL / GENERAL HEALTH (LIGHT V1)

Inputs:
- major medical conditions (self-reported)
- medications (self-reported)
- recent hospitalizations (future expansion)

Goal:
Flag potential medical complexity

---

### 4. ENVIRONMENT / SUPPORT

Inputs:
- housing stability (yes/no)
- supportive person (yes/no/unknown)

Goal:
Determine safety of lower levels of care

---

## EXCLUDED (FOR NOW)

DO NOT INCLUDE YET:

- legal history scoring
- trauma depth
- family system complexity scoring
- employment scoring beyond simple signals

These belong in:
- LifeFit layer
- NOT acuity

---

## OUTPUT TARGET

These inputs will later produce:

- withdrawalSeverity (0–4)
- psychiatricSeverity (0–4)
- biomedicalSeverity (0–4)

AND

- overallAcuityBand:
  - low
  - moderate
  - high
  - critical

---

## DESIGN PRINCIPLE

Keep v1:

- SIMPLE
- DEFENSIBLE
- SELF-REPORTED
- NON-CLINICAL

---

## RULE

If an input requires:
- observation
- diagnosis
- interpretation beyond patient report

→ DO NOT INCLUDE

---

## VERSION
v1 — minimal viable acuity input layer

