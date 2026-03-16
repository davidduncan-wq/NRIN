NRIN Match Explanation Engine
Date: 2026-03-12
Purpose
The NRIN Match Explanation Engine generates human-readable explanations describing why a facility is a strong match for a specific patient.
This layer converts structured matching signals into clear narrative explanations for:
patients
families
treatment centers
referring professionals
government reporting systems
The goal is to provide transparent reasoning for placement decisions.
Why This Matters
Traditional treatment referral systems operate as opaque recommendation engines.
Patients are often told:
“This facility is available.”
But they are rarely told:
why it fits their situation
which aspects of their life context influenced the match
NRIN aims to improve trust by making the match reasoning explainable.
Inputs to the Explanation Engine
The explanation engine receives structured signals from two sources.
Patient Context Signals
Derived from intake questions and narrative interpretation.
Examples:
Clinical signals
substance_type
severity_level
detox_required
co_occurring_conditions
mat_preference
Life context signals
family_reunification_priority
career_recovery_priority
housing_instability
legal_pressure
return_to_work_urgency
Professional context signals
professional_monitoring_required
confidentiality_importance
licensing_reinstatement_goal
Lifestyle signals
pet_concern
environment_preference
creative_interests
These signals may be extracted from both structured questions and free-form narrative input.
Facility Capability Signals
Derived from crawler intelligence and facility onboarding data.
Examples:
Program structure
detox
residential
PHP
IOP
outpatient
continuum_of_care
Specialty programs
professional_monitoring_program
family_therapy_program
career_reintegration_support
Support services
transitional_housing
transportation_support
court_coordination
employment_assistance
Environment signals
outdoor_programs
creative_therapy
coastal_location
Staff expertise
family_therapy_specialist
addiction_medicine_physician
lived_recovery_experience
Explanation Generation Process
The explanation engine follows three steps.
Step 1 — Identify Match Drivers
From the full match evaluation, identify the highest-impact compatibility signals.
Example:
family_reunification_priority
professional_monitoring_required
detox_required
These signals become the core explanation anchors.
Step 2 — Identify Supporting Facility Capabilities
Map the patient signals to facility capabilities.
Example:
Patient signal:
professional_monitoring_required
Facility capability:
professional_monitoring_program
staff_experience_professional_clients
Step 3 — Generate Narrative Explanation
Combine the signals into a concise explanation.
Example output:
You indicated that maintaining your professional license and rebuilding family relationships are important to your recovery.
This facility offers professional monitoring programs and strong family therapy services, which support both of these goals.
Example Explanations
Example: Professional Recovery Case
Patient narrative:
“I'm a pilot and I need to maintain FAA monitoring.”
Explanation:
You indicated that maintaining professional monitoring is important to your recovery.
This facility has experience working with licensed professionals and offers structured outpatient programs compatible with monitoring requirements.
Example: Family Reunification Case
Patient narrative:
“I want to get my kids back.”
Explanation:
You indicated that rebuilding your relationship with your children is an important motivation.
This facility offers family therapy programs and structured support for family reunification during recovery.
Example: Housing Instability Case
Patient narrative:
“I don't have a stable place to live.”
Explanation:
You indicated that stable housing is a concern during recovery.
This facility offers transitional housing support and long-term recovery planning.
Example: Lifestyle Compatibility Case
Patient narrative:
“Music has always helped me stay sober.”
Explanation:
You mentioned that music is an important part of your recovery.
This facility emphasizes creative therapy and provides music-focused recovery activities.
Staff-Specific Explanations (Future)
If staff profiles are available, explanations may reference relevant expertise.
Example:
This facility includes counselors with experience supporting licensed professionals, including individuals in aviation and healthcare fields.
This enhances credibility and trust.
Tone Guidelines
Explanations should be:
Clear
Supportive
Non-judgmental
Concise
Avoid:
Clinical jargon
Overly technical language
Marketing language
The explanation should feel like a helpful guide, not an advertisement.
Privacy Considerations
Patient explanations should avoid exposing sensitive information unnecessarily.
Example:
Instead of:
“You indicated you are a physician under investigation.”
Prefer:
“You indicated that maintaining your professional license is an important priority.”
Future Personalization Options
Explanation tone may be adjusted based on the audience.
Patient view
Professional referral view
Government reporting view
Each may emphasize different aspects of the match.
Relationship to Matching Doctrine
The explanation engine reinforces the NRIN principle that:
Matching results must remain transparent and evidence-based.
Facilities cannot override match explanations through referral incentives.
Architectural Placement
System pipeline:
facility crawler
        ↓
facility intelligence
        ↓
patient intake interpretation
        ↓
matching engine
        ↓
match explanation engine
        ↓
patient interface
The explanation engine does not determine matches.
It explains the reasoning behind them.
Long-Term Vision
The explanation engine transforms NRIN from a recommendation system into a transparent decision-support platform.
Patients are not simply given a list of facilities.
They are shown why those environments support their recovery goals.
Add this to the brain index
In:
project_brain/NRIN_PROJECT_INDEX.md
Add:
NRIN_MATCH_EXPLANATION_ENGINE.md