select
  name,
  confidence_score,
  offers_outpatient,
  mat_supported,
  matcher_summary
from facility_intelligence
where mat_supported = true
order by confidence_score desc
limit 10;