select
  (select count(*) from facility_sites) as facility_sites_total,
  (select count(*) from facility_seeds) as facility_seeds_total,
  (select count(*) from facility_crawl_results) as crawl_results_total,
  (select count(*) from facility_intelligence) as facility_intelligence_total;
  