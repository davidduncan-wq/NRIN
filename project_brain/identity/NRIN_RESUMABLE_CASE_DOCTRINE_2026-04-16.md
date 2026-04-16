# NRIN — RESUMABLE CASE DOCTRINE — 2026-04-16

## PURPOSE

Define what constitutes a "resumable case" and how NRIN selects which case to reopen when a user returns.

This governs:
- SMS/email return flows
- intake rehydration
- cross-route continuity

---

## CORE PRINCIPLE

A user may have multiple cases.

NRIN must:
→ select ONE correct case to resume
→ do so predictably
→ avoid ambiguity

---

## DEFINITIONS

### CASE STATES

- NEW_INTAKE
  → intake created but not yet progressed downstream

- IN_PROGRESS
  → user has entered routing system (matcher, VA, etc.)
  → case is active

- MATCH_SELECTED
  → user has selected a facility (pre-referral)

- REFERRED
  → referral has been created

- CLOSED
  → case completed, expired, or archived

---

## RESUMABLE CASE RULE

A case is "resumable" if:

state ∈ { NEW_INTAKE, IN_PROGRESS, MATCH_SELECTED }

A case is NOT resumable if:

state ∈ { REFERRED, CLOSED }

---

## CASE SELECTION LOGIC

When user returns via phone/email:

1. Find all cases tied to identity (phone or email)
2. Filter to resumable cases
3. Sort by:
   → most recently updated (updated_at DESC)
4. Select:
   → top 1 case

---

## MULTIPLE ACTIVE CASES

If multiple resumable cases exist:

Default behavior:
→ select most recent automatically

Future enhancement (optional):
→ allow user to choose:
   "Resume your most recent intake?"
   "Start a new one?"

---

## NO CASE FOUND

If no resumable case exists:

System response:

→ "We couldn't find an active intake. Let's start a new one."

---

## CASE REHYDRATION

When a case is resumed:

System must:
- load patient + case data from DB
- reconstruct form state
- determine appropriate step

---

## STEP RESOLUTION

Priority order:

1. explicit returnStep param (e.g. returnStep=5)
2. inferred step from case completeness
3. default → Step 5 (Life Fit / decision layer)

---

## ROUTING INTEGRATION

Resumed cases may re-enter:

- intake editing (preferred)
- routing decision layer
- downstream flows

System must NOT:
→ force immediate matcher execution
→ force VA routing without user confirmation

---

## VA-SPECIFIC RULE

If returning from VA route:

→ ALWAYS return to intake decision layer (Step 5)
→ DO NOT auto-route back to VA
→ require user to re-confirm payment path

---

## DATA INTEGRITY

Resuming a case must:

- NOT create a new case
- update existing case
- preserve history

---

## SECURITY

- lookup requires verified identity (SMS/email)
- do not expose multiple cases without verification
- rate limit lookup attempts

---

## PRODUCT BEHAVIOR

Returning users experience:

→ continuity, not restart
→ editing, not re-entry
→ guided progression, not branching confusion

---

## ONE-LINE SUMMARY

NRIN resumes the most recent active case,
rehydrates intake,
and returns the user to the correct decision point.
