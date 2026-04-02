# NRIN — NEXT BUILD TARGET — 2026-04-01

## Build theme

Re-align intake, profile, matcher, and routing after successful Queue A + resolver integration.

---

## Why this is the next build

This session proved:
- insurance truth improved materially
- matcher now consumes better insurance truth
- remaining failures are not crawler failures

Remaining failures are system-alignment failures:

1. geo / close-to-home handling
2. indigent / no-insurance routing
3. broad-match timeout exposure

---

## Primary goal

Determine the correct doctrinal and code ownership for:

- close_to_home
- refineGeo
- indigent-path routing
- fundingType handoff from intake to next surface

Then implement only the minimum required fixes.

---

## Scope

### In scope
- doctrine inspection
- implementation inspection
- geo signal alignment
- indigent fork ownership
- safe routing correction
- retest of two known scenarios:
  - Palm Springs close-to-home
  - no-insurance / no-self-pay / military

### Out of scope
- Queue B
- performance optimization pass
- UI polish
- broad facility onboarding implementation
- unrelated matcher redesign

---

## Success criteria

### Scenario 1 — close to home
Palm Springs / private / detox / family case should:
- honor close-to-home intent more meaningfully
- stop surfacing obviously distant matches as top options

### Scenario 2 — indigent
No-insurance + no-self-pay case should:
- stop entering inappropriate matcher flow
- route to the correct interim/indigent experience as dictated by doctrine

### Scenario 3 — stability
No new corruption in:
- `fetchFacilityMatches.ts`
- build profile
- routing surfaces

---

## Build order

1. Read doctrine
2. Inspect code
3. Decide ownership
4. Make surgical fix
5. Re-test scenarios
6. Only then consider follow-up optimization

---

## One-line target

The next build is not “more matching”; it is the correction of intake-to-matcher-to-routing alignment after insurance truth improvement.
