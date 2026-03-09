# NRIN — CURRENT HANDOFF
Date: 2026-03-08
Session: Crawler Build + Matching Model
Status: ACTIVE CANONICAL HANDOFF

## 1. Canonical Repo
Canonical engineering repo:
`https://github.com/davidduncan-wq/NRIN`

GitHub is the source of truth.
NRIN is canonical.
NRIN-demo is separate and may only be used for selective design borrowing.

## 2. What Was Completed This Session

### 2.1 Crawler v1 was created
A first local/manual crawler slice now exists.

Created folders:
- `src/crawler/`
- `scripts/`

Created files:
- `src/crawler/crawlFacility.ts`
- `src/crawler/detectSignals.ts`
- `src/crawler/fetchPages.ts`
- `src/crawler/parseInsurance.ts`
- `src/crawler/parsePrograms.ts`
- `src/crawler/parseSynopsis.ts`
- `src/crawler/stripHtml.ts`
- `src/crawler/types.ts`
- `scripts/runFacilityCrawler.ts`

### 2.2 Crawler v1 current behavior
Crawler v1 currently:
- fetches a small candidate page set
- strips HTML to text
- extracts insurance mentions
- extracts program clues
- captures evidence snippets
- generates a short synopsis draft
- writes schema-shaped JSON output to `tmp/`

Current candidate paths:
- `/`
- `/about`
- `/admissions`
- `/insurance`
- `/programs`

### 2.3 Important environment finding
Node `fetch()` was failing locally because of certificate issues:
- `unable to get local issuer certificate`

To unblock progress, `fetchPages.ts` was changed to use `curl` via `execFile`.
This is intentional for now and was the correct local workaround for Crawler v1.

### 2.4 Crawler output contract
Crawler work is governed by:
- `project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md`

Key principle:
The crawler is not final truth.
It preserves:
- raw source text
- normalized detection
- evidence snippets
- schema-gap signals
- draft synopsis

It must remain separate from:
- facility override
- admin verification

### 2.5 Soft-404 handling added
A real issue appeared on Hazelden Betty Ford:
- `/programs` returned HTTP 200
- title was `404 Error - Page Not Found`

This revealed the need to detect soft-404 pages by title/content, not just status code.

`crawlFacility.ts` now:
- filters unusable pages before extraction
- excludes soft-404 pages from signal extraction
- adds schema gap signal:
  - `One or more sampled pages appear to be soft-404 pages`

### 2.6 Evidence quality improved
`detectSignals.ts` was improved to:
- use sentence-style snippets instead of crude character windows
- normalize snippets for stronger deduping

This sharply reduced inflated evidence counts.

### 2.7 Program parsing refined
`parsePrograms.ts` was tightened:
- weak `op` regex based on bare `\bop\b` was removed
- only `outpatient program` remains for `op`
- discussion strongly suggests `op` may be removed entirely in a future pass

### 2.8 Insurance parsing refined
Insurance evidence now clearly surfaces meaningful mentions.
A likely next step is insurance polarity:
- accepted
- not accepted
- mentioned/unknown

This came up because Hazelden evidence included lines like:
- `We do not accept Medicare or Medicaid`

So raw mention alone is not enough.

## 3. Real Test Results

### 3.1 Example.com
Used as a fetch sanity check.
Result:
- crawler worked
- pages fetched
- no treatment signals, as expected

### 3.2 Hazelden Betty Ford
Command used:
`npx tsx scripts/runFacilityCrawler.ts --facilityId hazelden --url https://www.hazeldenbettyford.org`

Result:
- real pages fetched successfully
- insurance detections fired
- program detections fired
- synopsis drafted
- soft-404 flagged

This validated the first real crawler slice.

## 4. Matching / Marketplace Thinking Reached This Session

This session moved beyond crawler mechanics and clarified important NRIN matching philosophy.

### 4.1 Matching should happen at the site level
Critical realization:
Organization-level marketing language is not enough for precise placement.

NRIN must distinguish:
- organization
- facility site
- program / qualifier scope

Examples discussed:
- BFC may offer broad network capability
- Rancho Mirage, Minneapolis, Los Angeles, San Diego, and virtual may all differ materially
- broad organization claims should not automatically become site truth

### 4.2 Crawler detections are candidate evidence, not verified truth
This is especially important for multi-site organizations.

### 4.3 Referral exchange / patient arbitrage
Discussion recognized that treatment centers already operate an informal referral-trading ecosystem.

NRIN should not pretend this does not exist.
But it should not become the centerpiece.

Canonical understanding:
- the patient lead has value
- pre-screen work has value
- referral exchange is a contained secondary layer
- the matching engine remains primary

### 4.4 Matching engine principle
The match engine should be the primary authority.

Referral exchange:
- may happen when a facility cannot accept
- must not override or hide the best-fit ranked results

### 4.5 Facility gaming / integrity
NRIN needs a market integrity layer eventually, but this is support infrastructure, not the centerpiece.

