NRIN ENGINEERING HANDOFF
Post–Facility Intelligence Boot
Project
NRIN — National Recovery Intelligence Network
Mission:
Create an intelligent routing system that matches patients to treatment facilities based on actual program capability and insurance compatibility, using a curated universe of accredited facilities.
NRIN does not attempt to discover treatment centers dynamically.
The facility universe is curated and fixed.
Current System State (After Successful DB Boot)
Facility Universe
Table	Purpose	Count
facility_sites	canonical accredited facility registry	5378
facility_seeds	crawl targets (verified URLs)	~4890
facility_crawl_results	raw crawler output	~4890
facility_intelligence	normalized matcher-ready facility capabilities	~4890
Boot process completed successfully.
The system now contains a fully populated national treatment center intelligence database.
Architectural Philosophy
NRIN does not crawl per patient.
Instead:
Curated Facilities
        ↓
Crawler Boot
        ↓
Facility Intelligence DB
        ↓
Patient Matching Engine
This ensures:
• fast patient response times
• deterministic matching
• explainable facility capability profiles
• stable infrastructure
Facility Intelligence Model
facility_intelligence is the canonical matching layer.
Key fields:
facility_site_id
confidence_score

offers_detox
offers_residential
offers_php
offers_iop
offers_outpatient
offers_aftercare

dual_diagnosis_support
mat_supported
sober_living_transition

family_therapy_program
professional_program

accepts_medicaid_detected
accepts_medicare_detected
accepts_private_insurance_detected
accepts_self_pay_detected

accepted_insurance_providers_detected

detected_program_types
detected_insurance_carriers

matcher_summary
schema_gap_signals
These fields represent facility capabilities, not marketing language.
Confidence Model
Confidence score range: 0–100
Calculated from:
20 base score

+ program detections
+ insurance detections
+ structured synopsis presence
+ schema completeness
The score represents confidence in crawler interpretation, not quality of the facility.
Known Detection Patterns
Programs currently detected:
detox
residential
php
iop
outpatient
dual_diagnosis
mat
sober_living
family_program
professional_track
Insurance carriers detected include:
aetna
cigna
blue_cross_blue_shield
united_healthcare
humana
anthem
ambetter
molina
beacon
tricare
medicare
medicaid
self_pay
Important Design Constraint
NRIN must not attempt to discover treatment centers automatically.
The universe is defined by:
facility_sites
which comes from accredited registries.
Crawler responsibility:
determine capability
determine program availability
detect insurance compatibility
not facility discovery.
Database Relationships
facility_sites
     │
     │ 1:1
     │
facility_seeds
     │
     │ 1:many crawl attempts
     │
facility_crawl_results
     │
     │ normalized
     │
facility_intelligence
facility_site_id is the canonical identity key.
Infrastructure Now Complete
These pieces now exist and are operational:
Domain verification layer
tmp/domain_verification_results.csv
Crawl pipeline
crawlFacilitySeeds.ts
Program detection
parsePrograms.ts
Insurance detection
parseInsurance.ts
Content extraction
stripHtml.ts
extractInternalLinks.ts
scoreCandidateLinks.ts
Synopsis generation
parseSynopsis.ts
Next Phase of NRIN
Now that the facility intelligence database exists, the system moves to its most important component:
Patient Matching Engine
The goal:
Given a patient profile, identify viable treatment facilities.
Patient Matching Inputs
Example patient intake profile:
needs_detox
needs_residential
dual_diagnosis_required
insurance_provider
state
gender_specific
professional_program_needed
family_program_desired
Example patient:
needs_detox: true
needs_residential: true
dual_diagnosis: true
insurance: blue cross
state: california
Matching Algorithm Concept
Pseudo logic:
select facilities
where

offers_detox = true
AND offers_residential = true
AND dual_diagnosis_support = true
AND accepts_private_insurance_detected = true
Ranking then uses:
confidence_score
insurance match
program completeness
distance
Required New Components
The next engineering phase should build:
1️⃣ Matching Engine Query Layer
Create a matching query service:
/src/matching/matchPatientToFacilities.ts
Responsibilities:
• filter facilities by required capabilities
• filter by insurance compatibility
• rank results
• return match list
2️⃣ Patient Intake Schema
Define a canonical patient intake object:
PatientNeedsProfile
Example:
needs_detox
needs_residential
needs_php
needs_iop
needs_outpatient

