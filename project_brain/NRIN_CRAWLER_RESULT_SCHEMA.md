NRIN Crawler Result Schema
Purpose
This document defines the canonical schema for data produced by the NRIN facility crawler.
The crawler does not directly replace facility data.
Instead, it produces:
raw extracted evidence
normalized candidate values
AI-drafted summaries
confidence signals
crawl metadata
schema-gap observations
This schema supports:
facility profile enrichment
insurance detection
synopsis drafting
later facility override
admin verification
crawl findings digests
This document maps to:
NRIN_FACILITY_ATTRIBUTE_SCHEMA.md
NRIN_MATCHING_PHILOSOPHY.md
NRIN_FACILITY_DASHBOARD_BLUEPRINT.md
Design Principle
Crawler output must preserve the difference between:
what the website literally says
what NRIN inferred
what the facility later edits
what admin later verifies
Crawler output is therefore evidence-first, not truth-first.
Core Crawl Record
Each crawl run should create a crawl record.
crawl_id
facility_id
root_url
crawl_started_at
crawl_completed_at
crawl_status
crawl_error_message
pages_crawled_count
Allowed crawl_status values
queued
running
completed
partial
failed
Crawled Pages
Each crawled page should be recorded separately.
crawl_page_id
crawl_id
facility_id
page_url
page_type
page_title
http_status
content_hash
raw_text_excerpt
full_text_storage_ref
was_parsed_successfully
Suggested page_type values
homepage
about
admissions
insurance
programs
detox
faq
contact
specialties
location
other
Extraction Evidence
Every extracted claim should store source evidence.
extraction_id
crawl_id
facility_id
field_name
raw_value
normalized_value
confidence_score
source_url
source_page_type
source_excerpt
extraction_method
created_at
Suggested extraction_method values
rule_based
llm_extraction
hybrid
manual
Confidence guidance
0.0 to 1.0
Interpretation:
0.90+ = strong explicit evidence
0.70–0.89 = likely
0.40–0.69 = weak / ambiguous
<0.40 = do not trust without review
Insurance Extraction
Insurance data should be stored in two layers.
1. Raw detected insurance mentions
insurance_detection_id
crawl_id
facility_id
payer_name_raw
payer_name_normalized
insurance_type
confidence_score
source_url
source_excerpt
Suggested insurance_type values
medicaid
medicare
private
self_pay
financing
tricare
va
unknown
2. Facility-level insurance summary candidates
These are candidate flags generated from the detections.
facility_id
detected_accepts_medicaid
detected_accepts_private_insurance
detected_accepts_self_pay
detected_insurance_summary
insurance_detection_count
insurance_last_crawled_at
Important:
Crawler-generated insurance values are candidate values, not final truth.
Patient-facing insurance data should later follow precedence:
admin_verified
→ facility_confirmed
→ crawler_detected
Summary / Synopsis Extraction
The crawler should generate both raw and drafted summary data.
Raw marketing/source text
facility_id
summary_source_urls
website_raw_copy
website_raw_copy_excerpt
summary_last_crawled_at
AI-drafted summaries
facility_id
ai_summary_short
ai_summary_long
ai_summary_style
ai_summary_confidence
summary_generation_model
summary_generated_at
Suggested ai_summary_style values
neutral
patient_facing
internal
matching_support
Important:
AI summaries must remain editable later by:
facility override
admin override
Program-Level Detections
Crawler should detect candidate program offerings.
facility_id
detected_offers_detox
detected_offers_residential
detected_offers_php
detected_offers_iop
detected_offers_outpatient
detected_offers_aftercare
detected_program_notes
programs_last_crawled_at
Specialty / Population Detections
Crawler should detect candidate specialties and populations served.
facility_id
detected_dual_diagnosis_support
detected_trauma_informed_care
detected_mat_supported
detected_chronic_relapse_program

