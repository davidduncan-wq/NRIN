# NRIN ENGINEERING HANDOFF — 2026-04-28
## SMS RETURN FLOW + INTAKE REHYDRATION

## CURRENT STATE

Latest work completed:
- Patient entry split created:
  - /patient/entry
  - Start new intake
  - Return to my intake
- Return page created:
  - /patient/return
- Twilio Verify dependency added.
- Server Supabase client added:
  - src/lib/supabaseServer.ts
- SMS return API routes added:
  - /api/patient/return/send-code
  - /api/patient/return/check-code
- SMS test mode added:
  - NRIN_RETURN_TEST_MODE=true
  - test code = 111111
- Phone normalization added:
  - src/lib/patient/normalizePhone.ts
- Resume API added:
  - /api/patient/resume?caseId=...
- Intake rehydration wired into /patient/page.tsx.
- patients.intake_payload jsonb added in Supabase.
- handleFinalSubmit now saves full intake snapshot:
  - intake_payload: form
- Resume route now prefers patient.intake_payload and falls back to DB-column mapping.
- Normal resume preserves insurance/payment data.
- Payment reset is now explicit:
  - resetPayment=1

## VERIFIED BEHAVIOR

Test mode flow:
1. /patient/return
2. enter phone
3. send code
4. enter 111111
5. check-code resolves case
6. redirects to:
   /patient?caseId=...&returnStep=5
7. /patient calls:
   /api/patient/resume?caseId=...
8. form rehydrates from intake_payload

## IMPORTANT DESIGN TRUTH

Patient self-return:
- phone + SMS verifies identity
- backend selects case
- caseId becomes the state bridge
- /patient rehydrates by caseId → patient_id → patient.intake_payload

Do NOT build resume from phone directly inside /patient.

## INSURANCE RULE

Never erase insurance data by default.

Normal resume:
  /patient?caseId=...&returnStep=5
  → preserves insurance/payment fields

VA/payment reset:
  /patient?caseId=...&returnStep=5&resetPayment=1
  → clears payment fields deliberately

## KNOWN LIMITATIONS

- Return flow currently supports SMS only.
- Email return path not built yet.
- Twilio real production mode requires env vars:
  - TWILIO_ACCOUNT_SID
  - TWILIO_AUTH_TOKEN
  - TWILIO_VERIFY_SERVICE_SID
  - SUPABASE_SERVICE_ROLE_KEY
- Test mode currently bypasses SMS send and accepts 111111.
- Existing older patient rows without intake_payload can only partially resume via fallback mapping.
- "See previous matches" button is not built yet.

## NEXT NATURAL WORK

1. Add "See my previous matches" affordance after resume.
2. Build admin command center.
3. Add email return option.
4. Decide how to represent multi-case referrers:
   - providers
   - courts
   - faith/orgs
   - family advocates
5. Inspect external DB and plan migration into NRIN.
