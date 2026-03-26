# NRIN COMMAND CENTER

## PURPOSE
This is the active command file for new execution chats.
It must stay current.
If this file is stale, it is useless.

---

## CURRENT SYSTEM STATE

### Patient flow
- Intake -> Matching -> Facility Selection -> Pre-screen (ratification) is live
- Pre-screen submit now:
  - updates `cases.state = MATCH_SELECTED`
  - updates `cases.match_score`
  - updates `cases.notes`
  - creates a new `referrals` row with:
    - `patient_id`
    - `case_id`
    - `facility_site_id`
    - `referral_source = "nrin"`
    - `status = "new"`

### Financial routing
- Step 5 = soft signal only
- Pre-screen = ratification / hard gate
- Indigent/public-funding fork exists:
  - if no insurance + no self-pay -> `/patient/indigent-path`

### Important schema truth
- matcher returns `facility_sites.id`
- `referrals.facility_site_id` expects `facility_sites.id`
- `cases.selected_facility_id` expects `facilities.id`

### Confirmation / placement
- `/patient/confirmation` exists as the first placement-state landing page
- current copy tells patient to text location to `(310) 740-4837`

---

## CURRENT DESIGN / PRODUCT DOCTRINE

### Hard separation
- Intake UI = soft signal capture
- Matching = pure logic
- Recommendation = presentation
- Pre-screen = ratification
- Placement timeline = separate future surface

### Non-negotiable rule
Do NOT let design bleed into logic.
Do NOT let matcher files become UI design files.
Do NOT let UI components invent business logic that belongs in matching or routing.

### Bifurcation rule
UI should preserve narrative / decision bifurcation.
Use existing patient-intake design language already built in NRIN.
Do not create generic ChatGPT-looking forms.

### Boundary rule
- `buildPatientProfile.ts` = input boundary (intake -> matcher)
- `buildMatchViewModel.ts` = output boundary (matcher -> presentation)
- patient-facing components should render the contract, not reinvent the contract

---

## CURRENT MATCHER DOCTRINE

### Ranking layers
1. Hard filters
2. Viability / clinical fit
3. Financial plausibility
4. Specialty / support fit
5. Future preference tie-breakers

### Current truth
- Program scoring now uses primary-vs-secondary level weighting
- Insurance scoring now supports progressive certainty:
  - exact carrier match
  - likely private-insurance compatibility
  - self-pay / indigent fallback
- Explanation and presentation were updated to reflect the same certainty ladder
- Card pills now derive from the same strength/reason source as detail presentation
- Diversity pass exists in top returned matches to reduce same-city clustering near the top

### Important limitation
- True life-fit tie-breaks (island / mountain / music / yoga / privacy / etc.) are NOT yet honest to score
- current facility model does not expose structured signals for those preferences
- do not fake preference scoring until facility-side structured data exists

---

## CURRENT KNOWN ISSUES / NEXT LIKELY WORK

1. Preference tie-breaker layer is not built yet
- ties are still common when multiple facilities are clinically / financially similar
- next honest build target is a separate life-fit preference layer once structured facility signals exist

2. Reason-type normalization still needs to happen
- some presentation ordering still relies on label text
- future cleanup should replace string-matching with structured reason types / enums

3. `src/components/matching/*` is likely a future shared presentation bridge
- currently zero-byte stubs
- not active runtime
- do not delete casually
- do not wire into runtime without intentional extraction plan

4. Step 5 remains soft-signal only
- exact carrier capture still belongs in pre-screen ratification
- do not let Step 5 become a hard insurance gate

---

## CURRENT INSURANCE DOCTRINE

### Step 5
Soft / skippable
- insuranceStatus
- insuranceType
- selfPayIntent

### Match stage
Progressive certainty only
- exact carrier + facility evidence -> strong insurance signal
- private insurance without exact carrier -> likely compatibility only
- self-pay / indigent -> alternative funding path, not auto-fail

### Pre-screen
Hard gate before ratification
- confirm payment path for this specific placement
- if insurance: capture specific insurance type + carrier / plan name
- if self-pay: confirm
- if no insurance + no self-pay: switch to public-funding / indigent path

### Important distinction
- gatekeepers care about insurance first
- workers care about outcomes
- NRIN should separate money from care as much as possible, while still respecting real-world gatekeeping

---

## CURRENT FILES MOST LIKELY TO MATTER NEXT

