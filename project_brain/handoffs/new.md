NRIN — AI BOOT

You are joining the NRIN (National Recovery Intake Network) project.

The canonical repository is:
https://github.com/davidduncan-wq/NRIN

GitHub is the source of truth.

Before doing anything, read these files in this exact order:

project_brain/00_READ_ME_FIRST.md
project_brain/NRIN_PROJECT_INDEX.md
project_brain/NRIN_CANONICAL_STATE.md
project_brain/NRIN_SYSTEM_MAP.md
project_brain/NRIN_PRODUCT_ARCHITECTURE.md
project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md
project_brain/NRIN_SURGICAL_EDIT_RULES.md
project_brain/CURRENT_HANDOFF.md
project_brain/AI_SESSION_PROTOCOL.md

After reading them, confirm you understand the current system.

Current project phase:
Facility Intelligence Engine

Key systems already working:
- Patient intake flow
- Facility referral system
- Treatment center crawler
- Matching engine (hard filters + scoring)

Crawler status:
Navigation-aware crawler implemented.
It extracts program signals (detox, residential, PHP, IOP, outpatient, MAT, dual diagnosis) and insurance signals from treatment center websites.

Matching engine status:
Working and tested via scripts/testMatching.ts.

Immediate engineering task:
Improve crawler page-selection logic so the 5 crawled pages cover:
- clinical information
- insurance/admissions
- special capabilities (MAT/opioid)

Do NOT ask the user to paste files.
Read the files directly from GitHub.

After reading, report:
1. Your understanding of the NRIN system
2. The current crawler architecture
3. The next engineering step

We were working on improving crawler page selection logic.

***important***
the next two boots were because the browser failed and had to reboot to complete critical work without the AI reading the project_brain files. one describes the quick handoff and the second shows what was completed and its handoff is to be taken with the understanding that it was extrememly limited scope: get the url from supabase into a shape where they can be ingested by the NRIN machine. 



NRIN — CONTINUATION BOOT

Project: NRIN crawler

Repo:
https://github.com/davidduncan-wq/NRIN

Current task:
Repair Google domain resolver for remaining facilities.

Current state:
- 5378 facilities verified
- 2076 redirects normalized
- 276 broken domains isolated
- 184 facilities in Google repair queue

Key script:
scripts/url/resolveMissingFacilityDomains.ts

Issue just fixed:
QueueRow type mismatch (google_query / city removed)

Current Google API status:
Custom Search API enabled
.env variables verified
Google propagation pending

Next task:
Run the resolver batch once API returns 200/429.

Command:

cd ~/Desktop/NRIN
npx tsx scripts/url/resolveMissingFacilityDomains.ts

"NRIN boot — continue crawler repair."

NRIN — AI BOOT (Canonical + Supplemental)
You are joining the NRIN project.
The canonical repository is:
https://github.com/davidduncan-wq/NRIN
GitHub is the source of truth.
Before doing anything, read the canonical project brain in this order:
project_brain/NRIN_PROJECT_INDEX.md
project_brain/NRIN_CANONICAL_STATE.md
project_brain/NRIN_SYSTEM_MAP.md
project_brain/NRIN_SURGICAL_EDIT_RULES.md
project_brain/CURRENT_HANDOFF.md
project_brain/NRIN_PRODUCT_ARCHITECTURE.md
After reading the canonical brain, also read the supplemental handoff for today's work:
project_brain/handoffs/NRIN_HANDOFF_2026-03-11_WEBSITE_REPAIR_SUPPLEMENT.md
Important:
The supplemental handoff is narrow in scope and covers only website/domain repair work used to improve crawler landing vectors.
It does not redefine the architecture or matching system.
After reading both:
Confirm you have loaded the canonical brain.
Confirm you have read the supplemental handoff.
Then proceed with the next engineering task.
Do not ask the user to paste these files.
Read them directly from the repository.
Why this works well
This ensures:
Canonical brain
      ↓
Current handoff
      ↓
Today's supplemental work
      ↓
Next engineering task
Which prevents exactly the problem you caught earlier — an AI jumping into architecture decisions without seeing the full project brain.