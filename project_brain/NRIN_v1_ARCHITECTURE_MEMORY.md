# NRIN v1 – ARCHITECTURE MEMORY FILE

**Purpose:**
This document acts as persistent architectural memory for NRIN v1 so that future AI agents (or developers) can immediately understand the philosophical intent, system structure, decision hierarchy, and implementation direction without re-reading prior chats.

---
## Operating Rules for Future Agents (Non-Negotiable)

When giving instructions to David, you MUST always specify *where* each action happens:

- **Terminal (macOS zsh):** commands to run (e.g., `npm run dev`, `git`, `ls`, `nano`, `npm install`)
- **VS Code:** file edits, search/replace, saving files, viewing diffs
- **Browser → localhost:** verifying UI behavior (e.g., `http://localhost:3000/patient`)
- **Browser → Supabase Dashboard:** SQL Editor, Table Editor, RLS/policies, API settings
- **Next.js / App Router:** specify exact file paths under `src/app/...` and whether to “REPLACE ENTIRE FILE” or “EDIT ONLY THESE LINES”

Instruction format required:

1. **Restate the goal in one sentence.**
2. **MICRO-PLAN (3–6 bullets).**
3. **Step-by-step actions grouped by location**, with explicit labels:
   - **Terminal:** exact commands (no comment lines starting with `#` unless clearly explained not to paste)
   - **VS Code:** exact file path + what to edit + “Cmd+S” to save
   - **Browser:** exact URL to visit + what success looks like
   - **Supabase:** exact place to click + SQL to run (if needed)
4. **Never change frameworks or folder structure** unless David explicitly asks.
5. Prefer small, incremental edits; avoid large rewrites unless marked **REPLACE ENTIRE FILE**.

### Required Response Template (Copy/Paste)

**Goal:** <one sentence>

**MICRO-PLAN:**
- ...
- ...
- ...

**Terminal:**
1) ...
2) ...

**VS Code:**
1) Open: `...`
2) Edit: `...`
3) Save: Cmd+S

**Browser:**
- Visit: `http://localhost:3000/...`
- Expect: ...

**Supabase (if needed):**
- Dashboard → ...
- Run SQL: ...
# 1. CORE MISSION (MVP)

NRIN v1 is a **neutral intake and routing clearinghouse** for Substance Use Disorder (SUD) treatment.

It is:

* Air Traffic Control for treatment placement
* A standardized intake engine
* A patient-needs-first routing layer
* A handoff accelerator between patients, advocates, and treatment centers (TCs)

It is NOT (in MVP):

* A full EHR
* A longitudinal recovery tracking system
* A billing platform
* A clinical documentation system

---

# 2. PHILOSOPHICAL INVERSION

Current market model (broken):
Insurance → Revenue → Logistics → Patient Needs

NRIN model:

1. Clinical need (safety first)
2. Patient preference
3. Insurance compatibility
4. Geography
5. Operational constraints

Matching must NEVER be monetized or influenced by paid ranking.

---

# 3. INTAKE FLOW (FINALIZED MVP STRUCTURE)

## Global Static Banner

Displayed at top of intake:
"If you are in immediate danger, call 911. If you are suicidal or in crisis, call or text 988."

(No suicide branching logic in MVP. Seed only.)

---

## Step 1 – Identity

* First name
* Last name
* Phone
* Date of Birth (required)

---

## Step 2 – Safety & Stability (Early Reality Signal)

Questions:

1. Where did you sleep last night? (Decline allowed; note about state funding eligibility)
2. Do you have a stable place to stay? (Decline allowed; funding note)
3. Are you experiencing withdrawal symptoms? (Required)
4. Optional: Share current location (note about transportation benefit)

Design principles:

* Decline to answer allowed for housing
* Required for withdrawal
* Gentle informational notes, not coercive
* Location consent-based only

---

## Step 3 – Substance & Clinical (ASAM-Lite)

We do NOT implement full ASAM 0–4 scoring.

We derive simplified routing indicators:

* Withdrawal risk (low/medium/high)
* Housing instability
* Co-occurring mental health (basic signal only)
* Relapse history
* Support system strength

Output:

* recommended_level_of_care

  * Detox
  * Residential
  * PHP
  * IOP
  * Outpatient

Derivation occurs server-side (Next.js route handler) to preserve neutrality and integrity.

