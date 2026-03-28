# nrin — CODE MAP ADDENDUM

## Facility Operations (Add / Update)

### Facility Dashboard
- `src/app/facility/dashboard/page.tsx`
  - facility-side dashboard entry page
  - currently loads `facility_sites`
  - should evolve into crawler-informed verification/edit surface

### Facility Referrals / Workflow
- `src/app/facility/referrals/page.tsx`
  - facility referral/case queue entry

- `src/app/facility/referrals/[id]/page.tsx`
  - facility-side detail workspace
  - likely primary bridge into admissions/case workflow expansion

- `src/components/facility/ReferralsClient.tsx`
  - queue/list interaction layer for facility workflow

- `src/components/facility/ReferralDetailSheet.tsx`
  - current detail surface for facility-side operational handling
  - likely best place to evolve into real admissions/case workspace

## Important Distinction

- `src/components/matching/*`
  - future/shared match presentation bridge
  - recommendation rendering only
  - not the case layer

- case bridge / facility workflow
  - separate concern from shared recommendation rendering

