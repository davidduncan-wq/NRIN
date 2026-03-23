# NRIN — LIFE FIT AND PREFERENCE DOCTRINE

## Purpose

This document defines the patient-side life-fit and preference layer for NRIN matching.

NRIN should not only determine what level of care a patient may need.
It should also help identify what kind of place the patient is most likely to trust, choose, enter, and complete.

This layer exists to capture:
- real-world constraints
- personal preferences
- family and career considerations
- life context that meaningfully affects placement fit

It is the patient-side counterpart to the facility-side intelligence layer.

---

## Core Matching Hierarchy

NRIN match ranking follows:

1. clinical/logistical need
2. financial accessibility
3. life-fit / patient preference

Life-fit should not rescue a clinically inappropriate placement.
But it should strongly shape ranking and final selection among clinically appropriate, financially plausible options.

---

## Product Rule

This step is optional enrichment, not required friction.

Patients must be allowed to choose among three modes:

- full sharing
- light sharing
- skip entirely

If a patient says, in effect, “just show me the best fit,” NRIN should respect that and proceed without penalty.

---

## UX Principle

The step should feel like:

- respectful
- optional
- useful
- human

It should not feel like:

- interrogation
- therapy
- mandatory disclosure
- a nosy form

NRIN should communicate:

We already understand the care you may need.
This step helps us find a place that fits your life, not just your treatment.

---

## Why This Layer Matters

Two patients with the same clinical needs may require very different placements.

Examples:
- one patient may need to stay close to children or work
- another may need to leave town entirely
- one may need a professional track or monitoring support
- another may need family programming or privacy
- one may prefer quiet, nature, or coastal treatment
- another may want urban structure or no preference at all

Without this layer, NRIN can produce a clinically valid recommendation.
With this layer, NRIN can produce a recommendation that is clinically valid and personally right.

---

## Data Philosophy

This layer should collect two kinds of information:

### 1. Constraints
Factors that limit what is realistically workable.

Examples:
- must stay near family
- must stay near work
- professional monitoring needs
- job sensitivity
- court or legal pressure
- family obligations
- privacy concerns

### 2. Preferences
Factors that differentiate among otherwise viable options.

Examples:
- wants to get away
- coastal / mountains / desert / urban preference
- family program desired
- professional track desired
- faith preference
- gender-specific preference
- environment preference

---

## Capture Model

Preferred intake model:

guided conversational prompts, 3–5 turns max

Not:
- rigid form grids
- endless questionnaire
- one vague giant textbox

The experience should feel like:
someone smart asking just enough to help

Prompts should remain skippable and lightweight.

---

## Canonical Prompt Areas

### Prompt 1
Tell us a little about your work or daily responsibilities.

### Prompt 2
Is there anything about your family or relationships we should consider?

### Prompt 3
Do you want to stay close to home, or get away for treatment?
Any preference for environment — city, quiet, coastal, mountains, etc.?

### Prompt 4
What do you hope this treatment helps you change or accomplish?

### Prompt 5
Anything else you want us to know?

---

## Structured Output Target

The conversational layer should produce a structured profile that can be used by the matcher.

Canonical target fields:

- captureMode
- workDailyLifeNotes
- familyRelationshipNotes
- locationEnvironmentNotes
- treatmentGoalsNotes
- additionalContextNotes

- professionType
- professionOther
- workSensitive
- monitoringProgramNeeded
- jobAtRisk

- familyInvolvementImportant
- hasChildrenConsideration
- marriageRelationshipStrain
- familyProgramDesired

- geographicPreference
- preferredEnvironment
- wantsDistanceFromHome
- needsToStayNearFamily
- needsToStayNearWork

- privacyImportant
- professionalTrackDesired
- faithPreference
- genderSpecificPreference

- legalPressurePresent
- courtOrderedConcern

- primaryGoal
- primaryGoalOther

- matcherNarrativeSummary

---

## Skip Rule

If the patient skips this layer:

- do not penalize
- do not block progress
- do not over-infer
- proceed with matching using:
  - clinical need
  - financial accessibility
  - neutral preference baseline

Skip is a valid user choice.

---

## Matching Interpretation

### Stronger ranking signals
These should influence ranking more heavily when present:

- needsToStayNearFamily
- needsToStayNearWork
- monitoringProgramNeeded
- legalPressurePresent
- courtOrderedConcern
- familyProgramDesired
- professionalTrackDesired

### Softer tie-breaker signals
These should help differentiate among viable options:

- preferredEnvironment
- geographicPreference
- privacyImportant
- faithPreference
- genderSpecificPreference

---

## Relationship To Facility Intelligence

This patient-side doctrine is meant to pair with facility-side intelligence.

Facility-side intelligence already includes and/or is expected to deepen around:
- detox
- MAT
- family program
- professional program
- and additional quality-of-fit attributes as crawler intelligence expands

This doctrine should evolve in parallel with crawler 2.0 and matcher expansion, so patient-side preferences and facility-side attributes can be aligned cleanly.

---

## Strategic Reminder

NRIN should not only answer:

What level of care does this patient need?

It should also answer:

What kind of place is this patient most likely to trust, choose, enter, and complete?

That is the difference between a clinically valid recommendation and a truly placement-ready recommendation.
