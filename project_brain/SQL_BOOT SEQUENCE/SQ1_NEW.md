with ranked as (
  select
    s.facility_site_id,
    c.*,
    row_number() over (
      partition by s.facility_site_id
      order by c.created_at desc, c.id desc
    ) as rn
  from facility_crawl_results c
  join facility_seeds s
    on s.id = c.facility_seed_id
  where s.facility_site_id is not null
),
latest as (
  select *
  from ranked
  where rn = 1
)
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
  l.facility_site_id,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'detox'
  ) as offers_detox,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'residential'
  ) as offers_residential,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'php'
  ) as offers_php,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'iop'
  ) as offers_iop,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') in ('outpatient', 'op')
  ) as offers_outpatient,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'aftercare'
  ) as offers_aftercare,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'dual_diagnosis'
  ) as dual_diagnosis_support,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'mat'
  ) as mat_supported,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'sober_living'
  ) as sober_living_transition,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'family_program'
  ) as family_therapy_program,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.program_types, '[]'::jsonb)) p
    where lower(p->>'normalizedName') = 'professional_track'
  ) as professional_program,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') = 'medicaid'
  ) as accepts_medicaid_detected,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') = 'medicare'
  ) as accepts_medicare_detected,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') in (
      'aetna','cigna','blue_cross_blue_shield','united_healthcare',
      'humana','anthem','ambetter','molina','beacon','tricare'
    )
  ) as accepts_private_insurance_detected,

  exists (
    select 1
    from jsonb_array_elements(coalesce(l.insurance_carriers, '[]'::jsonb)) i
    where lower(i->>'normalizedName') = 'self_pay'
  ) as accepts_self_pay_detected,

  coalesce(
    (
      select jsonb_agg(distinct to_jsonb(i->>'normalizedName'))
      from jsonb_array_elements(coalesce(l.insurance_carriers, '[]'::jsonb)) i
    ),
    '[]'::jsonb
  ) as accepted_insurance_providers_detected,

  l.synopsis as matcher_summary,

  l.id as source_crawl_result_id,
  l.facility_seed_id as source_seed_id,
  l.created_at as last_crawled_at,
  now() as last_normalized_at,

  coalesce(l.program_types, '[]'::jsonb) as detected_program_types,
  coalesce(l.insurance_carriers, '[]'::jsonb) as detected_insurance_carriers,
  coalesce(l.raw_result->'schemaGapSignals', '[]'::jsonb) as schema_gap_signals,
  now() as updated_at
from latest l
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