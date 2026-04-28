BOOT — NRIN / POST SMS RETURN FLOW + DB MIGRATION INSPECTION

We are resuming after SMS return flow and intake rehydration work.

Read first:
1. project_brain/handoffs/NRIN_ENGINEERING_HANDOFF_2026-04-28_SMS_RETURN_AND_REHYDRATION.md
2. project_brain/next_builds/NRIN_NEXT_BUILD_2026-04-28_AFTER_SMS_RETURN.md
3. project_brain/identity/NRIN_CASE_CONTINUITY_DOCTRINE_2026-04-16.md
4. project_brain/identity/NRIN_RESUMABLE_CASE_DOCTRINE_2026-04-16.md
5. src/app/patient/page.tsx
6. src/app/patient/return/page.tsx
7. src/app/api/patient/return/send-code/route.ts
8. src/app/api/patient/return/check-code/route.ts
9. src/app/api/patient/resume/route.ts

Current truth:
- SMS return flow works in test mode.
- Test code is 111111 when NRIN_RETURN_TEST_MODE=true.
- Return flow resolves caseId, then /patient rehydrates from patients.intake_payload.
- intake_payload is now the canonical UI-state snapshot.
- Insurance/payment data must never be cleared by default.
- resetPayment=1 is the explicit payment-reset mechanism for VA escape or similar flows.
- Patient self-return is distinct from future org/provider/court/family multi-case portals.

Immediate next discussion:
User has created a separate facility DB using another method. Inspect it separately in the current/new session before any migration. Do not import or overwrite NRIN data without schema comparison and migration doctrine.
