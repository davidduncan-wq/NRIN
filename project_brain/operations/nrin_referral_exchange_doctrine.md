# nrin — REFERRAL EXCHANGE DOCTRINE

## Clarification

Referral exchange is not:
- system recommendation
- patient match output

Referral exchange is:
- facility-to-facility movement or recommendation behavior

---

## Current System Reality

NRIN now supports a real manual recommendation path:

### Sending row
- status = recommended_elsewhere
- recommended_facility_site_id stored
- recommendation_reason stored

### Receiving row
- new referral created
- facility_site_id = target facility
- status = new
- referral_source = facility_recommendation

This is the first true execution layer for exchange behavior.

---

## Strategic Reminder

Exchange behavior is already real in the industry.
NRIN’s value is:
- make it visible
- make it structured
- preserve history
- create accountable operational movement

---

## Important Distinction

### returned_to_nrin
- no specific receiving facility selected
- system reroute path should decide the next facility

### recommended_elsewhere
- specific receiving facility selected
- target is explicit
- handoff should create receiving referral row

---

## Future Direction

The manual recommend path should continue evolving from:
- dumb dropdown
to:
- searchable facility decision support
- patient-need-aware compare layer
- checks / caution signals / important gaps

