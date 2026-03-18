Implementation map

Use this as the bridge between the brain file and code.

1. src/lib/matching/buildMatchViewModel.ts

This file owns presentation shaping.

Target responsibilities:

presentation.title

presentation.subtitle

presentation.location

presentation.logoUrl

presentation.heroImageUrl

presentation.primaryCtaLabel

presentation.explanationCtaLabel

explanation.summary

Rules:

no raw matcher language

no score explanation copy

summary should sound human, not machine

2. src/lib/matching/fetchFacilityMatches.ts

This file owns asset and identity intake.

Target responsibilities:

pass through city

pass through website

pass through logoUrl when available

later: heroImageUrl

Rules:

database fields only in .select()

object shaping only in mapRowToFacility()

3. src/lib/matching/types.ts

This file owns the interface contract.

Required separation:

FacilityMatchingInput may carry optional identity/media fields

FacilityMatchResult may carry passthrough presentation fields

no design decisions here, only shape

4. src/lib/matching/matchPatientToFacilities.ts

This file should remain logic-only except for passthrough of presentation-safe fields:

logoUrl

website

city

matcherSummary

No scoring changes.
No hard-filter changes.

5. src/components/patient/MatchCardStack.tsx

This file should only render the approved presentation model.

Should render:

title

subtitle

location if present

optional logo/image

one primary CTA

one explanation CTA

minimal navigation

Should not render:

badges

raw reasons on card

score breakdowns

system labels

6. src/components/patient/MatchDetailSheet.tsx

This file becomes the explanation surface.

Should render:

humane explanation summary first

reasons/evidence second

links third

Hierarchy:

summary

evidence cards

source links

7. src/app/patient/matches/page.tsx

This file owns page composition, not design language decisions.

Should:

fetch real facilities

preserve demo fallback

pass view models down cleanly

Should not:

contain presentation logic

Immediate next build target

Implement V1 using this order:

finalize buildMatchViewModel.ts as the presentation boundary

strip MatchCardStack.tsx down to facility-first rendering only

move explanation emphasis into MatchDetailSheet.tsx

test with one real logo candidate

stop and assess before any hero-image work

Continuity notes worth preserving

The important project truths from this session:

real matching works against facility_intelligence

identity comes from facility_sites

evidence-backed reasons work

logos alone do not solve design

favicon/logo is supporting identity, not hero content

the OpenAI fingerprint problem is mostly component grammar and page composition, not just colors

the correct hierarchy is:

facility sells itself

explanation sells the recommendation

evidence defends the explanation

The one thing that stands out as easy to lose across chats is this:
do not keep iterating Tailwind classes blindly inside components.
The right boundary is:

design intent in brain/spec

presentation shaping in view model

rendering in component

That is the ball to keep your eye on.