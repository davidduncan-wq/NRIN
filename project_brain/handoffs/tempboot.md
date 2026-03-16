NRIN MINI BOOT — FACILITY DB BOOT ONLY
You are joining the NRIN project for one narrow purpose only:
Complete the facility intelligence database boot from the existing curated facility universe.
Mission scope
Do not broaden scope.
This chat is not for:
product ideation
treatment-center discovery
rebuilding matching philosophy
patient UX
brochure cards
Google search/domain repair
refactoring unrelated code
This chat is only for:
running the facility DB boot 10 at a time
from the existing seeded facility universe already loaded into Supabase.
Canonical understanding
NRIN is not trying to find treatment centers in the universe.
The facility universe is already curated.
True corpus
facility_sites = 5378 curated accredited facilities
facility_seeds = 4890 crawlable/resolved facilities loaded from verified URL results
facility_crawl_results = raw crawler output
facility_intelligence = normalized matcher-facing capability layer
Crawler purpose
The crawler does not ask:
“Are you a treatment center?”
It assumes the row is already a real treatment center and asks:
“What kind of treatment center are you?”
“What levels of care do you provide?”
“What programs do you support?”
“What insurance do you appear to accept?”
Goal of this chat
Finish the initial facility intelligence boot so the DB contains stored answers for facility capabilities.
NRIN should not crawl live per patient.
This is a one-time initial boot of treatment-center intelligence.
Later, facilities can override/update their programs and insurance from the facility control panel.
Current working loop
Terminal
cd ~/Desktop/NRIN
npx tsx scripts/url/crawlFacilitySeeds.ts
Current batch size
BATCH_SIZE = 10
Keep it at 10 unless there is a compelling reason to change it.
SQL 1 — normalization upsert
insert into facility_intelligence (
  facility_site_id,

  offers_detox,
  offers_residential,
  offers_php,
  offers_iop,
  offers_outpatient,
  offers_aftercare,

  dual_diagnosis_support,
  mat_supported,
  sober_living_transition,

  family_therapy_program,
  professional_program,

  accepts_medicaid_detected,
  accepts_medicare_detected,
  accepts_private_insurance_detected,
  accepts_self_pay_detected,
  accepted_insurance_providers_detected,

  matcher_summary,

  source_crawl_result_id,
  source_seed_id,
  last_crawled_at,
  last_normalized_at,

  detected_program_types,
  detected_insurance_carriers,
  schema_gap_signals,
  updated_at
)
select
  s.facility_site_id,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'detox'
  ) as offers_detox,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'residential'
  ) as offers_residential,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'php'
  ) as offers_php,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'iop'
  ) as offers_iop,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') in ('outpatient', 'op')
  ) as offers_outpatient,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'aftercare'
  ) as offers_aftercare,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'dual_diagnosis'
  ) as dual_diagnosis_support,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'mat'
  ) as mat_supported,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'sober_living'
  ) as sober_living_transition,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'family_program'
  ) as family_therapy_program,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'professional_track'
  ) as professional_program,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') = 'medicaid'
  ) as accepts_medicaid_detected,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') = 'medicare'
  ) as accepts_medicare_detected,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') in (
      'aetna','cigna','blue_cross_blue_shield','united_healthcare',
      'humana','anthem','ambetter','molina','beacon','tricare'
    )
  ) as accepts_private_insurance_detected,

  exists (
    select 1
    from jsonb_array_elements(coalesce(c.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') = 'self_pay'
  ) as accepts_self_pay_detected,

  coalesce(
    (
      select jsonb_agg(distinct to_jsonb(i->>'normalizedName'))
      from jsonb_array_elements(coalesce(c.insurance_carriers, '[]'::jsonb)) i
    ),
    '[]'::jsonb
  ) as accepted_insurance_providers_detected,

  c.synopsis as matcher_summary,

  c.id as source_crawl_result_id,
  c.facility_seed_id as source_seed_id,
  c.created_at as last_crawled_at,
  now() as last_normalized_at,

  coalesce(c.program_types, '[]'::jsonb) as detected_program_types,
  coalesce(c.insurance_carriers, '[]'::jsonb) as detected_insurance_carriers,
  coalesce(c.raw_result->'schemaGapSignals', '[]'::jsonb) as schema_gap_signals,
  now() as updated_at
from facility_crawl_results c
join facility_seeds s
  on s.id = c.facility_seed_id
where s.facility_site_id is not null
on conflict (facility_site_id)
do update set
  offers_detox = excluded.offers_detox,
  offers_residential = excluded.offers_residential,
  offers_php = excluded.offers_php,
  offers_iop = excluded.offers_iop,
  offers_outpatient = excluded.offers_outpatient,
  offers_aftercare = excluded.offers_aftercare,
  dual_diagnosis_support = excluded.dual_diagnosis_support,
  mat_supported = excluded.mat_supported,
  sober_living_transition = excluded.sober_living_transition,
  family_therapy_program = excluded.family_therapy_program,
  professional_program = excluded.professional_program,
  accepts_medicaid_detected = excluded.accepts_medicaid_detected,
  accepts_medicare_detected = excluded.accepts_medicare_detected,
  accepts_private_insurance_detected = excluded.accepts_private_insurance_detected,
  accepts_self_pay_detected = excluded.accepts_self_pay_detected,
  accepted_insurance_providers_detected = excluded.accepted_insurance_providers_detected,
  matcher_summary = excluded.matcher_summary,
  source_crawl_result_id = excluded.source_crawl_result_id,
  source_seed_id = excluded.source_seed_id,
  last_crawled_at = excluded.last_crawled_at,
  last_normalized_at = excluded.last_normalized_at,
  detected_program_types = excluded.detected_program_types,
  detected_insurance_carriers = excluded.detected_insurance_carriers,
  schema_gap_signals = excluded.schema_gap_signals,
  updated_at = now();
SQL 2 — confidence update
update facility_intelligence fi
set confidence_score = greatest(
  0,
  least(
    100,
      20
    + least(coalesce(jsonb_array_length(fi.detected_program_types), 0) * 8, 40)
    + least(coalesce(jsonb_array_length(fi.detected_insurance_carriers), 0) * 4, 20)
    + case
        when fi.matcher_summary is not null
         and fi.matcher_summary not ilike 'The crawler found limited structured%'
        then 10
        else 0
      end
    + case
        when coalesce(jsonb_array_length(fi.schema_gap_signals), 0) = 0 then 10
        when coalesce(jsonb_array_length(fi.schema_gap_signals), 0) = 1 then 5
        else 0
      end
  )
);
SQL 3 — counts
select
  (select count(*) from facility_sites) as facility_sites_total,
  (select count(*) from facility_seeds) as facility_seeds_total,
  (select count(*) from facility_crawl_results) as crawl_results_total,
  (select count(*) from facility_intelligence) as facility_intelligence_total;
SQL 4 — MAT audit
select
  fs.name,
  fi.confidence_score,
  fi.offers_outpatient,
  fi.mat_supported,
  fi.matcher_summary
from facility_intelligence fi
join facility_sites fs on fs.id = fi.facility_site_id
where fi.mat_supported is true
order by fi.confidence_score desc, fs.name
limit 10;
SQL 5 — professional-program audit
select
  fs.name,
  fi.confidence_score,
  fi.professional_program,
  fi.matcher_summary
from facility_intelligence fi
join facility_sites fs on fs.id = fi.facility_site_id
where fi.professional_program is true
order by fi.confidence_score desc, fs.name
limit 10;
Current true state at handoff
facility_sites_total = 5378
facility_seeds_total = 4890
facility_crawl_results_total = 80
facility_intelligence_total = 80
So the DB boot is real and underway.
Important code-state facts
facility_seeds was rebuilt from verified URL results
the bad unique domain index was dropped
facility_site_id is the real unique anchor
crawler batch size is currently 10
current pipeline is:
crawl batch
normalize
confidence score
audit
Known caution areas
The next chat should watch for drift in:
professional_program false positives
overly broad mat_supported
occasional low-confidence rows with limited structured signals
But do not broaden scope unless drift is obvious.
What to paste after each batch
Paste these after each crawler batch:
terminal crawler output
SQL 3 count result
SQL 4 MAT audit
SQL 5 professional audit
That is enough to monitor drift without flooding the browser.
Stop condition
Keep running until:
facility_crawl_results_total approaches facility_seeds_total
which means roughly 4890.
At that point, the initial facility intelligence boot is complete.