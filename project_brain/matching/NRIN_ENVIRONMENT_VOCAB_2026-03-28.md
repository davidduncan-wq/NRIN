# NRIN — ENVIRONMENT VOCAB — 2026-03-28

## Purpose

Define the canonical environment and geography vocabulary for NRIN.

This file is the single source of truth for:
- allowed environment preference values
- their meanings
- their operational status (scoring vs captured-only)

No matcher logic should reference environment strings outside this vocabulary.

---

## Core Rule

Environment values must be:

- canonical (no synonyms in code)
- typed (grouped by dimension)
- status-aware (only scored if supported)

---

## 1. REGION (Geographic)

| Value            | Description                          | Status           |
|------------------|--------------------------------------|------------------|
| west_coast       | CA, OR, WA                           | active_scoring   |
| east_coast       | NY → FL coastal states               | seed_phase       |
| midwest          | Central US states                    | seed_phase       |
| southwest        | AZ, NM, NV, inland CA                | seed_phase       |
| southeast        | Southern Atlantic/Gulf states        | seed_phase       |
| northeast        | New England + NY/NJ                  | seed_phase       |

Notes:
- Region should be derived from facility.state
- Initial scoring should start with west_coast only

---

## 2. DISTANCE / PROXIMITY

| Value            | Description                          | Status           |
|------------------|--------------------------------------|------------------|
| close_to_home    | Prefer near patient location         | active_scoring   |
| open_to_travel   | No geographic restriction            | active_scoring   |

Notes:
- Derived from patient lat/lng vs facility lat/lng
- Already partially implemented in scoring

---

## 3. OBJECTIVE TERRAIN / BIOME

| Value            | Description                          | Status           |
|------------------|--------------------------------------|------------------|
| coastal          | Near ocean / coastline               | seed_phase       |
| desert           | Arid desert regions                  | seed_phase       |
| mountain         | High elevation / alpine              | seed_phase       |
| forest           | Temperate forest regions             | seed_phase       |
| valley           | Basin / valley geography             | captured_only    |

Notes:
- Must be derived from lat/lng (not marketing text)
- Not yet scoreable until classifier exists

---

## 4. DENSITY / URBANICITY

| Value            | Description                          | Status           |
|------------------|--------------------------------------|------------------|
| urban            | Dense metro area                     | captured_only    |
| suburban         | Mid-density residential              | captured_only    |
| rural            | Low-density / remote                 | captured_only    |

Notes:
- Requires enrichment or proxy logic
- Do not guess prematurely

---

## 5. SUBJECTIVE / MARKETING ENVIRONMENT

| Value            | Description                          | Status           |
|------------------|--------------------------------------|------------------|
| quiet            | Calm / low stimulation               | captured_only    |
| luxury           | High-end amenities                  | captured_only    |
| private          | Privacy-focused setting              | captured_only    |
| retreat          | Retreat-style positioning            | captured_only    |
| resort_like      | Resort-style experience              | captured_only    |

Notes:
- Crawler 2.0 responsibility
- Never treated as objective truth

---

## 6. SPECIAL CONTEXT SIGNALS (FUTURE MATCH LAYERS)

| Value                    | Description                              | Status           |
|--------------------------|------------------------------------------|------------------|
| lgbtq_affirming          | LGBTQ+ supportive facility               | captured_only    |
| trans_affirming          | Explicit trans policy support            | captured_only    |
| faith_based              | Religious / faith-oriented programming   | captured_only    |
| professional_track       | Career/licensing-focused programs        | active_scoring   |
| family_program           | Family involvement programming           | active_scoring   |

Notes:
- Some already partially implemented (professional, family)
- Others require crawler 2.0 + facility verification

---

## Operational Status Definitions

| Status          | Meaning |
|-----------------|--------|
| active_scoring  | Used in matcher scoring now |
| seed_phase      | Will be supported after environment classifier |
| captured_only   | Stored but not used in scoring |

---

## Critical Rule

No scoring logic may:
- introduce new environment strings
- interpret free-text environment values
- bypass this vocabulary

All environment handling must route through this file.

---

## One-Line Summary

NRIN environment handling must use a canonical, status-aware vocabulary that separates region, distance, objective terrain, density, and subjective marketing signals before applying scoring logic.

