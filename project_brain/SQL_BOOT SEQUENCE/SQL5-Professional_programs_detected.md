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