# NRIN — NEXT BUILD TARGET — 2026-03-27 9:00 PM

## Primary target
Build the patient-side rejection/refinement loop after first-pass matches.

## Why
The matcher is now strong enough to produce real geography-aware results, but patients still need a path when none of the options feel acceptable.

## Build order
1. add “none of these feel right” branch on patient matches
2. support refine / tighten / manual search
3. optimize matcher performance without breaking full-universe correctness
4. scope facility referrals to current facility identity
5. only then polish Step 5 insurance UX further

## Explicitly not next
- not crawler work
- not broad redesign
- not admissions-case overbuild
- not fake environment logic beyond what is truly wired

## Current live truth
- `close_to_home` works
- other environment pills are mostly not scored yet
- admin referral visibility exists
- performance is still too slow for production
