# NRIN — SIGNAL VOCABULARY V1 — 2026-04-06

## Purpose

Define the first formal vocabulary layer for NRIN signal detection.

This file exists to separate:

1. **clinical truth**
2. **experience / lifestyle differentiation**
3. **narrative / marketing language**
4. **noise / weak signal**

This vocabulary is not just for phrase detection.
It is the doctrine for how language should affect:

- structured truth
- matcher eligibility
- ranking / tie-breaking
- brochure presentation
- Queue B correction work

---

## Core Principle

NRIN must not confuse:

- what sounds attractive
- with what determines fit

A facility can sound beautiful and still be clinically wrong.

Therefore language must be separated into layers with different weights.

---

## Signal Layers

### Layer 1 — Clinical Truth Vocabulary
These signals may affect structured truth and matching eligibility.

### Layer 2 — Experience / Lifestyle Vocabulary
These signals may affect ranking, preference, and brochure presentation, but should not override clinical truth.

### Layer 3 — Narrative / Marketing Vocabulary
These signals may help brochure tone but should not count as capability truth.

### Layer 4 — Noise / Weak Signal
These signals should be ignored or strongly downweighted.

---

# 1. CLINICAL TRUTH VOCABULARY

## 1A. Levels of Care

### DETOX
**Canonical tag:** `DETOX`

**High-confidence phrases**
- detox
- medical detox
- medically supervised detox
- detoxification
- withdrawal management
- withdrawal symptoms management

**Likely-support phrases**
- medically monitored withdrawal
- supervised withdrawal
- safe withdrawal process

**Structured field target**
- `facility_intelligence.offers_detox`

**Weight**
- critical

**False-positive cautions**
- generic educational discussion of detox only
- blog content not tied to offered services
- “detox from stress / social media / wellness detox” style language

---

### RESIDENTIAL
**Canonical tag:** `RESIDENTIAL`

**High-confidence phrases**
- residential treatment
- residential rehab
- inpatient residential
- live on-site
- residential program

**Likely-support phrases**
- structured residential environment
- residential level of care
- stay on campus during treatment

**Structured field target**
- `facility_intelligence.offers_residential`

**Weight**
- critical

**False-positive cautions**
- references to referral partners only
- alumni housing without residential treatment
- sober living language used without clinical residential care

---

### PHP
**Canonical tag:** `PHP`

**High-confidence phrases**
- partial hospitalization program
- php
- day treatment
- full-day treatment

**Likely-support phrases**
- structured day programming
- intensive day treatment
- hospital-level day programming

**Structured field target**
- `facility_intelligence.offers_php`

**Weight**
- critical

**False-positive cautions**
- article pages explaining PHP generally
- comparison blogs not indicating facility offering

---

### IOP
**Canonical tag:** `IOP`

**High-confidence phrases**
- intensive outpatient program
- iop
- intensive outpatient treatment
- half-day treatment

**Likely-support phrases**
- structured outpatient support
- flexible structured care
- several treatment sessions per week

**Structured field target**
- `facility_intelligence.offers_iop`

**Weight**
- critical

**False-positive cautions**
- generic outpatient language without intensity
- educational content comparing IOP vs PHP

---

### OUTPATIENT
**Canonical tag:** `OUTPATIENT`

**High-confidence phrases**
- outpatient treatment
- outpatient program
- outpatient rehab

**Likely-support phrases**
- flexible outpatient care
- attend treatment while living at home

**Structured field target**
- `facility_intelligence.offers_outpatient`

**Weight**
- critical

**False-positive cautions**
- general healthcare outpatient references unrelated to SUD / behavioral health

---

### AFTERCARE
**Canonical tag:** `AFTERCARE`

**High-confidence phrases**
- aftercare
- continuing care
- alumni program
- relapse prevention
- extended care
- ongoing recovery support

**Likely-support phrases**
- continued support after treatment
- post-treatment planning
- discharge support continuum

**Structured field target**
- `facility_intelligence.offers_aftercare`

**Weight**
- supporting

**False-positive cautions**
- broad recovery language without actual post-discharge programming

---

## 1B. Clinical / Co-Occurring Support

### DUAL DIAGNOSIS
**Canonical tag:** `DUAL_DX`

**High-confidence phrases**
- dual diagnosis
- co-occurring disorders
- co-occurring mental health conditions
- mental health and addiction treatment side-by-side

**Likely-support phrases**
- treating addiction and mental health together
- integrated behavioral health and substance use care

**Structured field target**
- `facility_intelligence.dual_diagnosis_support`

**Weight**
- critical

**False-positive cautions**
- general mention of mental health with no co-treatment claim

---

### MAT
**Canonical tag:** `MAT`

**High-confidence phrases**
- medication-assisted treatment
- medication assisted treatment
- medication for opioid use disorder
- mat program

