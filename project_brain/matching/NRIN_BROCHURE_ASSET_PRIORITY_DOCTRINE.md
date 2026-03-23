# NRIN — BROCHURE ASSET PRIORITY DOCTRINE

## Purpose

This document defines the priority order for facility-facing presentation assets and language used in NRIN recommendation and brochure surfaces.

The goal is to ensure NRIN increasingly allows a facility to present itself, while preserving a reliable fallback when richer facility-authored or crawler-derived assets are not available.

---

## Asset and Language Priority Order

### 1. Facility-provided assets and language (highest priority)

Primary source:
- facility onboarding
- facility dashboard uploads
- facility-managed content

Examples:
- approved logo
- approved hero images
- approved color accents
- facility description copy
- program descriptions
- preferred wording for amenities, specialties, and care tracks

Rule:
- when facility-provided assets exist, they override crawler-derived and normalized presentation content

---

### 2. Crawler-derived facility assets and language (secondary)

Secondary source:
- crawler 2.0 extraction from facility website and related public surfaces

Examples:
- facility verbiage from site copy
- logo / favicon
- brand color hints
- hero/OG imagery
- treatment descriptions
- program phrasing
- facility-specific tone and terminology

Rule:
- crawler-derived presentation should be used when no facility-provided asset exists
- crawler-derived language is preferred over normalized/system-generated phrasing when confidence is sufficient

---

### 3. Normalized NRIN presentation layer (tertiary / fallback)

Fallback source:
- normalized view-model language
- canonical NRIN wording

Examples:
- "Detox available"
- "Insurance accepted"
- "MAT available"
- "Multiple levels of care"

Rule:
- normalized phrasing is the fallback when neither facility-provided nor crawler-derived presentation content is available or trustworthy
- normalized language should remain calm, human, and concise

---

## Product Rule

NRIN should increasingly feel like:
- the facility presenting itself inside a trusted recommendation system

Not:
- the system paraphrasing facilities forever

---

## Strategic Principle

The long-term hierarchy is:

1. facility-authored truth
2. facility-discovered truth
3. system-normalized truth

This doctrine should govern:
- recommendation cards
- brochure surfaces
- drill-down detail experiences
- future branded facility experiences

---

## Implementation Reminder

This doctrine does not change matcher logic priority.

It governs only:
- presentation assets
- presentation language
- brand expression
- brochure/drill-down experience

Matcher logic remains separate from presentation shaping.
