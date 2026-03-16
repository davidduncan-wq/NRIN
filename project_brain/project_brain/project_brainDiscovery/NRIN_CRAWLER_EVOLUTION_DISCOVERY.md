NRIN Crawler Evolution Discovery
Date: 2026-03-12
# Crawler Boot Discoveries (Real-World Web Behavior)
Context
During crawler boot operations and matcher evaluation, several architectural insights emerged regarding the role of the NRIN facility crawler.
The crawler was originally designed to extract structured attributes from facility websites.
However, testing revealed that the crawler is also capable of discovering patterns and signals not yet represented in the schema.
This suggests the crawler should evolve from a simple extractor into a discovery system for recovery infrastructure intelligence.
Crawler Current Role (v1)
The current crawler performs two main tasks:
1. Facility Website Discovery
Resolve domains and crawl facility websites.
Sources include:
facility seed list
discovered domain resolution
recursive internal links
2. Structured Attribute Extraction
Extract known attributes such as:
Program levels
detox
residential
PHP
IOP
outpatient
Insurance signals
Aetna
Cigna
Blue Cross
Medicare
Medicaid
Specialty signals
MAT support
professional programs
The crawler stores:
source_url
text_snippet
confidence_score
This information feeds the facility_intelligence table used by the matching engine.
Discovery During Boot
While crawling hundreds of treatment facility websites, the crawler surfaced patterns beyond the original schema.
These include:
Non-clinical recovery signals
Examples observed or expected:
transportation services
airport pickup
family visitation support
transitional housing
employment assistance
sober living pipelines
These signals influence placement success but are rarely captured in structured treatment datasets.
Staff and Counselor Signals
Facility websites frequently contain staff biographies and counselor CVs.
Examples:
therapist specializations
academic degrees
lived recovery experience
professional background
Example signals:
retired airline pilot counselor
trauma therapy specialist
family therapy specialist
addiction medicine physician
These signals may strengthen match explanations and credibility.
Environment and Lifestyle Signals
Facilities often highlight environment or culture.
Examples:
beach proximity
outdoor programs
music rooms
art therapy studios
surfing culture
meditation programs
Example observed insight:
Some residential facilities advertise guitars in residential houses.
Lifestyle compatibility may influence patient engagement and motivation.
Pet Compatibility Signals
Pet accommodation frequently appears as an informal capability.
Examples:
pet friendly policies
emotional support animals
service animal acceptance
These are often not structured attributes but can significantly influence treatment acceptance.
Example patient concern:
“I’m worried about leaving my dog.”
Matching could prioritize facilities capable of accommodating pets.
Duplicate Domain Clusters
Crawler boot revealed that many facility seeds map to shared organizational domains.
Examples observed:
valleyhope.org
vallevistahospital.com
virtuerecoverycenter.com
Multiple facility entities may share the same website.
Implication:
Crawler results must support multi-entity attribution.
Crawler v2 Design Direction
Crawler v2 should expand beyond extraction.
Three functional layers are proposed.
Layer 1 — Structured Extraction
Continue extracting known attributes including:
program_levels
insurance
mat_support
professional_programs
These feed the matching engine directly.
Layer 2 — Pattern Detection
Crawler identifies frequently recurring phrases or concepts not currently modeled.
Examples:
transportation support
family reunification
court coordination
employment assistance
Patterns are stored as candidate signals.
Layer 3 — Schema Gap Detection
When a pattern appears across many facilities but does not exist in the schema, the crawler flags it.
Example:
pattern_frequency > threshold
schema_field_missing
The system proposes a new schema attribute.
Example proposal:
transportation_support
family_reunification_program
pet_friendly
staff_lived_recovery_experience
This allows the NRIN data model to evolve with the industry.
Crawler as Industry Intelligence System
Over time the crawler may detect:
emerging treatment models
new recovery services
changes in terminology
evolving treatment practices
Periodic Crawler Findings Digests may summarize discoveries.
These digests can inform:
schema updates
matcher improvements
industry reporting
Relationship to Matching Engine
Crawler intelligence directly strengthens the NRIN matching model.
The crawler provides facility capability signals.
The intake system provides patient life context signals.
The matcher then evaluates compatibility across:
clinical needs
family context
career constraints
housing stability
recovery motivation
environment compatibility
Architectural Principle
The crawler is not merely collecting website content.
The crawler is building a structured representation of recovery infrastructure.
This data allows the NRIN system to match people with recovery environments that align with their real-life trajectory.
Design Implication
Crawler discoveries should periodically trigger schema review cycles.
This ensures that the NRIN system continues to reflect the real treatment ecosystem rather than a static model.
Relationship to NRIN Mission
NRIN does not aim to list treatment centers.
NRIN aims to understand the capabilities and characteristics of recovery environments.
The crawler is the system that learns those characteristics at scale.
Hamburger Menu / JS Navigation Gap
Observation during crawler boot:
Some treatment center websites place core program and insurance pages behind JavaScript-driven hamburger menus. Static HTML crawlers that rely on simple fetch() do not see these links because they are injected into the DOM only after user interaction.
Example case observed:
theohanarecovery.com
crawler result: program_detections = 0, insurance_detections = 0
manual inspection shows Detox, Residential, and Insurance Accepted inside the hamburger navigation.
Implication:
static crawler may produce false negatives for program detection
Mitigation strategies for Crawler 2.0:
Headless browser crawling
Playwright or Puppeteer
execute JS and render full DOM
Program-path probing
attempt common paths even if not linked:
/programs
/treatment
/services
/levels-of-care
/admissions
/insurance
/verify-insurance
Sitemap discovery
crawl /sitemap.xml where available
Expected impact:
improved program detection
fewer false negatives
deeper facility intelligence extraction
## Discovery: Hamburger Menu / JS Navigation Gap