**Likely-support phrases**
- medication support for recovery
- medication-based recovery support

**Structured field target**
- `facility_intelligence.mat_supported`

**Weight**
- critical

**False-positive cautions**
- vague “medication management” in psychiatric context only
- educational content about MAT not tied to facility offering

---

### MAT_OPIOID
**Canonical tag:** `MAT_OPIOID`

**High-confidence phrases**
- suboxone
- buprenorphine
- methadone
- vivitrol
- naltrexone for opioid dependence
- buprenorphine naloxone

**Likely-support phrases**
- opioid treatment medication
- opioid recovery medication support

**Structured field target**
- `facility_intelligence.mat_supported`

**Weight**
- critical

**False-positive cautions**
- risk / contraindication pages
- medication warnings with no offering claim

---

## 1C. Structured Clinical Support Signals

### LEVEL_OF_CARE
**Canonical tag:** `LEVEL_OF_CARE`

**High-confidence phrases**
- level of care
- levels of care
- appropriate level of care

**Use**
- support signal for program truth, not standalone truth

**Weight**
- supporting

---

### TREATMENT_PLAN
**Canonical tag:** `TREATMENT_PLAN`

**High-confidence phrases**
- individualized treatment plan
- personalized treatment plan
- comprehensive treatment plan

**Use**
- confidence booster
- not a program-type field

**Weight**
- supporting

---

# 2. EXPERIENCE / LIFESTYLE VOCABULARY

## Principle

These terms matter.
They should be preserved and surfaced.
But they should not override clinical fit.

They influence:
- tie-breaking
- patient preference
- brochure conversion
- presentation of facility identity

---

## 2A. Body / Modality / Practice

### YOGA
**Canonical tag:** `YOGA`
- yoga
- trauma-informed yoga
- yoga therapy

### FITNESS
**Canonical tag:** `FITNESS`
- fitness
- gym
- exercise program
- movement program
- personal training

### MEDITATION
**Canonical tag:** `MEDITATION`
- meditation
- guided meditation
- mindfulness practice
- mindfulness meditation

### EQUINE
**Canonical tag:** `EQUINE`
- equine therapy
- horse therapy
- equine-assisted therapy

### ART_THERAPY
**Canonical tag:** `ART_THERAPY`
- art therapy
- creative expression therapy

### SOMATIC
**Canonical tag:** `SOMATIC`
- somatic therapy
- nervous system regulation
- body-based healing

---

## 2B. Environment / Setting

### LUXURY
**Canonical tag:** `LUXURY`
- luxury rehab
- luxury treatment
- upscale amenities
- private chef
- private rooms

### NATURE
**Canonical tag:** `NATURE`
- ocean view
- beachfront
- mountain setting
- wilderness setting
- scenic property
- natural surroundings

### HOME_LIKE
**Canonical tag:** `HOME_LIKE`
- home-like environment
- comfortable rooms
- feels like home
- welcoming environment

---

## 2C. Social / Family / Identity

### FAMILY_SUPPORT
**Canonical tag:** `FAMILY_SUPPORT`
- family therapy
- family program
- family support
- family sessions
- loved ones included

### PROFESSIONAL_TRACK
**Canonical tag:** `PROFESSIONAL_TRACK`
- executive program
- professional program
- licensing support
- board monitoring support

### VETERAN_FOCUS
**Canonical tag:** `VETERAN_FOCUS`
- veterans program
- veteran support
- military recovery support

---

## Experience Layer Weight Rule

All experience-layer signals default to:
- weight: low
- matcher effect: tie-break only
- brochure effect: strong

---



# 2B. IDENTITY / POPULATION SUPPORT (LGBTQ)

## Principle

Identity signals must be handled carefully.

They should:
- never override clinical fit
- strongly influence ranking when relevant
- distinguish between marketing language and real capability

---

## LGBTQ_GENERAL
**Canonical tag:** `LGBTQ_GENERAL`

**Phrases**
- lgbtq
- lgbtq+
- inclusive environment
- affirming environment
- safe space
- all identities welcome

**Weight**
- low (experience layer)

**Notes**
- often marketing language
- should not imply programmatic support

---

## LGBTQ_PROGRAM
**Canonical tag:** `LGBTQ_PROGRAM`

**Phrases**
- lgbtq program
- lgbtq-specific treatment
- lgbtq track
- affirming care program
- inclusive treatment program

**Weight**
- medium

**Notes**
- indicates some structured support
- still requires validation

---

## TRANS_SUPPORT
**Canonical tag:** `TRANS_SUPPORT`

**High-confidence phrases**
- transgender support
- transgender program
- trans-specific treatment
- support for transgender clients
- nonbinary support
- gender-affirming care
- gender-affirming therapy

