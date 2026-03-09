NRIN — AI BOOT + ENGINEERING HANDOFF
Session Stop: 03-09-2026 • Crawler Intelligence Phase
0. Canonical Repository
Repo:
https://github.com/davidduncan-wq/NRIN
Local machine path:
~/Desktop/nrin
Stack:
Next.js 16
TypeScript
Supabase
Tailwind
Node crawler utilities
Crawler execution environment:
tsx
curl
node
Primary directories:
src/
scripts/
project_brain/
tmp/
1. Brain Files (MUST READ FIRST)
Any new AI session must read these in this order:
project_brain/00_READ_ME_FIRST.md
project_brain/NRIN_PROJECT_INDEX.md
project_brain/NRIN_CANONICAL_STATE.md
project_brain/NRIN_SYSTEM_MAP.md
project_brain/NRIN_PRODUCT_ARCHITECTURE.md
project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md
project_brain/NRIN_SURGICAL_EDIT_RULES.md
project_brain/CURRENT_HANDOFF.md
project_brain/AI_SESSION_PROTOCOL.md
Purpose:
File	Role
READ_ME_FIRST	orientation
PROJECT_INDEX	master file map
CANONICAL_STATE	current product definition
SYSTEM_MAP	system architecture
PRODUCT_ARCHITECTURE	intake + routing logic
CRAWLER_RESULT_SCHEMA	crawler JSON schema
SURGICAL_EDIT_RULES	code editing discipline
CURRENT_HANDOFF	most recent engineering context
AI_SESSION_PROTOCOL	how AI sessions behave
2. NRIN Core Concept
NRIN = National Recovery Intake Network
Purpose:
Create a national routing engine that matches addiction treatment patients to facilities based on:
clinical need
level of care
insurance signals
program capability
location constraints
The platform solves:
treatment lead misrouting
insurance uncertainty
admissions inefficiency
treatment center under-utilization
3. System Components
NRIN has three core engines.
1️⃣ Patient Intake Engine
Collects:
substance
detox need
level of care
insurance
location
co-occurring disorders
UI path:
src/app/patient/
2️⃣ Facility Intelligence Engine
Builds facility capability profiles using:
crawler
signal detection
facility onboarding
3️⃣ Matching Engine
Matches patients to facilities using:
hard filters
scoring
signal weighting
Location:
src/lib/matching/
4. Matching Engine (Working)
Matching logic is already implemented.
Files:
src/lib/matching/
Example output:
hardFilter: passed / failed
score:
  levelMatchScore
  detoxScore
  dualDiagnosisScore
  totalScore
