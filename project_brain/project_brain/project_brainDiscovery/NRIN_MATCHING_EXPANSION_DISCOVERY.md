NRIN Matching Expansion Discovery
Date: 2026-03-12
Context
During crawler boot testing and matcher review, several observations emerged about the types of signals that strongly influence successful recovery placements but are rarely captured in traditional treatment directories.
These signals expand the scope of the NRIN matching engine beyond conventional variables such as program level and insurance.
Key Insight
Recovery placement success is often influenced by life context compatibility, not only clinical treatment capabilities.
Facility websites frequently contain signals that suggest compatibility with patient life circumstances, but these signals are rarely structured in existing industry datasets.
The NRIN crawler and matching engine should evolve to capture and utilize these signals.
Newly Identified Matching Signal Categories
Transportation Support
Examples discovered or inferred:
airport pickup
transportation to court dates
transportation to probation meetings
transportation to family visitation
travel assistance for out-of-state patients
Why this matters:
Patients traveling for treatment often face logistical barriers. Facilities that offer transportation significantly reduce drop-off risk.
Family Reunification Support
Signals may include:
family therapy programs
parenting support
child visitation policies
custody restoration support
family counseling tracks
Example patient narrative:
“I want to get my kids back.”
Matching implication:
Facilities with strong family programs should receive increased match weight.
Career / Professional Recovery Tracks
Some facilities support licensed professionals such as:
pilots
physicians
nurses
attorneys
public safety personnel
Relevant signals:
professional monitoring familiarity
licensing board reporting
confidential programs
career reinstatement support
Example narrative:
“I’m a pilot and need to maintain FAA monitoring.”
Lifestyle Compatibility Signals
These signals often appear informally on facility websites.
Examples:
beach proximity
surfing culture
music programs
art therapy emphasis
outdoor activities
yoga communities
These signals may influence patient motivation and engagement.
Example:
A facility advertising guitars in residential housing may appeal strongly to musically oriented patients.
Pet Compatibility
Many facilities allow pets informally or case-by-case, even if not publicly advertised.
Signals may include:
pet-friendly policy
service animal acceptance
emotional support animals
Patient narratives may reference:
“I’m worried about leaving my dog.”
Facilities capable of accommodating pets may significantly reduce treatment resistance.
Staff Experience Signals
Facility staff biographies and counselor CVs often contain valuable signals including:
professional background
academic training
lived recovery experience
career-specific counseling experience
Examples:
retired airline pilot counselor
family therapy specialist
addiction medicine physician
trauma therapy specialist
These signals could enhance matching credibility and explanation generation.
Narrative Interpretation Importance
NRIN allows patients to describe their situation in free-form text.
Example input:
“I’m a nurse on probation and need to get my license back.”
AI interpretation:
career_recovery_priority = high
professional_monitoring = healthcare
confidentiality_importance = high
These signals should influence facility ranking.
Match Explanation Layer
Future versions of NRIN may generate patient-facing explanations for recommended facilities.
Example:
“You indicated that you are a pilot seeking monitoring support and family reconciliation.
This facility offers professional monitoring programs and strong family therapy services, which align with your recovery goals.”
This explanation layer improves transparency and trust.
Government Reporting Implications
Because NRIN collects structured facility capabilities, the system may also support recovery infrastructure reporting.
Examples:
facilities offering family reunification support
facilities offering professional monitoring programs
facilities offering transitional housing
facilities offering work-compatible treatment programs
This data could support government recovery planning initiatives.
Architectural Implication
The crawler should evolve beyond simple attribute extraction and support:
structured attribute extraction
pattern discovery
schema gap detection
Crawler findings may periodically trigger schema expansion proposals.
Design Principle Reinforced
NRIN does not match patients to treatment beds.
NRIN matches patients to recovery environments compatible with their life context.
Why This File Matters
If you store this in the brain:
Future AI sessions will immediately understand the deeper philosophy behind the matching engine.
Otherwise they will assume the system is just:
insurance + program level matching
which would completely miss the architecture you're building.
One Small Suggestion
Also add this to your brain index file.
In:
NRIN_PROJECT_INDEX.md
Add a line:
NRIN_MATCHING_EXPANSION_DISCOVERY.md
