# NRIN — BROCHURE SURFACE V1

## Purpose

Define the facility brochure experience within NRIN.

This is the moment where a user moves from:
“this looks promising”

to:
“I could go here”

The brochure is the primary decision surface.

It must:
- build trust
- reduce fear
- make the facility feel real
- support a confident next step

It must NOT:
- feel like a dashboard
- feel like a chatbot
- feel like a list of extracted data

---

## Core Principle

NRIN does not show facilities.

NRIN:
introduces a place and helps the user understand it

---

## Interaction Entry Point

Triggered from:

src/components/patient/MatchCardStack.tsx

CTA:
Explore this option

Action:
- opens brochure surface (currently MatchDetailSheet.tsx)

---

## Surface Ownership

src/components/patient/MatchDetailSheet.tsx

This file becomes:

Facility Brochure Surface (V1)

Not:
- explanation drawer
- reasoning panel

---

## Information Hierarchy

### 1. Above the Fold (Critical)

Must show immediately:

- Facility name
- Location (city/state)
- One strong fit statement
- One calm reassurance line
- Primary CTA (visible or near-visible)

---

### Tone

- calm
- grounded
- human
- confident
- non-urgent

---

### Example

[Facility Name]  
Huntington Beach, California

A structured environment supporting detox and continued care.

This facility also appears to work with your insurance and offer medication-supported treatment.

[ Continue with this facility ]

---

## 2. What Stands Out (Mid Section)

Short, clean signals (NOT pills, NOT counts):

- Detox available
- Residential treatment available
- Dual-diagnosis support
- Accepts Blue Cross Blue Shield
- Family support programming

Rules:
- human-readable
- no snake_case
- no “detected”
- no numbers or scores

---

## 3. What to Expect Next

A short paragraph explaining:

- admissions team will contact you
- what happens after selection
- low-friction next step

Example:

If you choose this facility, their admissions team will reach out shortly to speak with you and confirm next steps.

---

## 4. Embedded Concierge (AI Assistant)

### Purpose

Provide contextual answers to user questions without replacing the brochure.

The assistant is:
a quiet guide inside the experience

Not:
- the primary interface
- a full chat takeover

---

### Placement

Lower in the brochure, after core content.

---

### Entry Points

- Have a question about this facility?
- Ask about insurance, detox, or what happens next

---

### Behavior

The assistant answers using:
- facility intelligence data
- evidence snippets
- normalized attributes
- known capabilities

---

### Tone Rules

- concise
- specific
- grounded
- no AI disclaimers
- no “as an AI”
- no hedging language

---

### Good Examples

- Yes, detox support appears to be available here.
- Blue Cross Blue Shield appears in the insurance evidence.
- Family programming is listed as available.

---

### Forbidden Language

- Based on detected signals…
- The system indicates…
- It appears likely that…
- As an AI…

---

## 5. Supporting Evidence (Lower Section)

Show:
- snippets
- source links

Purpose:
defend trust, not create it

Rules:
- lower on page
- visually quiet
- optional interaction

---

## 6. External Links (De-emphasized)

Facility website:
- allowed
- not primary
- not above the fold

NRIN should remain:
the main evaluation environment

---

## 7. Primary CTA (Commitment)

Label:
Continue with this facility

Placement:
- visible above the fold OR
- anchored clearly within reach

---

## CTA Meaning

This is the transition from:
evaluation

to:
activation

---

## Explicitly NOT in V1

Do NOT include:

- score displays
- badges or counts
- system language
- raw matcher reasoning
- chatbot-first interface
- multiple competing CTAs
- transport coordination
- intake forms

---

## Emotional Objective

The user should feel:

“This is a real place. I can go here.”

Not:

“This is a system suggesting something.”

---

## Strategic Role

This surface is what separates NRIN from:

- directories (Yellow Pages)
- aggregators
- lead funnels

This is:
the decision environment

---

## One-Line Summary

The brochure surface turns a recommendation into a place the user can understand, trust, and choose.