Test script:
scripts/testMatching.ts
Run:
npx tsx scripts/testMatching.ts
Example output confirmed:
Hazelden-like facility → score 100
Oasis-like facility → filtered (no detox)
Outpatient-only → filtered
Meaning:
The clinical routing engine works.
5. Crawler Architecture
Crawler extracts structured facility signals from public websites.
Location:
src/crawler/
Core modules:
fetchPages.ts
parsePrograms.ts
parseInsurance.ts
parseSynopsis.ts
detectSignals.ts
stripHtml.ts
types.ts
6. Crawler Result Schema
Defined in:
project_brain/NRIN_CRAWLER_RESULT_SCHEMA.md
Each crawl produces:
CrawlFacilityResult
Example fields:
pages
insuranceDetections
programDetections
synopsisDraft
schemaGapSignals
Example output file:
tmp/crawler-result-<facility>.json
7. Batch Crawler
Script:
scripts/runFacilityCrawlerBatch.ts
Input:
tmp/crawler-batch-input.json
Run:
npx tsx scripts/runFacilityCrawlerBatch.ts --input tmp/crawler-batch-input.json
Output:
tmp/crawler-batch-summary.json
8. Phase Zero Crawler Test (Completed)
Initial crawl test:
39 treatment centers
Results:
content_detected: 20
soft_404_present: 14
security_block: 1
dns_failure: 2
fetch_failure: 1
no_structured_signals: 1
with_program_detections: 34
with_insurance_detections: 17
This validated:
signal detection works
program detection works
insurance detection works
9. Major Crawler Upgrade (This Session)
Originally crawler used static page guesses:
/
about
admissions
insurance
programs
Problem:
Many modern treatment center sites use deep navigation structures.
Example:
/rehab-treatment/outpatient-treatment
or
/our-services/intensive-outpatient-program
So we upgraded crawler intelligence.
10. New Crawler Behavior
Crawler now:
Step 1
Fetch homepage HTML.
Step 2
Extract internal links.
Step 3
Score links using keyword signals.
Example keywords:
detox
treatment
program
residential
outpatient
dual diagnosis
opioid
suboxone
vivitrol
taper
insurance
verify insurance
admissions
Step 4
Choose best candidate pages.
Crawler now selects pages like:
outpatient-treatment
detox
dual-diagnosis
verify-insurance
instead of guessing.
11. Validation Example
Hazelden crawl produced:
/rehab-treatment/outpatient-treatment
/rehab-treatment/detox
/faqs-programs-services (MAT page)
/insurance
/admissions
This successfully surfaced:
MAT signals
detox
residential
insurance
Meaning crawler discovered hidden treatment pages.
12. Signal Detection
Crawler extracts:
Programs
detox
residential
outpatient
php
iop
dual diagnosis
mat
sober living
family program
Insurance
Examples detected:
aetna
cigna
blue cross blue shield
humana
medicare
medicaid
anthem
beacon
13. Important Insight From This Session
Insurance acceptance cannot be assumed even for accredited facilities.
Correct architecture:
Crawler → detects insurance signals
Facility onboarding → confirms payer truth
Admissions verification → patient-specific eligibility
14. Important Signal Added
MAT detection added:
medication assisted treatment
mat
suboxone
buprenorphine
vivitrol
naltrexone
This is critical for:
opioid recovery
kratom addiction
harm reduction
taper programs
15. Current Crawler Status
Crawler can now reliably detect:
levels of care
dual diagnosis
MAT
insurance mentions
This is enough to power v1 facility intelligence.
16. Remaining Crawler Problem
Page selection logic can still be improved.
Current model:
discover links
score them
select top pages
But we want information coverage, not just top score.
We discussed bucket coverage.
17. Future Crawler Selection Model
Crawler should ensure coverage of information buckets.
Buckets:
Clinical
detox
residential
iop
php
outpatient
Financial
insurance
verify insurance
admissions
Specialty
MAT
opioid treatment
dual diagnosis
Crawler should:
discover links
score them
ensure bucket coverage
fill missing buckets with fallback paths
18. Immediate Next Engineering Tasks
Next development steps:
1️⃣ Improve page selection logic
Modify crawler to ensure coverage of:
clinical bucket
insurance bucket
special capability bucket
2️⃣ Increase crawl scale
Run crawler on:
100 facilities
Evaluate signal extraction.
3️⃣ Build facility intelligence table
Create Supabase table:
facility_capabilities
Fields:
facility_id
detox
residential
php
iop
outpatient
dual_diagnosis
mat
insurance_signals
crawler_synopsis
4️⃣ Pipe crawler output into Supabase
Create script:
scripts/importCrawlerResults.ts
5️⃣ Connect crawler signals to matching engine
Use detected signals as facility attributes.
19. Future NRIN Intelligence Layer
Eventually crawler will also detect:
gender restrictions
bed count
special populations
age ranges
veteran programs
But not needed yet.
20. Strategic Principle
We do not need perfect data.
We need enough signal to route intelligently.
Facilities will later confirm truth during onboarding.
Crawler just builds initial intelligence.
21. Command Reference
Crawler single facility:
npx tsx scripts/runFacilityCrawler.ts \
--facilityId "sierra-tucson" \
--url "https://www.sierratucson.com"
Batch crawl:
npx tsx scripts/runFacilityCrawlerBatch.ts \
--input tmp/crawler-batch-input.json
Matching test:
npx tsx scripts/testMatching.ts
22. State of the Project
What works:
patient intake flow
facility referral system
crawler
matching engine
What is next:
facility intelligence layer
routing optimization
insurance signal logic
23. Immediate First Task For Next AI Session
Open:
src/crawler/fetchPages.ts
Implement bucket-coverage page selection.
Goal:
5 pages that cover
clinical
insurance
special capabilities
Then run:
crawl 50 facilities
Evaluate improvement.
End Handoff
NRIN Development Phase:
Facility Intelligence Engine
System Status:
Stable
Crawler operational
Matching engine validated
Ready for scale testing
