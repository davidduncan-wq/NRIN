# NRIN ACUITY STORAGE (v1)

## PURPOSE
Define where patient acuity lives, how it is persisted, and how it flows through NRIN.

---

## CORE PRINCIPLE

Acuity is:

- derived from self-reported intake
- stored as a SNAPSHOT
- immutable for that intake event
- refinable during prescreen (new snapshot, not overwrite)

---

## PRIMARY STORAGE LOCATION

Acuity lives on the CASE.

Table: cases

New field:

- patient_acuity_snapshot (jsonb)

---

## SNAPSHOT STRUCTURE

Example:

{
  "withdrawalSeverity": 3,
  "psychiatricSeverity": 2,
  "biomedicalSeverity": 1,
  "urgentWithdrawalNeed": true,
  "urgentPsychNeed": false,
  "urgentMedicalNeed": false,
  "overallAcuityBand": "high",
  "rationale": [
    "Daily alcohol use with recent use",
    "Withdrawal history reported"
  ]
}

---

## WHY SNAPSHOT (NOT DERIVED LIVE)

- preserves historical truth
- avoids drift when logic changes
- supports auditability
- supports training data later

---

## MATCHER RELATIONSHIP

Matcher SHOULD NOT:

- recompute acuity
- own acuity logic

Matcher MAY:

- read acuity snapshot
- use it as a weighting or filter input (later phase)

---

## ROUTING RELATIONSHIP

Routing MAY:

- use overallAcuityBand
- use urgent flags

Routing SHOULD:

- prioritize high / critical
- avoid low-capability facilities for high acuity

---

## PRESCREEN RELATIONSHIP

Prescreen MAY:

- read initial snapshot
- refine acuity

Prescreen MUST:

- create a NEW snapshot version (future enhancement)

---

## REFERRAL RELATIONSHIP

Referrals MAY store:

- recommended_acuity_band
- recommended_reason

BUT source of truth remains:

- cases.patient_acuity_snapshot

---

## VERSIONING (FUTURE)

Future structure:

- patient_acuity_snapshot_v1
- patient_acuity_snapshot_v2

Do NOT overwrite historical snapshots.

---

## ANTI-PATTERN

DO NOT:

- store acuity scattered across fields
- recompute acuity in multiple places
- let UI derive acuity independently

---

## VERSION
v1 — canonical acuity storage model

