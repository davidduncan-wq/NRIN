# NRIN — ENGINEERING HANDOFF

## SESSION SUMMARY

This session moved the facility side from:
“UI with actions”

→ to

“operational system with real workflow + decision surface”

Key shift:
We stopped pretending certainty and introduced **honest uncertainty**

---

## MAJOR ACCOMPLISHMENTS

### 1. Facility workflow is real

- recommend_elsewhere → creates receiving referral
- returned_to_nrin → creates rerouted referral
- workflow is bifurcated (UI vs execution)

This is no longer a stub system.

---

### 2. Manual facility search is real

Before:
- limited to 1000 rows (broken)

Now:
- loads full facility_sites (~5378)
- batched loading + dedupe
- partial matching works:
  - name
  - city
  - postal_code

Search is now FUNCTIONALLY VALID.

---

### 3. Recommend elsewhere UI works end-to-end

- manual selection works
- search works
- recommendation reason captured
- downstream referral created

This is a complete operational path.

---

### 4. Trust layer v1 implemented CORRECTLY

Critical correction:

Old:
❌ No detox  
❌ No residential  

New:
⚠ Detox not confirmed  
⚠ Residential not confirmed  

Why:
facility_sites data is sparse → system must not fabricate negatives

---

### 5. Signal doctrine established (CRITICAL)

Patient pills ≠ checks

System now follows:

- patient pills = needs
- facility checks = support
- ⚠ = unknown
- ❌ = confirmed gap (not yet widely used)
- wants = tie-breakers

This is now canonical.

---

### 6. Facility UI cleaned

- removed "Assign facility site" from facility view
- preserved internally for future admin surface

---

## WHAT WE LEARNED

### Data reality
- facility_sites is shallow (many nulls)
- referrals bridge fields mostly empty
- patient derived fields mostly not persisted

→ system must operate under uncertainty

---

### Architecture truth

We do NOT yet have:

- reliable persisted matcher output
- strong facility intelligence layer (yet)

So:

→ trust layer must remain cautious

---

## WHAT IS NOT DONE

### 1. returned_to_nrin reroute
Still:
- fallback / naive selection

Needs:
- match-aware reroute

---

### 2. Trust layer
Still:
- facility-aware only

Needs:
- patient-aware comparison

---

### 3. Search
Still:
- text-based ranking

Needs:
- need-aware ranking

Example future:
“detox MAT san diego”

---

## NEXT BUILD (STRICT ORDER)

### STEP 1 — FIX REROUTE

Replace:
fallback facility selection

With:
match-aware next best facility

---

### STEP 2 — PATIENT-AWARE TRUST

Compare:
- patient needs
vs
- facility support

Use:
real data only (no guessing)

---

### STEP 3 — SEARCH RANKING

Add:
- token parsing (detox, MAT, etc.)
- match scoring

---

## DO NOT DO

- DO NOT start crawler v2
- DO NOT redesign UI prematurely
- DO NOT assume missing data
- DO NOT collapse needs and checks

---

## FINAL STRATEGIC NOTE

You are now building:

NOT:
a directory

NOT:
a crawler

BUT:

**a decision engine that earns trust**

That means:

accuracy > completeness  
honesty > confidence  
clarity > polish  