detected_young_adults_program
detected_women_only_program
detected_men_only_program
detected_lgbtq_affirming
detected_veterans_program
detected_first_responder_program
detected_executive_program
detected_professional_program
These remain candidates until reviewed.
Professional Track Detections
Crawler should detect professional-track clues.
facility_id
detected_healthcare_professionals_track
detected_aviation_recovery_program
detected_legal_professionals_program
detected_licensing_board_experience
detected_diversion_program_support
professional_track_notes
Family / Housing / Reintegration Detections
Crawler should detect support signals relevant to matching philosophy.
facility_id
detected_family_therapy_program
detected_family_weekend_program
detected_child_visitation_support
detected_family_reunification_support

detected_sober_living_transition
detected_transitional_housing
detected_recovery_residence_affiliation
detected_employment_support
detected_benefits_navigation
detected_case_management_services

detected_evening_iop
detected_remote_participation
detected_work_compatible_program
detected_executive_schedule_support
Trust / Verification Signal Detections
Crawler may detect trust claims but must not self-verify them.
facility_id
detected_joint_commission_claim
detected_carf_claim
detected_state_license_claim
detected_legitscript_claim
trust_signal_notes
Important:
Crawler-detected trust claims must be treated as claims, not verified facts.
Missing Data / Schema Gap Signals
The crawler should actively report recurring patterns not yet captured cleanly by the schema.
gap_signal_id
crawl_id
facility_id
signal_name
signal_category
signal_description
source_url
source_excerpt
frequency_hint
recommended_action
created_at
Suggested signal_category values
missing_schema_field
unclear_language
industry_pattern
frequent_omission
contradictory_claim
new_matching_signal
Examples:
transportation assistance appears frequently
parenting reunification support appears frequently
airport pickup appears frequently
vague insurance wording is common
medication continuation policy appears important but under-modeled
This is the “all-seeing-eye” layer.
Crawl Findings Digest Inputs
The system should be able to aggregate crawl observations into digest reports.
Suggested digest dimensions:
most_common_unmodeled_signals
most_common_low_confidence_fields
most_common_contradictions
most_frequently_overridden_fields
most_common_insurance_phrases
most_common_program_phrases
These digests help evolve the product brain and matching engine.
Data Precedence Model
Crawler results are not the final patient-facing truth.
For fields touched by crawling, precedence should generally be:
admin_verified
→ facility_override
→ crawler_detected
→ raw_source_text
This is especially important for:
insurance
facility summary
program levels
specialties
trust claims
Recommended Database Shape
Implementation can vary, but the logical model should separate:
Canonical facility table
Current / final facility profile fields
Crawl run table
One row per crawl execution
Crawl pages table
One row per crawled page
Extraction evidence table
One row per extracted field/value/evidence pair
Gap signals table
One row per detected missing-schema or pattern signal
Do not flatten all crawler output into a single wide table.
Initial v1 Crawl Priorities
The first crawler slice should prioritize:
insurance mentions
patient-facing synopsis
program levels
professional-track clues
family / housing / reintegration clues
source evidence capture
Do not attempt full ontology completeness in v1.
Design Principle Summary
The NRIN crawler is not just a scraper.
It is:
an extraction engine
an evidence engine
a synopsis drafting engine
a schema-gap detector
Its role is to enrich facility profiles while teaching NRIN what the treatment-center market actually looks like.
---

## Session Update — 2026-03-30 — Queue A insurance enrichment v2

### New effective signal classes
Crawler-derived insurance truth currently comes from four practical signal families:

1. Named carrier evidence
2. Verification-flow evidence
3. Composite insurance image/logo evidence
4. Weak phrase evidence

### Important session conclusion
Composite insurance image/logo evidence is a strong practical signal in the rehab/treatment-center domain.
Many legitimate facilities do not expose carrier names in parseable text, but do display payer logos.
This signal now meaningfully recovers previously missed private-insurance positives.

### Current limitation
Composite image detection is currently used at runtime/summary level but is not yet persisted as its own dedicated DB column.
If future analytics require DB-level inspection of this signal, add a dedicated persisted field.

### Schema interpretation warning
`accepts_private_insurance_detected = false` does not currently mean “definitive no.”
It may represent:
- unresolved false bucket
- public/community candidate
- weak site
- true negative

Because of this, post-crawl truth resolution is required for final interpretation.