Observation
Some treatment center sites hide core program and insurance pages inside
JavaScript hamburger navigation menus. Static HTML crawling does not
expand these menus, causing potential false negatives in program detection.

Example
theohanarecovery.com
Crawler result: program_detections = 0, insurance_detections = 0
Manual inspection revealed Detox, Residential, and Insurance Accepted
inside the hamburger navigation menu.

Implication
Crawler v1 (static HTML) may miss program pages and insurance pages when
they are only accessible through JS navigation.

Mitigation for Crawler 2.0
• Headless browser execution (Playwright / Puppeteer)
• Program-path probing (/programs, /treatment, /services, /insurance, etc.)
• Sitemap discovery (/sitemap.xml)

Impact
Improves recall of program detection and reduces false negatives.
Production-scale boot discovery
At larger crawl volumes, raw crawl rows can grow much faster than normalized facility intelligence rows because many facility_seed_id rows map to the same facility_site_id.
Correct sync check:
select
  (
    select count(distinct s.facility_site_id)
    from facility_crawl_results c
    join facility_seeds s on s.id = c.facility_seed_id
    where s.facility_site_id is not null
  ) as crawled_facility_sites_distinct,
  (select count(*) from facility_intelligence) as facility_intelligence_total;
Healthy state means:
crawled_facility_sites_distinct = facility_intelligence_total
Throughput discovery
Large multi-location healthcare networks can dominate crawl throughput because crawler v1 is facility-seed anchored rather than domain-aware.
Observed heavy repeat domains included:
southwestern.org
rhs.care
swchc.org
southernskyrecovery.com
sparktorecovery.com
georgiaskyoutpatientdetox.com
Implication:
Crawler v2 should consider domain-aware reuse/caching or queue shaping.
Production bottleneck discovery: at larger scale, a small number of multi-location domains can dominate raw crawl volume and stall distinct facility-site coverage. Queue shaping or domain-aware skipping is required for efficient production boot.
Crawler v1 closes on uncrawled facility_seed_id, not on domain-level saturation or answered capability questions; at scale this causes repeated shared-surface domains to dominate throughput even after useful intelligence has already been extracted.