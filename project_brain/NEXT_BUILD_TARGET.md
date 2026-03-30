# NEXT BUILD TARGET — NRIN
Updated: 2026-03-30

## Target
Build and validate a **post-crawl insurance truth resolver**.

## Why this is next
Crawler v2 successfully improved evidence collection:
- homepage + admissions + insurance + verify surfaces
- image/logo detection
- verification-flow detection
- queue telemetry
- strong recovery from false/unresolved bucket

Remaining misses are now interpretive.

## Success criteria
A successful next build will:

1. flip obvious private/commercial false negatives to true
2. correctly respect exclusion/negation language
3. preserve false-but-alive rows as likely public/community/manual-review residue
4. avoid expanding crawler scope
5. avoid polluting ranking with crawler signal strength

## Explicit non-goals
- do not expand crawler breadth
- do not build more page-hunting heuristics
- do not let signal confidence drive ranking
- do not re-open infinite crawler experimentation

## Example targets for resolver logic
Positive commercial/private phrasing:
- most private insurance
- most commercial insurance
- most major insurance
- most major insurers
- major insurance plans
- commercial insurance plans
- private insurance and Medicaid
- Medicaid, Medicare, and most commercial insurance

Negation / exclusion phrasing:
- excluding Medicare and Medicaid
- no Medicaid accepted
- does not accept Medicaid
- not accepted
- does not take

## Downstream effect
This build protects matching/routing integrity by ensuring:
- good facilities do not get excluded because they are quiet
- crawler evidence is translated into truth more intelligently
- the remaining unresolved bucket becomes more useful for indigent/public path work

