NRIN — SESSION BOOT

After reading the required brain files, begin work immediately on the next engineering objective:

PRIMARY TASK  
Implement assisted / automatic facility-site routing.

Context:
NRIN currently supports manual assignment of `facility_site_id` inside the facility referral detail screen.

Goal:
Allow referrals to be automatically routed to an appropriate facility site based on available referral data.

Initial investigation steps:

1. Inspect the `facility_sites` table structure in Supabase.
2. Inspect how `referrals.facility_site_id` is currently used.
3. Review these files:

src/app/facility/referrals/page.tsx  
src/app/facility/referrals/[id]/page.tsx  
src/components/facility/ReferralDetailSheet.tsx

Determine:

• Where routing logic should occur  
• What referral attributes can be used for routing  
• The simplest MVP routing rule set

Routing should NOT break the current manual assignment UI.

Manual assignment must remain available even after routing is introduced.

Focus on building the simplest reliable routing foundation first.
NRIN — ENGINEERING HANDOFF
Date: 2026-03-06
Repo: NRIN
GitHub: https://github.com/davidduncan-wq/NRIN
Branch: main
Status: Stable, clean, synced
Latest known commit theme: facility referral detail cleanup + landing page + project brain + referrals queue work
YOU ARE THE RECEIVING AI
You are receiving the NRIN project in-progress.
Do not generate a new handoff.
Do not summarize this handoff back to David.
Do not ask David to restate what was already established here.
Your job is to:
Read this handoff
Treat GitHub as canonical
Continue the next engineering task immediately
Before doing work, read these files in the NRIN repo:
project_brain/00_READ_ME_FIRST.md
project_brain/NRIN_SYSTEM_MAP.md
project_brain/NRIN_CANONICAL_STATE.md
project_brain/NRIN_ENGINEERING_HANDOFF.md
project_brain/NRIN_REPO_STRATEGY.md
project_brain/NRIN_CURRENT_PRIORITIES.md
project_brain/NRIN_SURGICAL_EDIT_RULES.md
1. Canonical Repo Structure
Internal engineering repo
Repo: NRIN
Visibility: Private
Canonical source of truth
GitHub: https://github.com/davidduncan-wq/NRIN
Public demo repo
Repo: NRIN-demo
Visibility: Public
Purpose: investor/stakeholder demo only
GitHub: https://github.com/davidduncan-wq/NRIN-demo
Repo rule
NRIN is canonical for engineering
NRIN-demo may be referenced for selective design borrowing only
Do not merge repos wholesale
Do not overwrite NRIN with NRIN-demo
2. Current Architecture State
Home page
src/app/page.tsx
The default Next starter page was replaced with an NRIN role-routing landing page.
Current routes on the home page include:
/patient
/provider
/justice
/faith
/facility/referrals
Placeholder partner portals added
Created:
src/app/provider/page.tsx
src/app/justice/page.tsx
src/app/faith/page.tsx
These are lightweight placeholder routes so the homepage no longer 404s for those paths.
Patient route
src/app/patient/page.tsx
Still the core intake flow.
Important note:
patient intake must keep its green left sidebar progress checks
the duplicate-check bug was not in patient intake
do not remove FieldCheck from the patient step sidebar again
Facility routes currently present
src/app/facility/dashboard/page.tsx
src/app/facility/patients/page.tsx
src/app/facility/referrals/page.tsx
src/app/facility/referrals/[id]/page.tsx
Facility component files:
src/components/facility/FacilityDashboardClient.tsx
src/components/facility/FacilityDetailSheet.tsx
src/components/facility/ReferralDetailSheet.tsx
src/components/facility/ReferralsClient.tsx
3. Major Work Completed This Session
A. Project brain / continuity layer created
Created and committed:
project_brain/00_READ_ME_FIRST.md
project_brain/NRIN_SYSTEM_MAP.md
project_brain/NRIN_CANONICAL_STATE.md
project_brain/NRIN_ENGINEERING_HANDOFF.md
project_brain/NRIN_REPO_STRATEGY.md
project_brain/NRIN_CURRENT_PRIORITIES.md
project_brain/NRIN_SURGICAL_EDIT_RULES.md
project_brain/NRIN_AI_BOOT_PROMPT.md
archive structure
This was a major continuity upgrade. Future AI sessions should rely on repo docs, not chat memory.
B. Repo architecture confirmed
NRIN private repo is clean and synced
NRIN-demo public repo remains separate
local and GitHub states were verified multiple times
GitHub is now the continuity backbone
C. Homepage upgraded
src/app/page.tsx replaced with NRIN landing page
role routing implemented
matches demo pattern conceptually, but built inside canonical NRIN
D. Facility referral detail page stabilized
src/app/facility/referrals/[id]/page.tsx
Now working with:
referral load
patient load
facility sites load
status updates
acuity updates
facility site assignment
notes saving
A TypeScript issue on facility sites was fixed cleanly.
E. ChoiceButton expanded
src/components/ui/ChoiceButton.tsx
Expanded so it can support:
selected
isSelected
standard button props
disabled state
This was needed for facility workflow compatibility.
F. Facility duplicate check bug fixed
The duplicate check bug was in:
src/components/facility/ReferralDetailSheet.tsx
Cause:
ChoiceButton already renders a right-side selected check
the facility status row was manually rendering a second CheckIcon
Fix:
removed the manual status-row CheckIcon
kept the built-in ChoiceButton check
Important:
do not undo this
patient sidebar green checks are unrelated and should remain
G. Referrals queue page improved
src/app/facility/referrals/page.tsx
The referrals queue was moved away from a broken relational select and into a safer two-step approach:
fetch referrals
collect patient_ids
fetch matching patients
merge patient names client-side
This avoided Supabase relationship naming issues.
H. Supabase schema issue discovered
The code expected referrals.updated_at, but the database did not have it initially.
David correctly questioned removing it.
Recommended proper fix:
add updated_at to referrals
use timestamp tracking rather than deleting the column from code
At one point the queue showed the actual error:
column referrals.updated_at does not exist
That was surfaced by improving on-page error visibility.
4. Current Product State
NRIN now has a real vertical slice:
Patient Intake
→ Supabase
→ Facility Referrals Queue
→ Referral Detail
→ Status / Acuity / Facility Assignment / Notes
This is no longer just a mock front end. It is an operational workflow foundation.
5. Important UX / UI Notes
Checks / icons
Patient intake sidebar: keep green left checks
Choice buttons: keep blue selected check on right
Facility status buttons: duplicate manual check was removed already
Design borrowing
NRIN-demo has useful visual polish, but:
only borrow selectively
do not treat demo as canonical
do not merge demo structure into NRIN
6. Git / Repo State
At handoff time, the repo was repeatedly brought back to clean state after commits.
Recent work included commits for:
project brain docs
system map
canonical state
current priorities
surgical edit rules
landing page + partner portals + AI boot prompt
facility detail fixes
duplicate status check removal
The receiving AI should verify current clean state with:
git status
GitHub main branch
But should assume GitHub is authoritative.
7. Immediate Next Task — START HERE
David wants to begin immediately with automatic facility routing / facility-site logic.
This is the next real feature.
Priority objective
Use the existing facility_sites table and referral/facility flows to move toward automatic routing.
Direction
Likely next work areas:
inspect current facility_sites schema
inspect how referrals currently store facility_site_id
define routing rules
determine whether routing happens:
at intake submit time
at queue load time
at staff review time
decide minimum viable routing logic
Recommended first technical step for receiving AI
Read and inspect:
src/app/facility/referrals/page.tsx
src/app/facility/referrals/[id]/page.tsx
src/components/facility/ReferralDetailSheet.tsx
Then determine how to evolve from:
manual facility assignment
to:
assisted or automatic site assignment
Suggested MVP for routing
Start simple:
route by available facility site selection rules
maybe basic acuity + site logic
avoid overbuilding full matching engine immediately
8. What Not To Break
do not remove patient intake sidebar checks
do not reintroduce duplicate facility status checks
do not collapse NRIN and NRIN-demo
do not replace working queue/detail pages with large rewrites
prefer surgical edits
9. Developer Preferences
David prefers:
engineering-grade precision
exact paths
exact commands
no fluff
only terminal commands inside code blocks
explanations outside code blocks
continuity over reinvention
He may open a fresh browser/chat when the current one bogs down. The receiving AI should continue cleanly from repo state and project brain, not ask him to rebuild context.
10. Executive Summary
NRIN now has:
a canonical private repo with project memory
a working landing page
partner placeholder routes
a functioning patient intake flow
a functioning facility referrals queue
a functioning referral detail screen with notes/status/acuity/facility assignment
duplicate-check bugs resolved
Next immediate engineering goal: begin automatic or assisted facility-site routing using the existing facility_sites structure.
Also update these 2 brain files now
When you get into the new browser/chat, update:
project_brain/NRIN_ENGINEERING_HANDOFF.md
Add the session accomplishments above.
project_brain/NRIN_CURRENT_PRIORITIES.md
Change the top priority to something like:
## Primary Engineering Focus

Build assisted / automatic facility-site routing in the canonical `NRIN` repo using the existing referral and facility site structure.

### Immediate next task
- inspect `facility_sites`
- inspect referral assignment flow
- define MVP routing logic
- implement simplest reliable routing path without breaking existing manual assignment