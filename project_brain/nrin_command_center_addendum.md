# nrin — COMMAND CENTER ADDENDUM

## Facility / Case / Referral Exchange Clarity

### Terminology rule
- recommendation = nrin match output
- case = shared patient/facility operational bridge
- facility workflow = referral-side admissions handling
- referral exchange = facility-to-facility pass/recommend behavior
- referral source = outside org / court / faith / nonprofit origin

Do not use "referral" as the generic label for nrin recommendation output.

### Current strategic build direction
The next major system phase is:
- restoring the case bridge
- strengthening facility workflow
- preserving room for transparent referral exchange
- using crawler-derived facility data to power facility-side verification/edit flows

### Current architecture reminder
- patient side is robust
- facility side exists but needs more operational muscle
- shared recommendation UI and case bridge are not the same thing
- `src/components/matching/*` should be treated as future shared match presentation bridge, not as the case layer

