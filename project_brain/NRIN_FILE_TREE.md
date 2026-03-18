.
├── data
│   └── joint_commission_facilities.csv
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── project_brain
│   ├── 00_READ_ME_FIRST.md
│   ├── AI_SESSION_PROTOCOL.md
│   ├── archive
│   │   └── NRIN_v1_ARCHITECTURE_MEMORY_2026-03-06.md
│   ├── curent_boot.md
│   ├── CURRENT_HANDOFF.md
│   ├── handoffs
│   │   ├── new.md
│   │   ├── NRIN_HANDOFF_2026_03_08_all_day.md
│   │   ├── NRIN_HANDOFF_2026_03_08_midnight_Stop.md
│   │   ├── NRIN_HANDOFF_2026-03_09_Midnight_STOP
│   │   ├── NRIN_HANDOFF_2026-03-06_4PM_STOP
│   │   ├── NRIN_HANDOFF_2026-03-06_4PM_STOP.md
│   │   ├── NRIN_HANDOFF_2026-03-07_5:15 Start
│   │   ├── NRIN_HANDOFF_2026-03-07_5:15_START.md
│   │   ├── NRIN_HANDOFF_2026-03-07_5:15_STOP.md
│   │   ├── NRIN_HANDOFF_2026-03-07_9:15pm_STOP
│   │   ├── NRIN_HANDOFF_2026-03-07_9:15pm_STOP.md
│   │   ├── NRIN_HANDOFF_2026-03-09_1pm_STOP
│   │   ├── NRIN_HANDOFF_2026-03-17_all_day_and_night_stop_10:30pm.md
│   │   ├── STOP_03.07.26_PATIENT_INTAKE_LOCKED.md
│   │   ├── tempboot.md
│   │   └── tempHandoffafterbootdbdone.md
│   ├── matching
│   │   ├── Brain_Worthy_entries_match.md
│   │   ├── implementation_Map.md
│   │   └── NRIN_MATCH_PRESENTATION_V1.md
│   ├── NEXT_BUILD_TARGET.md
│   ├── NEXT_SESSION_BOOT.md
│   ├── NRIN_AI_BOOT_PROMPT.md
│   ├── NRIN_CANONICAL_STATE.md
│   ├── NRIN_CRAWLER_RESULT_SCHEMA.md
│   ├── NRIN_CURRENT_PRIORITIES.md
│   ├── NRIN_DECISION_LOG.md
│   ├── NRIN_DESIGN_SYSTEM.md
│   ├── NRIN_ENGINEERING_HANDOFF.md
│   ├── NRIN_FACILITY_ATTRIBUTE_SCHEMA.md
│   ├── NRIN_FACILITY_DASHBOARD_BLUEPRINT.md
│   ├── NRIN_FILE_TREE.md
│   ├── NRIN_MATCHING_DOCTRINE.md
│   ├── NRIN_MATCHING_PHILOSOPHY.md
│   ├── NRIN_PRODUCT_ARCHITECTURE.md
│   ├── NRIN_PRODUCT_VISION.md
│   ├── NRIN_PROJECT_INDEX.md
│   ├── NRIN_REPO_STRATEGY.md
│   ├── NRIN_SURGICAL_EDIT_RULES.md
│   ├── NRIN_SYSTEM_MAP.md
│   ├── project_brain
│   │   ├── Crawler
│   │   │   ├── CRAWLER_POST_MORDUM_DBBOOT.md
│   │   │   ├── temoboot.md
│   │   │   └── temp_crawl.md
│   │   └── project_brainDiscovery
│   │       ├── NRIN_CRAWLER_EVOLUTION_DISCOVERY.md
│   │       ├── NRIN_MATCH_EXPLANAITION_ENGINE.md
│   │       └── NRIN_MATCHING_EXPANSION_DISCOVERY.md
│   └── SQL_BOOT SEQUENCE
│       ├── SQ1_NEW.md
│       ├── SQL 1-Normalize_crawler_output.md
│       ├── SQL2-Confidence_distribution.md
│       ├── SQL3-Crawl_progress_dashboard.md
│       ├── SQL4-MAT_programs_detected.md
│       └── SQL5-Professional_programs_detected.md
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── scripts
│   ├── runFacilityCrawler.ts
│   ├── runFacilityCrawlerBatch.ts
│   ├── testMatching.ts
│   └── url
│       ├── buildGoogleQuery.ts
│       ├── crawlFacilitySeeds.ts
│       ├── crawlFacilitySeeds.ts.bak_20260312_113331
│       ├── extractDomainForSearch.ts
│       ├── loadJointCommissionCsv.ts
│       ├── normalizeFacilityUrls.ts
│       ├── prepareFacilitySeedList.ts
│       ├── pushSeedsToSupabase.ts
│       ├── resolveFacilityDomain.ts
│       ├── resolveMissingFacilitiesDomainsNoSearch.ts
│       ├── resolveMissingFacilityDomains.ts
│       ├── resolveMissingFacilityDomainsNoSearch.ts
│       ├── searchFacilityCandidates.ts
│       ├── seedCrawlerFromFacilitySites.ts
│       ├── seedCrawlerFromVerificationResults.ts
│       ├── seedFromFacilitySites.ts
│       ├── testDomainExtract.ts
│       ├── testFacilitySeed.ts
│       ├── testGoogleQuery.ts
│       ├── testNormalizer.ts
│       └── verifyFacilityDomains.ts
├── src
│   ├── app
│   │   ├── api
│   │   │   └── match
│   │   ├── facility
│   │   │   ├── dashboard
│   │   │   ├── patients
│   │   │   ├── referrals
│   │   │   └── test
│   │   ├── faith
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── justice
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── patient
│   │   │   ├── components
│   │   │   ├── matches
│   │   │   └── page.tsx
│   │   └── provider
│   │       └── page.tsx
│   ├── components
│   │   ├── facility
│   │   │   ├── FacilityDashboardClient.tsx
│   │   │   ├── FacilityDetailSheet.tsx
│   │   │   ├── FacilityOperationsPanel.tsx
│   │   │   ├── FacilityProfilePanel.tsx
│   │   │   ├── FacilityVerificationPanel.tsx
│   │   │   ├── ReferralDetailSheet.tsx
│   │   │   └── ReferralsClient.tsx
│   │   ├── matching
│   │   │   ├── FacilityMatchCard.tsx
│   │   │   ├── FacilityMatchDetailSheet.tsx
│   │   │   ├── MatchDeck.tsx
│   │   │   ├── MatchReasonList.tsx
│   │   │   └── MatchScorePill.tsx
│   │   ├── patient
│   │   │   ├── MatchCardStack.tsx
│   │   │   └── MatchDetailSheet.tsx
│   │   └── ui
│   │       ├── CheckIcon.tsx
│   │       ├── ChoiceButton.tsx
│   │       ├── DateInput.tsx
│   │       ├── FieldCheck.tsx
│   │       ├── Input.tsx
│   │       ├── InputBase.ts
│   │       ├── PhoneInput.tsx
│   │       └── Select.tsx
│   ├── crawler
│   │   ├── crawlFacility.ts
│   │   ├── detectSignals.ts
│   │   ├── extractInteralLinks.ts
│   │   ├── fetchPages.ts
│   │   ├── parseInsurance.ts
│   │   ├── parsePrograms.ts
│   │   ├── parseSynopsis.ts
│   │   ├── scoreCandidateLinks.ts
│   │   ├── stripHtml.ts
│   │   └── types.ts
│   └── lib
│       ├── matching
│       │   ├── buildMatchExplanation.ts
│       │   ├── buildMatchViewModel.ts
│       │   ├── buildPatientProfile.ts
│       │   ├── fetchFacilityMatches.ts
│       │   ├── hardFilters.ts
│       │   ├── matchPatientToFacilities.ts
│       │   ├── scoreConfidence.ts
│       │   ├── scoreInsurance.ts
│       │   ├── scorePrograms.ts
│       │   ├── scoreSpecialties.ts
│       │   └── types.ts
│       ├── routing
│       │   └── routeReferral.ts
│       └── supabaseClient.ts
├── sync_brain.sh
├── tmp
│   ├── blocked_domains.txt
│   ├── crawler-batch-input-40.json
│   ├── crawler-batch-input.json
│   ├── crawler-batch-summary.json
│   ├── crawler-result-abc-recovery.json
│   ├── crawler-result-altus-recovery.json
│   ├── crawler-result-american-addiction-centers.json
│   ├── crawler-result-banyan-treatment.json
│   ├── crawler-result-beachway-therapy.json
│   ├── crawler-result-betty-ford-center.json
│   ├── crawler-result-brightquest-treatment.json
│   ├── crawler-result-capistrano-by-the-sea.json
│   ├── crawler-result-caron-treatment.json
│   ├── crawler-result-center-for-discovery.json
│   ├── crawler-result-cirque-lodge.json
│   ├── crawler-result-cliffside-malibu.json
│   ├── crawler-result-cottonwood-tucson.json
│   ├── crawler-result-delphi-health.json
│   ├── crawler-result-demo.json
│   ├── crawler-result-elevations-rtc.json
│   ├── crawler-result-facility-001.json
│   ├── crawler-result-futures-recovery.json
│   ├── crawler-result-gateway-foundation.json
│   ├── crawler-result-hacienda-valdez.json
│   ├── crawler-result-hazelden-betty-ford.json
│   ├── crawler-result-hazelden.json
│   ├── crawler-result-lakeview-health.json
│   ├── crawler-result-malibu-detox.json
│   ├── crawler-result-meadows-arizona.json
│   ├── crawler-result-menninger-clinic.json
│   ├── crawler-result-michaels-house.json
│   ├── crawler-result-mountainside-treatment.json
│   ├── crawler-result-newport-healthcare.json
│   ├── crawler-result-oasis-recovery.json
│   ├── crawler-result-ohana-recovery.json
│   ├── crawler-result-passages-malibu.json
│   ├── crawler-result-promises-malibu.json
│   ├── crawler-result-ranch-recovery.json
│   ├── crawler-result-recovery-unplugged.json
│   ├── crawler-result-reflections-malibu.json
│   ├── crawler-result-sandstone-care.json
│   ├── crawler-result-seasons-malibu.json
│   ├── crawler-result-serenity-malibu.json
│   ├── crawler-result-sierra-tucson.json
│   ├── crawler-result-silver-hill-hospital.json
│   ├── crawler-result-solution-point.json
│   ├── crawler-result-southern-california-recovery.json
│   ├── crawler-result-summit-malibu.json
│   ├── crawler-result-timberline-knolls.json
│   ├── domain_verification_broken_only.csv
│   ├── domain_verification_redirected_only.csv
│   ├── domain_verification_results.csv
│   ├── domain_verification_results.json
│   ├── facility_crawl_22p05_manual_review.ndjson
│   ├── facility_crawl_skip_seed_ids.txt
│   ├── google_repair_queue_filtered.csv
│   ├── google_repair_queue_final.csv
│   ├── google_repair_queue_unresolved_after_nosearch.csv
│   ├── google_repair_queue.csv
│   └── manual_review_queue.csv
├── tree.txt
├── tsconfig.json
└── tsconfig.tsbuildinfo

38 directories, 210 files
