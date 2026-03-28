# nrin — FACILITY DASHBOARD BLUEPRINT (UPDATED)

## Key Change

"Decline" is removed.

Facilities now choose:

- Return to nrin
- Recommend elsewhere

---

## Workflow Panel Behavior

When facility does not accept:

System must prompt:

### Option A
Return to nrin
- requires reason

### Option B
Recommend elsewhere
- select facility
- requires reason

---

## Status Buttons Are Not Final Actions

Clicking:
- returned_to_nrin
- recommended_elsewhere

Should open a workflow decision panel,
not immediately update status.

---

## Operational Status Integration

If facility selects:

"not taking new patients"

System must:
- flip facility to not accepting
- suppress new matches

---

## Timer Behavior (UI implication)

Each new referral:

- has a response window
- shows countdown (future)
- expires if no action

