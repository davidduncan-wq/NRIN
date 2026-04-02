# NRIN — QUEUE B / QUEUE C DOCTRINE — 2026-04-02

## Purpose

This document defines the boundary between Queue B and Queue C after:
- crawler v1 completion
- Queue A insurance resolver work
- geo backfill and desert-market testing
- direct matcher inspection against real facilities

The key discovery from this phase:

NRIN now has enough data in the DB that the next step is not broad crawling.
The next step is better reading, clarification, and verification of facility truth.

---

# Queue B

## Definition

Queue B is a **DB-native truth clarification and scope-correction layer**.

Queue B does **not** crawl.

Queue B reads what NRIN already has in:
- `facility_sites`
- `facility_intelligence`
- existing crawler-derived evidence fields
- resolver outputs
- known anomaly cases surfaced by matcher testing

Queue B exists to identify where the system already knows enough, but is not yet seeing clearly.

---

## Queue B is for

Queue B should answer:

- which facilities already have enough evidence for detox / MAT / family / insurance truth but are under-ranked or under-read
- which facilities are over-ranked because signal verbosity is being mistaken for facility quality
- which local market results look wrong because truth is fragmented or weakly normalized
- which facility rows are suspiciously thin relative to likely real-world importance
- which site-level truths are likely present in current DB fields but not coherently surfaced

---

## Queue B is not for

Queue B is **not**:
- broad recrawl
- discovery of new facilities
- UI work
- ranking hacks
- manual review

Queue B is not crawler v2.
Queue B is not another acquisition phase.

Queue B is a **clarification pass over existing truth**.

---

## Queue B output

Queue B may:
- identify missing or weakly expressed matcher-facing truth
- identify fields that should be normalized or promoted
- identify facilities that require Queue C verification
- produce candidate lists for high-value truth recovery

Queue B should improve the quality of:
- program truth
- MAT truth
- family-program truth
- insurance truth
- site-level specificity
- local-market coherence

---

## Queue B trigger criteria

A facility or market belongs in Queue B when one or more are true:

- strong local or strategic importance
- suspiciously weak site truth
- anomalous matcher result
- likely truth fragmentation across fields
- evidence of over-ranking by verbosity
- evidence of under-ranking by under-read truth

---

# Queue C

## Definition

Queue C is **NRIN Verified from Web / Facility**.

Queue C is NRIN's human verification layer for site-specific matcher truth, using:
- website review
- phone verification
- reviewer judgment
- structured evidence capture

Queue C exists because some truths are easy for an experienced human to verify and hard for automated systems to infer reliably.

---

## Core principle

Queue C must be built with the express purpose of answering the signals sent from patient intake on behalf of each:
- facility
- facility site
- location-specific treatment surface

Queue C is matcher-facing, site-specific truth verification.

---

## Queue C task surface

Each Queue C task should tee up what NRIN already knows.

A reviewer should see:

- facility name
- facility site / location
- city / state
- website
- phone number
- current detected truth
- current missing / ambiguous truth
- existing evidence where available

Queue C is not a blank form.
Queue C starts from current NRIN knowledge and asks the reviewer to verify, correct, or extend it.

---

## Queue C must capture

### Program / clinical truth
- detox
- residential
- PHP
- IOP
- outpatient
- MAT
- dual diagnosis support
- family program
- professional program

### Finance / admissions truth
- accepts private insurance
- exact insurance carriers listed
- Medicaid / Medicare / VA / Tricare if explicit
- self-pay mentioned
- admissions phone
- insurance page URL
- exact pasted insurance list where possible

### Location / identity truth
- this location vs brand-wide statement
- whether the page clearly applies to this site
- whether phone number is site-relevant
- any mismatch between corporate claims and local offerings

### Evidence capture
- source URL
- exact snippet or pasted evidence
- review method:
  - web
  - phone
  - both
- reviewer confidence:
  - high
  - medium
  - low

---

## Queue C internal reviewer layer

Queue C should also include an internal reviewer section that remains hidden for now.

This is not core matcher truth.
This is internal NRIN intelligence.

Examples:
- reviewer quality impression
- sophistication of programming
- salesy vs clinically serious tone
- ambiguity / concern notes
- LGBTQ+ responsiveness
- trans-specific responsiveness / competence
- whether answers suggest real tolerance / experience vs generic scripting

This layer is:
- internal
- structured
- evidence-based where possible
- not surfaced publicly
- not directly merged into hard matcher truth at this stage

---

## Queue C and LGBTQ / trans-specific assessment

Queue C may include internal reviewer observations about:
- LGBTQ+ responsiveness
- trans-specific competence or discomfort
- tone of staff response on phone
- quality of website language around inclusion
- whether the facility demonstrates actual fluency vs vague reassurance

This must remain:
- hidden
- internal
- separated from objective matcher truth for now

Suggested labels:
- supportive / competent
- neutral / unclear
- evasive / vague
- concerning

Reviewer must note whether the judgment came from:
- web
- phone
- both

---

## Queue C reviewer type

Queue C assumes a skilled reviewer with substantial SUD experience.

This is not generic data entry.
The reviewer should be able to:
- read a treatment site intelligently
- notice ambiguity
- interpret program language
- detect when a facility is overselling or underspecifying
- make careful internal observations without polluting objective truth fields

---

## Queue C workflow

Suggested statuses:
- new
- in_review
- verified_web
- verified_phone
- verified_both
- needs_supervisor
- unable_to_verify
- complete

Suggested actions:
- save draft
- mark complete
- escalate
- skip / unable to verify
- move to next facility

---

## Queue C writeback rule

Queue C should not write directly into matcher-facing truth with no audit trail.

Preferred pattern:

### review table
Store:
- facility_site_id
- reviewer
- reviewed_at
- review method
- verified fields
- evidence URL
- snippet
- notes
- status

### writeback phase
A controlled writeback step can then promote verified truth into:
- `facility_intelligence`
- or a future `facility_verified_truth` layer

This preserves auditability and prevents sloppy direct overwrite.

---

## Queue C v1 scope

Start narrow.

Queue C v1 should verify only the fields that most affect matching:

- detox
- residential
- MAT
- family program
- accepts private insurance
- exact listed insurance carriers
- admissions phone
- exact source URL
- reviewer assessment

Do not start with a giant universal review form.

---

# Strategic summary

## Queue A
Resolver-style truth correction for a narrow automated class of problems.

## Queue B
DB-native truth clarification and scope correction using existing NRIN data.

## Queue C
NRIN human verification layer for site-specific matcher truth using web and phone review.

---

## One-line summary

Queue B clarifies what NRIN already knows.
Queue C verifies what NRIN still needs a skilled human to confirm.