**Higher clinical indicators**
- hormone therapy coordination
- hrt support
- gender dysphoria treatment
- transition support during treatment
- gender-affirming medical coordination

**Weight**
- medium → high (when patient need present)

**Matcher behavior**
- dormant unless patient signals identity need
- becomes strong ranking factor when active

**False-positive cautions**
- generic inclusivity statements without services
- blog content not tied to actual offering

---

## Identity Layer Rule

Identity support:
- does NOT create eligibility
- does NOT override clinical requirements
- DOES influence ranking when clinically appropriate options exist




## ALUMNI_NARRATIVE
**Canonical tag:** `ALUMNI_NARRATIVE`

**Purpose**
Capture what facilities actually say to returning clients / alumni.

This is not clinical truth.
This is not a capability field.
This is an explanation / continuity / presentation signal.

**Phrases**
- alumni program
- alumni support
- alumni community
- alumni network
- continuing care
- stay connected
- welcome back
- lifelong support
- recovery community
- relapse prevention community
- ongoing support after treatment

**Possible commercial / return language**
- return to treatment
- returning clients
- former clients
- alumni discount
- preferred alumni rate
- readmission support

**Weight**
- low

**Matcher behavior**
- never creates eligibility
- never overrides red-check gaps
- may be surfaced when:
  - patient has prior treatment at that facility
  - facility still fits current needs
  - or facility does not fit, but the system needs to explain why familiarity is not enough

**Use in presentation**
Example:
- "You indicated prior treatment at HBFC. HBFC describes alumni support as: [snippet]."

**False-positive cautions**
- general recovery community language
- broad aftercare claims without a real alumni path
- discount / return marketing that does not imply capability


# 3. NARRATIVE / MARKETING VOCABULARY

## Purpose

These phrases may help explain how a facility speaks,
but they should not count as structured capability truth.

Examples:
- every step of the way
- dedicated to
- here to help
- focus on
- our goal is to
- compassionate care
- lasting recovery
- personalized care
- safe place to heal

These may be useful in:
- brochure tone
- summary writing
- facility voice detection

They should not by themselves trigger:
- DETOX
- MAT
- DUAL_DX
- IOP / PHP / RESIDENTIAL

---

# 4. NOISE / WEAK SIGNAL

## Purpose

These phrases should be ignored or heavily downweighted.

### Navigation / CTA
- skip to content
- contact us
- learn more
- verify insurance
- call now
- request a callback

### Generic grammatical glue
- have a
- here to
- of their
- every step
- dedicated to
- goal is to
- focus on

### Weak broad healthcare language
- quality care
- range of services
- support you
- helping you heal

These do not establish facility truth.

---

# 5. WEIGHT / EFFECT RULES

## Critical
Affects:
- structured truth candidate
- matcher eligibility
- Queue B correction priority

Examples:
- DETOX
- RESIDENTIAL
- PHP
- IOP
- DUAL_DX
- MAT

## Supporting
Affects:
- confidence
- interpretation
- corroboration

Examples:
- levels of care
- treatment plan
- continuum of care

## Low
Affects:
- ranking tie-break
- presentation
- brochure narrative

Examples:
- yoga
- equine
- fitness
- luxury
- home-like
- nature

---

# 6. QUEUE B USE

Queue B should prioritize facilities where:

1. clinical truth fields are false / null
2. but clinical vocabulary strongly appears in surviving language

Examples:
- `mat_supported = false/null` but strong MAT vocabulary appears
- `offers_detox = false/null` but detoxification / withdrawal management language appears
- `dual_diagnosis_support = false/null` but co-occurring language appears

This is the first evidence-driven correction queue.

---

# 7. CURRENT OBSERVATIONS FROM LIVE DISCOVERY

## Strong clinical signal already surfacing
- dual diagnosis
- co-occurring disorders
- intensive outpatient program
- partial hospitalization program
- medication-assisted treatment
- suboxone / buprenorphine
- medical detox
- level of care

## Strong lifestyle / presentation signal already surfacing
- yoga
- fitness
- luxury amenities
- home-like environment
- transformative environment

## Strong narrative noise already surfacing
- every step of the way
- dedicated to
- here to help
- focus on
- goal is to

Meaning:
The system is successfully distinguishing:
- truth
- experience
- fluff

But clinical recall still needs hardening.

---

# 8. NEXT BUILD TARGET

1. Expand clinical synonym vocabulary
2. Separate experience scoring from truth scoring
3. Add Queue B report:
   - before truth
   - language support
   - probable missed truth
4. Expand experience vocabulary without allowing it to contaminate eligibility

---

## One-Line Summary

NRIN must preserve all meaningful language —
but only clinical truth vocabulary may determine fit,
while lifestyle vocabulary shapes preference,
and marketing vocabulary stays out of truth.
