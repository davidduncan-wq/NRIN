# NRIN — NEEDS / WANTS / OFFERINGS DOCTRINE

## Purpose

This document defines the separation between:
- what the patient needs
- what the patient wants
- what a facility offers

This distinction is core to how NRIN should recommend treatment centers.

NRIN should not collapse these into one blended surface.

---

## Core Principle

NRIN should first determine:
- what the patient needs

Then NRIN should show:
- which facilities deliver that need

Only after that, if the patient is not satisfied with the options shown, should NRIN ask for more preference detail in order to refine the recommendation.

---

## Layer 1 — Patient Need

This is the first and most important layer.

Examples:
- detox required or not
- MAT required or not
- level of care required
- dual diagnosis support needed
- insurance fit
- family support needed
- work / professional program needs when relevant

This layer is:
- clinical
- logistical
- practical
- recommendation-driving

This is what NRIN should be willing to say:

"This is what the system recommends for you."

---

## Layer 2 — Facility Offering

Once need is determined, NRIN should evaluate facilities against that need.

The recommendation cards should not feel like:
- random facility features
- brochure facts in isolation
- generic directory listings

They should feel like:
- these are the treatment centers that deliver what you need

The recommendation surface should communicate:

"Here are the treatment centers that deliver what we agree you need."

This means the UI should increasingly behave like:
- patient need criteria first
- facility pass/fail or facility match second

Not:
- facility brochure facts first

---

## Layer 3 — Patient Want / Preference

This layer becomes more important only after need has been established and initial matching has been shown.

Examples:
- preferred geography
- close to family
- wants to get out of town
- mountains / desert / island / city
- work / licensing concerns
- family reunification priorities
- identity / safety considerations
- general environment preference

This layer should not rescue a clinically inappropriate match.

It should refine recommendation among clinically and financially appropriate options.

This is where NRIN can say:

"You don't like these options? Tell us more and we'll improve the recommendation."

---

## Product Flow Doctrine

### Pass 1 — Need-first recommendation
NRIN determines:
- what the patient needs

Then shows:
- treatment centers that satisfy that need

### Pass 2 — Preference-refined recommendation
Only if the patient is not satisfied with the options shown should NRIN gather more detail about wants and preferences.

Then NRIN refines the recommendation.

This creates the correct sequence:

1. determine need
2. show facilities that deliver it
3. gather more wants only if necessary
4. refine recommendation

---

## AIR / Adaptive Prompt Rule

Adaptive questioning should not interrupt the patient during Step 5 just because a field was skipped or incomplete.

Adaptive questioning should only be triggered when:
- the patient has already received a recommendation
- the patient asks for more treatment center options
- the system determines that more preference signal is needed to improve the next recommendation pass

This means AIR belongs behind:
- "See more options"
- "Show me more treatment centers"
- similar expansion or refinement actions

Not behind:
- initial Step 5 freeform entry itself

---

## Recommendation Surface Rule

The recommendation surface should make clear:

1. what NRIN recommends for the patient
2. that the shown facilities deliver that recommendation
3. that additional detail from the patient can improve the next recommendation pass if needed

The surface should avoid implying that:
- every shown facility is equally random
- all facility features are equally important
- wants matter more than need

---

## Signal / Pill Rule

Signal pills should increasingly represent:
- patient need criteria
- then facility verification against those criteria

Rather than:
- random facility brochure facts

This means the interaction should evolve toward:

- criterion first
- facility check second

Example:
- Detox
- MAT support
- Insurance accepted
- Multiple levels of care
- Family support
- Professional support

Then the facility is checked against those criteria.

---

## Strategic Reminder

NRIN is not just a treatment directory.
NRIN is not just a brochure system.
NRIN is not just a matching widget.

NRIN should increasingly behave like:
- an intelligent need-first recommendation system
- followed by a preference-refined recommendation system
- grounded in real facility delivery capability

---

## One-Line Summary

First determine what the patient needs.
Then show which facilities deliver it.
If the patient wants better or different options, gather more preference detail and refine the recommendation.
