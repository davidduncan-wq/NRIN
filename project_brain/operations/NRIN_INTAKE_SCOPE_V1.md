# NRIN INTAKE SCOPE (v1)

## PURPOSE
Define exactly what NRIN intake collects — no more, no less.

Intake exists to:
- enable accurate matching
- enable routing
- prepare facility prescreen

NOT to:
- diagnose
- assess crisis
- perform full clinical intake

---

## INTAKE CORE OBJECTIVE

NRIN intake answers:

> "What kind of help might fit this person best?"

NOT:

> "What is clinically wrong with this person?"

---

## REQUIRED INPUTS

### 1. SUBSTANCE USE (MINIMAL)
- substances used
- frequency (daily / frequent / occasional)
- last use (bucketed)

---

### 2. WITHDRAWAL SIGNAL (BINARY ONLY)
- history of severe withdrawal (yes/no)
- current symptoms present (yes/no)

NO detailed symptom checklists

---

### 3. TREATMENT HISTORY
- prior treatment (yes/no)
- relapse timing (coarse buckets)

---

### 4. MENTAL HEALTH (NON-CLINICAL)
- on mental health medications (yes/no)
- prior psychiatric hospitalization (yes/no)

NO ideation questions
NO diagnostic questions

---

### 5. SUPPORT / ENVIRONMENT
- housing stable (yes/no)
- supportive person (yes/no/unknown)

---

### 6. PAYMENT / ACCESS
- insurance vs self-pay vs public
- carrier (normalized)

---

## EXCLUDED FROM INTAKE

DO NOT INCLUDE:

- suicide / harm questions (see CRISIS_BOUNDARY)
- detailed psychiatric evaluation
- trauma history depth
- legal system deep intake
- full medical history
- ASAM full dimensions

---

## OUTPUT OF INTAKE

Intake produces:

- patient_match_snapshot
- recommendedLevelOfCare (NON-CLINICAL framing)
- routing-ready data

---

## HANDOFF

After intake:

→ patient is MATCHED
→ patient is CONNECTED
→ facility performs PRESCREEN

---

## DESIGN RULE

If a question:

- does not improve matching
- does not improve routing
- increases liability

→ REMOVE IT

---

## VERSION
v1 — minimal viable intake aligned with doctrine

