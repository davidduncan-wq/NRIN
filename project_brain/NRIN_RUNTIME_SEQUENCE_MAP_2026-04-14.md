# NRIN RUNTIME SEQUENCE — 2026-04-14

1. Patient completes intake
2. URL params generated
3. buildPatientProfile()
4. matchPatientToFacilities()

---

## MATCH FLOW

- hardFilters
- scorePrograms
- scoreInsurance
- scoreSpecialties
- scoreGeo
- scoreEnvironment
- scoreExperience
- scoreConfidence

---

## REFINEMENT FLOW

1. User opens refinement
2. Adjusts:
   - refineGeo
   - refineEnvironment
   - refineExperience

3. Params updated
4. buildPatientProfile re-runs
5. matcher re-scores
6. results re-render

---

## KEY INSIGHT

Refinement does NOT change:
- clinical eligibility

Refinement ONLY changes:
- ranking + tradeoffs

