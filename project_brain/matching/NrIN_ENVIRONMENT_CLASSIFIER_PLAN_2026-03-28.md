project_brain/matching/NRIN_ENVIRONMENT_CLASSIFIER_PLAN_2026-03-28.md
CONTENT ↓
NRIN — ENVIRONMENT CLASSIFIER PLAN — 2026-03-28
Purpose

Define the first-pass classifier plan for deriving facility environment attributes from existing location data.

This plan exists to support:

objective environment truth
canonical matcher inputs
later crawler 2.0 enrichment
future reporting on environment preference vs outcome
Core Principle

Phase 1 environment classification must be:

objective
deterministic
based on existing facility location data
simple enough to implement now
extensible later

Do not begin with marketing language.
Do not begin with free-text adjectives from websites.
Do not build scoring rules before classifier rules exist.

Inputs Available Now
facility latitude
facility longitude
facility city
facility state
Phase 1 Outputs
{
  region: "west_coast" | "east_coast" | "midwest" | "southwest" | "southeast" | "northeast" | null,
  coastal_flag: boolean,
  desert_flag: boolean,
  mountain_flag: boolean,
  density_class: "urban" | "suburban" | "rural" | null,
  classifier_version: "v1"
}
Phase 1A — Region Mapping
west_coast
CA
OR
WA
east_coast
ME, NH, MA, RI, CT
NY, NJ, DE, MD
VA, NC, SC, GA, FL
midwest
OH, MI, IN, IL, WI
MN, IA, MO
ND, SD, NE, KS
southwest
AZ, NM, NV, UT
southeast
AL, MS, LA, TN, KY, AR
Rule

Each facility gets one canonical region.

No multi-region assignment in v1.

Phase 1B — Proximity
close_to_home
open_to_travel

Separate from region. Never mix.

Phase 1C — Terrain Flags

Support later:

coastal
desert
mountain

Rule:
Only classify when high confidence. Otherwise leave null.

Phase 1D — Density
urban
suburban
rural

Status: not reliable yet → leave null

Immediate Priority

First scoring target:

👉 west_coast

BUT:

must be implemented via region classifier
NOT string hack
One-Line Summary

Start with region classification from state → then layer terrain → then crawler enrichment.

After you paste

Run this (optional but clean):