### Patient flow
- `src/app/patient/page.tsx`
- `src/app/patient/matches/page.tsx`
- `src/app/patient/prescreen/page.tsx`
- `src/app/patient/confirmation/page.tsx`
- `src/app/patient/indigent-path/page.tsx`
- `src/app/patient/components/Step5LifeFit.tsx`
- `src/components/patient/MatchCardStack.tsx`
- `src/components/patient/MatchDetailSheet.tsx`

### Matcher layer
- `src/lib/matching/buildPatientProfile.ts`
- `src/lib/matching/scorePrograms.ts`
- `src/lib/matching/scoreInsurance.ts`
- `src/lib/matching/scoreSpecialties.ts`
- `src/lib/matching/scoreConfidence.ts`
- `src/lib/matching/buildMatchExplanation.ts`
- `src/lib/matching/buildMatchViewModel.ts`
- `src/lib/matching/matchPatientToFacilities.ts`
- `src/lib/matching/buildLifeFitProfile.ts`
- `src/lib/matching/fetchFacilityMatches.ts`
- `src/lib/matching/types.ts`

### Shared / future presentation bridge
- `src/components/matching/FacilityMatchCard.tsx`
- `src/components/matching/FacilityMatchDetailSheet.tsx`
- `src/components/matching/MatchDeck.tsx`
- `src/components/matching/MatchReasonList.tsx`
- `src/components/matching/MatchScorePill.tsx`

### Facility side
- `src/app/facility/referrals/page.tsx`
- `src/app/facility/referrals/[id]/page.tsx`
- `src/components/facility/ReferralDetailSheet.tsx`
- `src/components/facility/ReferralsClient.tsx`
- `src/app/facility/dashboard/page.tsx`
- `src/components/facility/FacilityDashboardClient.tsx`
- `src/components/facility/FacilityProfilePanel.tsx`
- `src/components/facility/FacilityOperationsPanel.tsx`
- `src/components/facility/FacilityVerificationPanel.tsx`

---

## NEXT PRIORITY TASK

### PRIMARY
Design and build honest life-fit tie-breakers only after structured facility-side preference signals exist.

Meaning:
- inspect current facility-side data for structured preference candidates
- decide what can be scored honestly
- keep viability separate from preference ordering
- do not fake island / mountain / music / yoga / privacy without facility evidence

### SECONDARY
Normalize reason types so UI ordering no longer depends on string matching.

### STABILITY CHECK
Before new feature work, preserve current working behavior:
- Step 5 insurance section renders
- skip / reopen behavior works
- top card pills mirror full relevant strengths
- detail sheet shows deeper evidence, not duplicate card framing
- insurance certainty ladder behaves correctly:
  - exact carrier -> exact acceptance label
  - broad insurance -> likely compatibility label

---

## EXECUTION RULES FOR NEW CHATS

1. Read this file first
2. Do not redesign the system
3. Do not assume missing context
4. Do one task at a time
5. Prefer surgical edits
6. Preserve doctrine
7. If something seems wrong, inspect before changing

---

## CHINESE MODE PROTOCOL (MANDATORY)

### Purpose
All code changes must be executed via terminal-driven, surgical edits.
No long-form pasted files unless explicitly requested.

This prevents:
- drift
- hallucinated rewrites
- broken context
- wasted time

---

### RULES

1. ALL edits must be delivered as terminal commands
   - Prefer python replace blocks or cat overwrite
   - No “paste this into your file manually”

2. SURGICAL FIRST
   - Replace only the exact block needed
   - Do not rewrite entire files unless necessary

3. VERIFY AFTER EVERY EDIT
   - Always include a grep command to confirm success

4. NO DUPLICATION
   - Do not create parallel logic
   - Do not leave dead code

5. NO ASSUMPTION EDITS
   - If unsure -> inspect first
   - Never guess structure

---

### ACCEPTABLE PATTERNS

#### Targeted replacement
python replace block with exact match

#### Full overwrite (only if necessary)
cat <<'EOF' > file

#### Verification
grep -n "signal" file

---

### UNACCEPTABLE PATTERNS

- dumping entire files casually
- “here’s the updated file” without command
- mixing explanation + code edits
- speculative rewrites

---

### EXECUTION STYLE

- minimal words
- precise commands
- no narration during edits
- explanation only if needed AFTER

---

### PHILOSOPHY

Chinese mode = discipline

You are not “writing code”
You are performing controlled surgery on a live system

Every edit must be:
- intentional
- minimal
- verifiable
