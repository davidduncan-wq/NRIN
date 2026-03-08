NRIN Matching Philosophy
Purpose
NRIN is not a traditional treatment referral tool.
Traditional placement systems match primarily on:
substance type
insurance acceptance
bed availability
NRIN expands matching to include life context, motivation, and recovery trajectory.
The goal is to match patients with facilities that support successful long-term recovery within the patient’s real life circumstances, not simply detox or short-term stabilization.
Core Matching Layers
NRIN matching considers multiple contextual layers.
Clinical
Traditional factors:
substance(s)
severity
detox need
co-occurring mental health conditions
medication policies
level of care required
Example program levels:
detox
residential
PHP
IOP
outpatient
aftercare
Facilities offering a full continuum of care are often preferable for long-term recovery.
Family Context
Family factors can strongly influence placement success.
Examples:
presence of children
custody concerns
relationship repair
family therapy needs
visitation proximity
Facilities with strong family programming may be prioritized when family reunification is a major motivation.
Career / Professional Context
Certain professions face unique recovery requirements.
Examples:
pilots (FAA / HIMS programs)
physicians
nurses
attorneys
licensed professionals
public safety personnel
Relevant signals include:
professional_monitoring
licensing_reinstatement
diversion_programs
confidentiality_requirements
career_recovery_priority
Facilities offering professional tracks or monitoring familiarity may be prioritized.
Housing Stability
Housing status significantly impacts treatment planning.
Examples:
stable_housing
temporary_housing
staying_with_family
homeless
Facilities with:
transitional_housing
sober_living
employment_support
benefits_navigation
may be prioritized for patients experiencing housing instability.
Future expansions may include recovery pathways aligned with initiatives such as HHS STREETS.
Reintegration Pressure
Some patients must return quickly to work, family, or legal obligations.
Signals include:
return_to_work_urgency
legal_deadlines
family_responsibilities
business_ownership
Facilities supporting:
short_residential
PHP
IOP
evening_programs
work_compatible_programs
may be prioritized for these patients.
Human Motivation Model (Internal Concept)
Many recovery crises originate from collapse in one of three domains.
Internal shorthand:
Eat
Family
Win
Internal interpretation:
survival / stability
attachment / relationships
identity / purpose
These labels are never shown to patients, but they provide a conceptual shorthand when reasoning about recovery motivations.
Narrative Interpretation Layer
NRIN allows patients to optionally describe their situation.
Example prompt:
"Anything else you want us to know about your situation or goals?"
The AI layer converts narrative into structured signals.
Example input:
"I want my kids back."
Example interpretation:
family_reunification_priority = high
family_program_weight = high
Example input:
"I'm a nurse on probation and need to get my license back."
Example interpretation:
professional_monitoring = healthcare
career_recovery_priority = high
confidentiality_importance = high
Narrative interpretation allows the system to capture life context that structured intake questions may miss.
Facility Attribute Philosophy
Facilities are described using structured attributes including:
program_levels
insurance
professional_tracks
family_programs
housing_support
continuum_of_care
work_compatible_programs
Facilities may also support:
transitional_housing
career_reintegration
licensing_board_experience
family_therapy_strength
These attributes influence matching weight.
Facility Website Crawl Philosophy
The NRIN crawler serves two purposes.
1. Structured Extraction
The crawler extracts known attributes from facility websites.
Examples:
insurance
program_levels
specialties
professional_tracks
housing_support
Each extracted claim should store:
source_url
text_snippet
confidence_score
2. Pattern Detection
The crawler should also detect recurring patterns that are not yet represented in the schema.
Examples:
commonly mentioned services missing from the schema
inconsistent industry terminology
frequently edited scraped fields
emerging program types
Periodic Crawl Findings Digests should surface these discoveries so the schema can evolve.
Recovery Pathway Strata (Future Architecture)
NRIN may eventually support multiple recovery pathways.
Clinical Stabilization
Focus:
detox
residential
medical safety
Reintegration Compatible Programs
Focus:
working adults
parents
professionals
PHP
IOP
work-compatible treatment
Life Rebuild / Housing Recovery
Focus:
homeless recovery programs
employment rebuilding
long-term recovery housing
social services
Design Principle
NRIN matches people to recovery environments that support their real life trajectory, not merely their immediate medical condition.
The system therefore evaluates:
clinical fit
life context
motivation
family factors
career pressures
housing stability
recovery goals