---

## Step 4 – Preferences

Patient-selected environment preferences:

* Ocean
* Desert
* Mountain
* Urban / City
* Rural
* Near home
* Far from home
* Region (West/East/North/South)

Preferences influence scoring but never override safety.

---

## Step 5 – Financial

Patient selects one:

* Use my insurance
* I will self-pay
* I need financial assistance (scholarship/grant/public funding)

Insurance logic is configurable per TC onboarding.

---

# 4. MATCHING ENGINE – EXECUTION ORDER

Matching occurs ONLY after intake submission (not dynamic during intake).

## Step 0 – (Future) Crisis Override Layer

Seeded but inactive in MVP.

## Step 1 – Level of Care Filter

Filter facilities by recommended_level_of_care.

## Step 2 – Bed Availability Filter

Exclude facilities with zero beds (unless admin override).

## Step 3 – Financial Filter

Insurance/self-pay/grant logic applied based on patient selection.

## Step 4 – Preference Weighting

Apply environment and geography scoring.

## Step 5 – Final Weighted Score

Return Top 5 matches.

User may expand to see more.

---

# 5. MATCHING CONFIG (ADMIN-TUNABLE)

Weights stored in DB (no hardcoding):

* clinical_weight (default 0.4)
* insurance_weight (default 0.2)
* preference_weight (default 0.2)
* geography_weight (default 0.1)
* availability_weight (default 0.1)

Configurable flags:

* require_insurance_match
* allow_self_pay_toggle
* allow_grant_toggle

Future: crisis_override_enabled

---

# 6. TREATMENT CENTER (TC) ONBOARDING MODEL

Each TC profile must include:

Services:

* Detox
* Residential
* PHP
* IOP

Bed Counts (stored per TC; defaults used until verified):

* detox_beds_total / detox_beds_available
* residential_beds_total / residential_beds_available
* php_slots_total / php_slots_available
* iop_slots_total / iop_slots_available
* bed_counts_confirmed (boolean)
* bed_count_source (default | tc_confirmed | admin_updated)

Defaults may be auto-populated for bulk-loaded/unclaimed TCs (e.g., hospital detox 10, residential 20, non-residential 25) to avoid manual entry at scale. These are NOT hard-coded and must be editable.

**UI/Matching disclaimer (always-on):** Capacity/bed availability is self-reported by treatment centers and may be unverified or outdated. Unclaimed/default profiles must be clearly labeled (e.g., "Capacity not yet confirmed").

---

# 8. HORSE TRADING LEDGER (FUTURE – NOT MVP)

Concept:
TC dashboard displays:

* Referred out count by TC
* Received from count by TC
* Net balance

This is post-match negotiation infrastructure.
It must NEVER influence ranking algorithm.

---

# 9. LOCATION MODEL

Location is:

* Consent-based
* Referral-scoped
* Timestamped

Used for:

* Proximity scoring
* Transport coordination (future)
* ER suggestion (future)

Never shared without consent.

---

# 10. IMPLEMENTATION STACK (CURRENT)

Project root:
/Users/davidduncan/Desktop/nrin

Tech stack:

* Next.js 16 (App Router, TypeScript)
* Supabase (Postgres)
* Tailwind CSS

Key files:

* src/app/patient/page.tsx
* src/lib/supabaseClient.ts

Future recommended structure:

* src/lib/intakeApi.ts (abstraction layer)
* src/app/api/match/route.ts (server-side derivation + scoring)

Matching logic should live server-side.

---

# 11. MVP SCOPE LOCKED

MVP includes:

* Structured intake
* ASAM-lite derivation
* Housing signal
* Withdrawal detection
* Post-submit matching
* Top 5 ranked
* Insurance/self-pay/grant toggles
* Bed availability filter
* Admin-tunable scoring
* Static 988/911 banner

MVP excludes:

* Suicide override logic
* Real-time transport
* Full ASAM scoring
* Full CRM
* Outcome tracking

---

# 12. NORTH STAR

NRIN becomes:

* Patient-needs-first routing infrastructure
* Transparent matching engine
* Standardized intake for government reporting
* Neutral clearinghouse between orgs and TCs

Clinical safety > Preference > Insurance > Geography > Capacity.

This document should be updated only when structural decisions change.

