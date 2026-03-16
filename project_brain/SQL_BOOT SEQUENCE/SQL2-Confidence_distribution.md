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