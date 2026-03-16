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