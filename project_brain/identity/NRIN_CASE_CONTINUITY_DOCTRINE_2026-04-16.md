# NRIN — CASE CONTINUITY DOCTRINE — 2026-04-16

## PURPOSE

Define how users return to and continue an intake.

NRIN does NOT use traditional accounts.

NRIN uses:
→ case continuity
→ resumable intake state
→ minimal-friction identity

---

## CORE PRINCIPLE

The user experience is:

"I already told you my story — don’t make me tell it again."

Intake is NOT a disposable form.

Intake becomes:
→ a persistent, editable case record

---

## IDENTITY MODEL

NRIN does NOT use:
- username/password
- account creation flows

NRIN uses:

### PRIMARY
- phone number (real-world anchor)

### SECONDARY
- email address (optional but encouraged)

A case may have BOTH.

Either may be used to resume.

---

## RETURN ENTRY POINT

Homepage presents:

1. Start new intake
2. Return to my intake

---

## RETURN FLOW

User selects delivery method:

- Text message (primary)
- Email (secondary)

---

## TEXT FLOW (PRIMARY)

1. User enters phone number
2. NRIN sends 6-digit code via SMS
3. User enters code
4. System resolves:
   → patientId
   → caseId
5. Intake rehydrates
6. User resumes at appropriate step

---

## EMAIL FLOW (SECONDARY)

1. User enters email
2. NRIN sends magic link
3. User clicks link
4. System resolves:
   → patientId
   → caseId
5. Intake rehydrates
6. User resumes at appropriate step

---

## CASE REHYDRATION

When resuming:

- Load saved intake data from DB
- Populate form state
- Resume at specified step (e.g. returnStep=5)
- DO NOT create a new case

---

## ROUTING INTEGRATION

This system must support ALL routes:

- matcher
- VA route
- indigent path
- future referral flows

Any route may return user to intake via:

/patient?caseId=...&returnStep=...

---

## VA-SPECIFIC APPLICATION

VA route escape:

- does NOT send user to matcher
- returns to intake at payment decision point

Flow:

VA route → intake (Step 5) → user selects payment → matcher

---

## SECURITY PRINCIPLES

- No weak PIN systems
- SMS codes are short-lived
- Email links are time-bound
- Rate limit attempts
- Do not expose case data without verification

---

## PRODUCT POSITIONING

NRIN is NOT:
→ an account system

NRIN IS:
→ a guided case-based system

Continuity is tied to:
→ the case
→ not a login

---

## ONE-LINE SUMMARY

Routing decides the system.
Matching ranks options.
Intake remains the persistent, editable narrative across all routes.