dual_diagnosis_required
mat_required

insurance_provider

state
city

professional_program
family_program
3️⃣ Match Ranking Model
Initial ranking factors:
program match completeness
insurance compatibility
confidence_score
Later additions:
distance
bed availability
facility ratings
patient demographics
4️⃣ Matching Debug Output
The system must return explainable matches.
Example output:
Match Score: 87

Reasons:
✓ detox available
✓ residential available
✓ dual diagnosis supported
✓ accepts BCBS
✓ high crawler confidence
This transparency is important.
Future Facility Control Panel
Facilities will eventually have a portal allowing them to override:
program availability
insurance acceptance
bed availability
specialty tracks
These overrides should write directly into:
facility_intelligence
as authoritative overrides.
Known Imperfections to Improve Later
Minor crawler false positives may exist in:
professional_program
mat_supported
These should be audited but do not block matching engine development.
Repository Layout (Important Files)
Crawler:
src/crawler/
Matching engine will live in:
src/matching/
Scripts:
scripts/url/
Data:
data/joint_commission_facilities.csv
Operational Status
System health:
facility_sites           ~5378
facility_seeds           ~4890
facility_crawl_results   ~4890
facility_intelligence    ~4890
Crawler boot completed successfully.
Immediate Next Engineering Goal
Build the first working patient-to-facility matching engine.
Focus exclusively on:
facility_intelligence
as the capability source.
First Deliverable
Create a working function:
matchPatientToFacilities(patientProfile)
Return:
ranked facility matches
match reasoning
confidence scores
Closing Notes
This session successfully:
• repaired crawler drift
• reconstructed seed universe
• normalized facility capabilities
• booted the national facility intelligence database
This is the foundational dataset NRIN requires.
The next phase unlocks the core mission:
intelligent patient → treatment center routing.

