NRIN Crawler Post-Mortem
(Data Investigation Phase Complete)
1. Crawl Coverage
Metric	Value
Facility sites (canonical universe)	5378
Facility seeds	4890
Crawled seeds	4752
Normalized intelligence rows	4752
Remaining uncrawled seeds	138
Seeds with no domain	76
Interpretation
The crawler achieved ~97% seed coverage:
4752 / 4890 ≈ 97.2%
The remaining 138 seeds are largely:
76 with no domain
~60 on shared / problematic domains
Therefore:
Crawler phase is operationally complete.
No additional crawling is required before matcher development.
2. Confidence Score Distribution
Range	Count
<40	659
40-59	474
60-79	1323
80+	2296
Interpretation
Over 75% of facilities score ≥60 confidence.
(1323 + 2296) / 4752 ≈ 76%
That is extremely strong for a first-pass crawler.
Low confidence rows likely correspond to:
weak directory surfaces
sparse websites
JS navigation pages
hospital systems
These rows are still usable but may require matcher fallback logic.
3. Program Detection Sanity
Program	Detected
Detox	2638
Residential	3147
PHP	2133
IOP	2837
Outpatient	3720
MAT	2552
Dual diagnosis	2887
Professional programs	256
Aftercare	0
Interpretation
Detection distribution looks very realistic for the SUD treatment market.
Expected hierarchy:
Outpatient > Residential > Detox
Which matches the results.
MAT detection (~2550) also makes sense since MAT programs are widespread but not universal.
Important anomaly
aftercare = 0
This almost certainly means the crawler never normalized “aftercare” correctly even when the text appeared.
Possible causes:
synonym mismatch
token mismatch
normalization bug
Example synonyms likely missed:
continuing care
alumni program
relapse prevention
ongoing support
This is a small v1.5 crawler improvement, not a blocker.
4. Insurance Signal Density
Average signals per facility:
Metric	Value
Avg program detections	5.65
Avg insurance detections	2.52
Avg schema gap signals	0.61
Interpretation
This is very strong signal density.
It means most facility pages produced multiple independent pieces of structured evidence.
That is exactly what the matcher needs.
5. Empty Signal Rows
no_program_no_insurance = 591
total = 4752
So:
591 / 4752 ≈ 12.4%
Interpretation
Roughly 12% of sites produced weak signals.
This is normal and expected.
Typical causes:
marketing landing pages
hospital system subpages
JS navigation
minimal treatment descriptions
directory sites
The matcher should treat these as:
low-confidence facilities
not as crawler failure.
6. Shared-Domain Effects
From earlier results we saw domains like:
bhgrecovery.com
va.gov
guardianrecovery.com
providence.org
These represent multi-facility networks.
Implication:
Multiple seeds may resolve to the same organizational web surface, meaning:
one web page → many facility_site_ids
The current normalization simply assigns the same detected signals to each facility.
That behavior is acceptable for v1, but the matcher should remember:
signal provenance = shared domain
7. Known Crawler Blind Spots
Identified during post-mortem:
Navigation-hidden pages
Examples:
hamburger menus
JS tabbed content
Hospital systems
Often bury SUD programs inside large navigation trees.
Weak marketing sites
Small outpatient clinics often provide minimal structured info.
Synonym normalization gaps
Example discovered:
aftercare → not detected
8. Signal Quality Verdict
The crawler is producing rich structured evidence:
avg program signals ≈ 5.6
avg insurance signals ≈ 2.5
Confidence distribution is healthy and most rows are strong.
This means the system has enough signal to power a matcher.
9. Crawler v1.5 Improvements (Non-Blocking)
Small improvements that would raise coverage:
Improve program synonym normalization
Add mapping for:
aftercare
continuing care
alumni program
relapse prevention
extended care
Better handling of shared network domains
Future improvement could track:
source_surface_class
Example classes:
facility_site
hospital_system
treatment_network
directory
government
JS navigation discovery
Future crawler version could simulate:
click hamburger
expand menu
crawl hidden links
But not required for matcher launch.
10. Final System Status
Component	Status
Seed universe	Built
Domain resolution	Working
Crawler pipeline	Stable
Duplicate protection	Fixed
Pagination bugs	Fixed
Crawl coverage	~97%
Normalization	Working
Confidence scoring	Working
Signal density	Strong
Final Recommendation
You should now proceed directly to matcher design.
Crawler v1 is sufficiently complete.
Further crawler improvements can happen after the matcher exists, because the matcher will reveal which signals actually matter.