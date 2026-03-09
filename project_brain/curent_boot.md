NRIN — AI BOOT (Crawler + Matching Continuation Session)

You are joining the NRIN project.
You are the ACTIVE ENGINEERING AI for this session.
You are the RECEIVER of the handoff.
You are not preparing a new handoff unless David explicitly asks for one.
Do not tell David to open another AI.
Do not summarize the repo before reading the required files.
Do not rely on stale chat memory over GitHub.

Canonical engineering repo
https://github.com/davidduncan-wq/NRIN

Non-negotiable rules
GitHub is the canonical source of truth
NRIN is the canonical engineering repo
NRIN-demo is separate and may only be used for selective design borrowing
Prefer surgical edits over broad rewrites
Always give exact file paths
Always say where the action happens:
Terminal
VS Code
Browser → localhost
Browser → Supabase
GitHub

Before creating files in any folder, always inspect the target directory first with Terminal ls

Read these files directly from GitHub in this order
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/00_READ_ME_FIRST.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_PROJECT_INDEX.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_CANONICAL_STATE.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_ENGINEERING_HANDOFF.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_REPO_STRATEGY.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_SYSTEM_MAP.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_PRODUCT_ARCHITECTURE.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_DESIGN_SYSTEM.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_SURGICAL_EDIT_RULES.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_CURRENT_PRIORITIES.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NEXT_BUILD_TARGET.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_PRODUCT_VISION.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_MATCHING_PHILOSOPHY.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_FACILITY_ATTRIBUTE_SCHEMA.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_FACILITY_DASHBOARD_BLUEPRINT.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md
https://raw.githubusercontent.com/davidduncan-wq/NRIN/main/project_brain/CURRENT_HANDOFF.md

Current state you must understand before coding

1. Crawler v1 now exists in the repo.
Expected crawler files:
- src/crawler/crawlFacility.ts
- src/crawler/detectSignals.ts
- src/crawler/fetchPages.ts
- src/crawler/parseInsurance.ts
- src/crawler/parsePrograms.ts
- src/crawler/parseSynopsis.ts
- src/crawler/stripHtml.ts
- src/crawler/types.ts
- scripts/runFacilityCrawler.ts

2. Crawler v1 currently:
- uses a manual CLI runner
- writes schema-shaped JSON output to tmp/
- fetches candidate pages
- extracts insurance mentions
- extracts program clues
- captures evidence snippets
- drafts a synopsis
- surfaces schema gap signals

3. Important local environment note:
Node fetch had certificate issues locally.
Crawler fetching was switched to curl via execFile in fetchPages.ts.
Do not casually undo this without a deliberate replacement.

4. Soft-404 behavior was discovered and partially handled.
At least one real site returned:
- status 200
- title “404 Error - Page Not Found”
The crawler now filters soft-404 pages before extraction and records a schema gap signal for them.

5. Matching philosophy now clarified:
- match at the site level whenever possible
- organization-wide evidence is not the same as verified site truth
- crawler detections are candidate evidence, not final truth
- referral exchange exists, but is secondary to the match engine
- the patient lead has value, but referral trading must not override best-fit matching

6. Trust / integrity philosophy clarified:
- NRIN is invite-based, not open signup
- invited accredited TCs should begin in a trusted state
- early adopters must not be punished for NRIN calibration mistakes
- admin must be able to reset / override trust posture
- obvious anchor institutions may merit admin-recognized trust
- trust affects confidence, not raw capability truth

7. Match scoring direction established:
Use gated ranking:
- hard filters first
- weighted fit score second

Proposed weighted score:
- Clinical fit — 35
- Geography / modality fit — 20
- Insurance / financial fit — 20
- Availability / readiness fit — 15
- Population / nuance fit — 10

Then:
final_score = base_fit_score * confidence_multiplier * integrity_multiplier

8. Intake direction established conceptually:
Five buckets:
- Treatment Need
- Location / Modality
- Financial / Insurance
- Clinical Complexity
- Logistics / Preferences

Immediate task after boot
First inspect the repo and confirm the current crawler files and any matching-related folders.
Then propose the next smallest implementation step.
Likely next directions:
- insurance polarity in crawler output
- begin matching engine scaffolding under src/lib/matching/
But inspect before creating anything.

Boot confirmation format
After reading the required files, confirm in your own words:
- canonical repo
- current crawler state
- why curl is being used
- what soft-404 handling is doing
- how matching should work conceptually
- how trust / calibration should work
- what the next smallest build step should be

Then say exactly:
“I am the receiving AI for NRIN. I have read the required GitHub brain files and CURRENT_HANDOFF.md, and I am ready to continue the crawler and matching build.”