Facilities may game:
- availability tags
- insurance claims
- broad capability tags
- lead harvesting behavior

The system should detect patterns, but early adopters must not be unfairly punished during calibration.

### 4.6 Trust model shift
Important strategic conclusion:
Since NRIN is not open signup and invited TCs are already known / accredited, all invited facilities should begin in a trusted state.

They should be downgraded only if necessary.

There must also be:
- manual admin override
- reset capability
- calibration mode / grace logic
- no harsh automated punishment during early system kinks

This matters because early adopters should not be penalized for NRIN immaturity.

### 4.7 Flagship / anchor institutions
Important nuance discussed:
Some institutions like Kaiser / Hazelden / Betty Ford / other obvious anchor systems may deserve manual admin recognition.

But trust must remain separate from capability truth.

Admin trust override can increase confidence in ambiguous organization-level claims.
It must not fabricate site-specific clinical facts.

## 5. Match Scoring Model Reached This Session

A first clear scoring philosophy was established.

### 5.1 Use gated ranking, not one fuzzy score
Step 1:
Hard filters exclude places that cannot take the patient.

Step 2:
Rank remaining places by fit.

### 5.2 Proposed weighted score
100-point model:

- Clinical fit — 35
- Geography / modality fit — 20
- Insurance / financial fit — 20
- Availability / readiness fit — 15
- Population / nuance fit — 10

Then:

`final_score = base_fit_score * confidence_multiplier * integrity_multiplier`

### 5.3 Confidence multiplier
Confidence reflects evidence quality / specificity:
- admin verified
- facility confirmed
- strong site-specific crawler evidence
- organization-level crawler evidence
- weak ambiguous marketing language

### 5.4 Integrity multiplier
Integrity reflects observed behavior and eventually admin trust posture.
However, during early rollout, this must be handled cautiously with resets / calibration.

## 6. Patient Intake Direction Reached This Session

A v1 intake feature vector was defined conceptually.

Intake should be short and oriented toward matching, not full clinical assessment.

Five buckets:
1. Treatment Need
2. Location / Modality
3. Financial / Insurance
4. Clinical Complexity
5. Logistics / Preferences

This was discussed conceptually only.
No matching engine files were built yet.

## 7. Immediate Next Build Priorities

Priority order:

### 7.1 Preserve this session’s thinking in the brain
A new AI session should understand:
- crawler v1 state
- matching scoring direction
- trust / calibration philosophy
- multi-site / flagship problem
- referral exchange is secondary, not primary

### 7.2 Likely next code step on crawler
Most likely next crawler refinements:
- add insurance polarity (`accepted` / `not_accepted` / `mentioned`)
- consider removing `op` entirely
- expand candidate paths beyond current five
- add scope / qualifier ideas later (`organization_wide`, `site_specific`, `virtual`, etc.)

### 7.3 Matching engine implementation
Next major engineering build should likely begin:
- `src/lib/matching/types.ts`
- `src/lib/matching/hardFilters.ts`
- `src/lib/matching/scoreMatch.ts`

But do not build broad architecture blindly.
First read the brain files and honor the current repo strategy.

## 8. Read Order for Any New AI Session

Any new AI session should read these in this order:

1. `project_brain/00_READ_ME_FIRST.md`
2. `project_brain/NRIN_PROJECT_INDEX.md`
3. `project_brain/NRIN_CANONICAL_STATE.md`
4. `project_brain/NRIN_ENGINEERING_HANDOFF.md`
5. `project_brain/NRIN_REPO_STRATEGY.md`
6. `project_brain/NRIN_SYSTEM_MAP.md`
7. `project_brain/NRIN_PRODUCT_ARCHITECTURE.md`
8. `project_brain/NRIN_DESIGN_SYSTEM.md`
9. `project_brain/NRIN_SURGICAL_EDIT_RULES.md`
10. `project_brain/NRIN_CURRENT_PRIORITIES.md`
11. `project_brain/NEXT_BUILD_TARGET.md`
12. `project_brain/NRIN_PRODUCT_VISION.md`
13. `project_brain/NRIN_MATCHING_PHILOSOPHY.md`
14. `project_brain/NRIN_FACILITY_ATTRIBUTE_SCHEMA.md`
15. `project_brain/NRIN_FACILITY_DASHBOARD_BLUEPRINT.md`
16. `project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md`
17. `project_brain/CURRENT_HANDOFF.md`

## 9. Operational Rules for the Next AI
The next AI must:
- treat GitHub as canonical
- treat NRIN as canonical repo
- not prepare a new handoff unless explicitly asked
- inspect directories before creating new folders/files
- prefer surgical edits
- always give exact file paths
- always label actions by location:
  - Terminal
  - VS Code
  - Browser → localhost
  - Browser → Supabase
  - GitHub

## 10. Summary
This session successfully produced a real Crawler v1 slice and clarified the initial scoring / trust / referral-exchange philosophy needed for NRIN matching.

The crawler is now real.
The matching engine philosophy is now much clearer.
The next session should preserve these decisions and continue deliberately.