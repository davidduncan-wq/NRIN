# CURRENT_HANDOFF.md

Current NRIN development handoff.
This file reflects the active engineering state of the project and the immediate next build direction.

---

## 1. Current Project State

NRIN patient intake remains the canonical front door and is functioning through submit.

The intake flow now performs a full relational create sequence on final submit:

1. create patient
2. create case
3. create referral linked to case

This means the system now has a real workflow backbone:

patients
→ cases
→ referrals

This is a major architectural milestone.
NRIN is no longer only an intake form plus referral surface.
It now has a durable case layer that can support matching, facility selection, pre-screen, acceptance / rejection, rerouting, and admissions operations.

---

## 2. Code Changes Completed This Session

### A. Patient intake final submit now creates a case
File:
- `src/app/patient/page.tsx`

Completed:
- After patient creation, intake now inserts a row into `public.cases`
- New case starts with:
  - `state = NEW_INTAKE`

### B. Referral now links to case
File:
- `src/app/patient/page.tsx`

Completed:
- `referrals.case_id` is now populated from the created case id
- Final intake submit flow now creates:
  - patient
  - case
  - referral linked to case

### C. Step 2 address flow rewritten for ZIP-first UX
File:
- `src/app/patient/components/Step2Contact.tsx`

Completed:
- Address order is now:
  - Home / primary address
  - ZIP
  - City
  - State
- ZIP tab order now lands before city/state
- ZIP auto-fills city and state
- Design system and layout rhythm intentionally preserved

### D. ZIP lookup now also captures coordinates
Files:
- `src/app/patient/components/Step2Contact.tsx`
- `src/app/patient/page.tsx`

Completed:
- ZIP lookup now stores:
  - `addressLatitude`
  - `addressLongitude`
- Final patient payload now writes:
  - `address_latitude`
  - `address_longitude`

### E. Local lint/dependency issue repaired
Files:
- `package.json`
- `package-lock.json`

Completed:
- local eslint dependency state was repaired after reinstall
- `eslint-config-next` spec changed from exact to caret version
- project installs successfully again

---

## 3. Supabase Schema Changes Completed This Session

### A. Created `public.cases`
Completed:
- `id`
- `patient_id`
- `state`
- `selected_facility_id`
- `match_score`
- `notes`
- `created_at`
- `updated_at`

### B. Added `updated_at` automation for cases
Completed:
- update trigger function
- update trigger on `public.cases`

### C. Added indexes for cases
Completed:
- patient lookup index
- state lookup index

### D. Added `case_id` to referrals
Completed:
- `referrals.case_id uuid references cases(id)`

### E. Added patient coordinate columns
Completed:
- `patients.address_latitude`
- `patients.address_longitude`

---

## 4. Verified Working Outcomes

The following were explicitly tested and confirmed working:

- patient created
- case created
- referral created
- referral linked to case
- ZIP autofill working in Step 2
- lat/long saved to patients table

This means the intake → case → referral chain is live and verified.

---

## 5. Current Architectural Reality

The system now has enough structure to support the next real phase:

Patient Intake
↓
Case Created
↓
Initial Match Universe
↓
Patient sees several strong fits
↓
Preference refinement
↓
Shortlist interaction
↓
Treatment center pre-screen
↓
Accept / Reject / Reroute

Important product realization from this session:

Do NOT force all patient preference questions into the initial intake.
Instead:

- initial intake should gather hard facts
- after final submit, a second stage should say:
  “We found several strong fits for you”
- then the system should ask narrowing questions and preferences
- then present a serious shortlist UI

This is now the preferred product direction.

---

## 6. Updated Matching / Routing Philosophy

Routing should not be simplistic “same state first.”

Current working conceptual order:

### Hard gates
1. facility legitimacy / verification (future gate)
2. acuity gate
3. insurance gate
4. logistics gate

### Soft scoring / narrowing
5. patient preference
6. state / out-of-state context
7. geography / distance
8. response speed / operational readiness

Important note:
Patient needs come first.
Operational speed, timers, and routing convenience must never override proper patient placement.

---

## 7. Product Decisions Clarified This Session

### A. Preference questions should come after intake submit
Examples:
- stay near family vs leave home state
- west coast / east coast
- ocean / island / mountain / desert / middle of country
- ability to fly
- desire to leave current environment

These are better handled in a post-submit narrowing flow rather than bloating the initial intake.

### B. Future shortlist interaction
The final shortlist should use a serious card-based swipe / keep / pass interaction.
Tone should be clinical and supportive, not playful.
Facility brochure cards should eventually pull from TC website / database content.

### C. Future patient and facility texting loop
Future state should support:
- patient gets shortlist link by text
- patient returns via secure case-specific link
- once patient engages, next-steps text is sent
- treatment center point person gets alerted
- pre-screen can begin immediately

### D. Future TC response timer
Time matters.
Eventually, once a patient expresses interest, the TC should receive a timed response window.
If they fail to respond in time, the system should move on rather than let the patient stall.

### E. Future facility operational status
Bed count may be useful later, but a simpler early operational signal is likely better:
- accepting now
- accepting later
- not accepting

If “accepting later,” the system should require a date/time.

---

## 8. Important Facility Data Reality

`facility_sites` currently includes:
- city
- postal_code
- latitude
- longitude
- insurance flags
- program fields

But observed sample rows show many facility sites still have:
- `latitude = null`
- `longitude = null`

This means geographic routing is conceptually ready, but facility geocoding completeness still needs to be assessed before full proximity routing becomes trustworthy.

Also:
No current bed count field was found in the sampled `facility_sites` structure.
Operational availability likely needs a future dedicated model rather than being treated as static site metadata.

---

## 9. Immediate Next Build Order

Next session should begin with product / architecture alignment, not random coding.

Recommended order:

1. design post-submit “we found several strong fits” flow
2. define shortlist interaction UX
3. define preference refinement questions
4. inspect and redesign `src/lib/routing/routeReferral.ts` around real routing needs
5. decide whether routing returns one facility or ranked top 3–5
6. define canonical case-state model around this flow
7. then begin treatment-center-side pre-screen design

Do NOT jump straight into broad routing rewrites without first locking the post-submit shortlist flow.

---

## 10. Exact Files Changed This Session

Code:
- `src/app/patient/page.tsx`
- `src/app/patient/components/Step2Contact.tsx`
- `package.json`
- `package-lock.json`

Supabase:
- `public.cases` created
- trigger / indexes added
- `referrals.case_id` added
- `patients.address_latitude` added
- `patients.address_longitude` added

---

## 11. Canonical Repo

Engineering repo:
- `https://github.com/davidduncan-wq/NRIN`

GitHub remains canonical.
If David confirms a push, GitHub is authoritative.

---

## 12. New AI Session Starting Point

The next AI should NOT create a new handoff.
It is the receiver.

The next AI should begin by reading the required brain files and then continue as the active engineering AI for NRIN.

The first real discussion next session should be:

“How should the post-submit shortlist and preference refinement flow work before we rewrite routing?”