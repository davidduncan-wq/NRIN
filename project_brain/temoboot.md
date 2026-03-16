Mini boot for next chat
NRIN MINI BOOT — FACILITY DB BOOT ONLY
You are joining the NRIN project for one narrow purpose only:
Complete the facility intelligence boot from the existing seeded facility universe already loaded into Supabase.
Scope
Do not broaden scope.
This chat is only for:
running crawler batches
normalization upsert
confidence update
counts/audits
monitoring drift
Not for:
product ideation
patient UX
new matcher philosophy
domain repair
refactoring unrelated code
Canonical understanding
NRIN is not discovering treatment centers from scratch.
True corpus:
facility_sites = curated accredited facility universe
facility_seeds = crawlable/resolved facility URLs
facility_crawl_results = raw crawler output
facility_intelligence = matcher-facing normalized layer
Crawler assumption:
The row is already a real facility.
The crawler asks:
what levels of care do you provide?
what programs do you support?
what insurance do you appear to accept?
Current operating rhythm
Use:
120 runs of 10 for production-scale boot, or
30 runs of 10 if a controlled block is preferred
Then always run:
SQL 1 normalization upsert
SQL 2 confidence update
SQL 3 counts
SQL 4 MAT audit
SQL 5 professional audit
optional SQL 6 professional true/false count
Current code-state facts
scripts/url/crawlFacilitySeeds.ts is the active crawler script
BATCH_SIZE = 10
22P05 poison rows are quarantined locally via:
tmp/facility_crawl_skip_seed_ids.txt
tmp/facility_crawl_22p05_manual_review.ndjson
this fixed repeated queue clogging from bad rows
crawler remains facility-anchored, not domain-anchored
repeated domains are expected because many facility seeds share the same web surface
Proven boot behavior
counts have stayed synced repeatedly:
crawl_results_total == facility_intelligence_total
professional flag rate remained plausible
MAT top audit remained stable
no structural drift so far
Major discoveries from this session
repeated domains are normal for multi-location orgs and healthcare systems
source classes observed include:
direct facility sites
multi-location networks
hospital systems
VA / Tricare / military
directory/profile pages
weak / expired / junk domains
hamburger / JS navigation causes false negatives in crawler v1
example: theohanarecovery.com
detox/residential/insurance visible in hamburger menu, not in static crawl
crawler v2 should consider:
headless browser / JS execution
sitemap discovery
common-path probing (/programs, /insurance, etc.)
Current milestone
Most recent confirmed state:
facility_sites_total = 5378
facility_seeds_total = 4890
crawl_results_total = 934
facility_intelligence_total = 934
Professional-program count snapshot:
true = 69
false = 865
roughly 7.4% true, which is plausible and not exploding
What to paste back
To save browser memory, paste only:
SQL 3 counts
SQL 4 MAT audit
SQL 5 professional audit
optional SQL 6 professional true/false count
terminal output only if there is a new error class or obvious anomaly
Handoff summary
We successfully moved from cautious 6-run cycles to a production-ready boot posture.
What was solved
22P05 null-character insert failures were quarantined so they no longer clog batch slots
normalization and confidence refresh pattern was stabilized
repeated-domain behavior was understood as expected multi-facility shared-surface behavior, not a crawler bug
What was learned
the crawler is functioning as a national facility intelligence ingestion pipeline
source classes matter and should become part of crawler evolution
crawler v1 misses some JS/hamburger-menu content
facility marketing reveals patient needs before intake does, which is strategically important for matching
AI should sit on top of crawled/normalized NRIN data as an explanation/reasoning layer, not replace crawling
Recommendation for next chat
Resume with:
terminal run block
SQL 1
SQL 2
SQL 3
SQL 4
SQL 5
optional SQL 6
If SQL 1 fails again in the next chat, paste the exact database error message first.
Short handoff line for next chat
Use this:
Normalization now dedupes to latest row per facility_site_id, so the correct sync check is crawled_facility_sites_distinct == facility_intelligence_total, not crawl_results_total == facility_intelligence_total.

Mini handoff addendum
Add this to your next-chat boot/handoff:
Updated sync check
Because multiple facility_seed_id rows can map to the same facility_site_id, normalization now keeps only the latest crawl row per facility site before upsert.
Therefore:

facility_crawl_results is a raw crawl table
facility_intelligence is a deduped normalized facility-site table
Correct health query:
select
  (select count(*) from facility_sites) as facility_sites_total,
  (select count(*) from facility_seeds) as facility_seeds_total,
  (select count(*) from facility_crawl_results) as crawl_results_total,
  (
    select count(distinct s.facility_site_id)
    from facility_crawl_results c
    join facility_seeds s on s.id = c.facility_seed_id
    where s.facility_site_id is not null
  ) as crawled_facility_sites_distinct,
  (select count(*) from facility_intelligence) as facility_intelligence_total;
Healthy state means:
crawled_facility_sites_distinct == facility_intelligence_total
That’s the big correction.
You’re in very good shape.
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
Crawler v1 can encounter transient fetch/network EPIPE errors. These should be treated separately from poison data rows (22P05). Retry or temporary skip behavior may be needed in Crawler 2.0.