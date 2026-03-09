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