NRIN — ENGINEERING HANDOFF
Stop 03.09.26 • Facility Intelligence Engine / Crawler Deepening
Canonical repo:
https://github.com/davidduncan-wq/NRIN
Branch:
main
Source of truth:
GitHub, not chat.
What was accomplished this session
Crawler architecture materially improved
The crawler is no longer just homepage-link selection plus fetch.
It now includes:
fallback candidate seeding
fallback candidate demotion
weak fallback pruning after fetch
second-pass fetched-content scoring
bucket-preserving final selection
second-hop discovery from top homepage candidates
professional_track detection added to parsePrograms
Best current crawler shape
Current intended operating shape:
fetch homepage
extract homepage candidate links
fetch top 2 second-hop seed pages
extract additional candidate links from those seed pages
merge discovered + fallback candidate links
shortlist preliminary pages
fetch shortlisted pages
prune weak fallback pages
content-score fetched pages
preserve bucket coverage in final selection
keep final selected pages disciplined
Important configuration state
The good state is:
MAX_SELECTED_PAGES = 5
MAX_PRELIMINARY_PAGES = 12
Important:
Earlier experimentation with keeping 8 final pages produced more noise.
Final kept pages should remain 5.
Preliminary shortlist can remain wider.
Program parser expanded
File:
src/crawler/parsePrograms.ts
Added:
professional_track
This is now part of PROGRAM_PATTERNS.
detectSignals.ts was rewritten
File:
src/crawler/detectSignals.ts
This file is now a clean signal/evidence helper file.
Important architectural note:
The active program detection logic still lives in parsePrograms.ts.
Do not confuse detectSignals.ts with the primary emitted program parser.
Batch test outcome at best current state
Most important stable metrics achieved:
attempted: 39
content_detected: 33
soft_404_present: 1
security_block: 1
dns_failure: 2
fetch_failure: 1
no_structured_signals: 1
with_program_detections: 34
with_insurance_detections: 20
Program-answer rate:
34 / 39 = 87.2%
This is currently the meaningful benchmark.
Important conclusions from this session
Two-pass scoring is correct
The fetched-content scoring idea is good and should remain.
Bucket preservation was necessary
Without bucket preservation in pass two, the crawler over-favored dense clinical pages and insurance detections fell from 20 to 15.
Bucket-preserving final selection restored insurance coverage back to 20.
Two-hop discovery helped
Homepage-only discovery was leaving deeper specialty pages unfetched.
Second-hop discovery improved page richness and specialty reach.
Increasing final kept pages to 8 was not the right long-term answer
It improved reach but also reintroduced junk/noise.
The right balance is:
wide preliminary shortlist
disciplined final 5
Professional-track detection belongs in parsePrograms.ts
Not in some imagined extraction file.
The real active crawler file layout is now confirmed.
Confirmed real crawler file structure
src/crawler/crawlFacility.ts
src/crawler/detectSignals.ts
src/crawler/extractInteralLinks.ts
src/crawler/fetchPages.ts
src/crawler/parseInsurance.ts
src/crawler/parsePrograms.ts
src/crawler/parseSynopsis.ts
src/crawler/scoreCandidateLinks.ts
src/crawler/stripHtml.ts
src/crawler/types.ts
scripts:
scripts/runFacilityCrawler.ts
scripts/runFacilityCrawlerBatch.ts
scripts/testMatching.ts
Files touched / most relevant this session
src/crawler/fetchPages.ts
This is the main center of gravity for this session.
It now contains:
homepage candidate extraction
second-hop seed fetch from top homepage candidates
mergeCandidateLinks(...groups)
fallback candidate building
preliminary shortlist selection
weak fallback pruning
fetched-content scoring
computeFinalFetchedScore(...)
bucket-preserving selectBestFetchedPages(...)
Critical intention:
Keep final selected pages at 5.
Keep preliminary shortlist wider.
Keep second-hop discovery.
src/crawler/parsePrograms.ts
Added:
professional_track pattern block
src/crawler/detectSignals.ts
Rewritten into a clean helper/evidence file.
Known good current crawler doctrine
Keep:
MAX_SELECTED_PAGES = 5
MAX_PRELIMINARY_PAGES = 12
second-hop discovery
fallback seeding
fallback demotion
weak fallback pruning
content scoring
bucket-preserving final selection
professional_track in parsePrograms
Do not revert:
second-pass scoring
second-hop discovery
bucket-preserving final selection
Do not “solve” by:
raising final selected pages to 8 or 10
removing discipline and brute-forcing page count
splitting into a parallel crawler 2.0 codepath
Best current interpretation of system quality
The crawler is now:
substantially better than homepage-only
substantially cleaner than the naive fallback version
materially closer to production-grade facility intelligence
It is not perfect.
But it is good enough to keep as the best current baseline.
Remaining weaknesses / next best engineering slice
Negative scoring for junk/legal/policy pages still needs refinement
Examples seen:
opt-out-sell-policy
blog pages
category pages
virtual-treatment-screener
some generic location pages
Next best small improvement:
Add stronger pass-two negative scoring for:
privacy
policy
terms
opt-out
blog
category
news
tag/archive-like pages
screener/quiz pages when not clinically useful
Professional-track detection should be validated on known domains
Examples likely worth spot-checking:
Caron
Hazelden Betty Ford
Cirque Lodge
Promises
Capistrano / executive-style pages
Next cheap high-value program signals to add in parsePrograms.ts
Likely next additions:
trauma_ptsd_track
veterans_military_track
gender_specific_track (women / men)
adolescent_young_adult_track
Longer-term major gain
A future high-value improvement would be more structured two-hop / depth-2 crawling discipline:
homepage -> programs page -> deeper specialty pages
Current second-hop is a pragmatic first version, not yet a full graph-based crawler.
Sanity check commands
Compile:
cd ~/Desktop/NRIN
npx tsc --noEmit
40-site batch:
cd ~/Desktop/NRIN
npx tsx scripts/runFacilityCrawlerBatch.ts --input tmp/crawler-batch-input-40.json
Single facility:
cd ~/Desktop/NRIN
npx tsx scripts/runFacilityCrawler.ts --facilityId "caron-treatment" --url "https://www.caron.org"
Professional track grep example:
grep -i "professional_track|executive program|physician program|professionals program" tmp/crawler-result-caron-treatment.json
Recommended immediate next step for next session
Confirm fetchPages.ts still has:
MAX_SELECTED_PAGES = 5
MAX_PRELIMINARY_PAGES = 12
Run:
npx tsc --noEmit
Run:
npx tsx scripts/runFacilityCrawlerBatch.ts --input tmp/crawler-batch-input-40.json
Add pass-two negative scoring penalties for:
blog
policy
privacy
terms
opt-out
category
news
screener
archive/tag-like pages
Re-run 40-site batch and compare against this benchmark:
content_detected: 33
soft_404_present: 1
with_program_detections: 34
with_insurance_detections: 20