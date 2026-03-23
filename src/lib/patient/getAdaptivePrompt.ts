export type AdaptivePromptKind =
  | "employment"
  | "family"
  | "housing"
  | "location"

export type AdaptivePromptInput = {
  workDailyLifeNotes?: string
  familyRelationshipNotes?: string
  locationEnvironmentNotes?: string
  currentLocation?: string
  sleptLastNight?: string
  isCurrentlyHomeless?: string
  hasChildren?: boolean | null
  isMarried?: boolean | null
}

export type AdaptivePrompt = {
  kind: AdaptivePromptKind
  prompt: string
  reason: string
  placeholder: string
  ctaLabel: string
  skipLabel: string
}

function hasText(value?: string) {
  return (value ?? "").trim().length > 0
}

export function hasSufficientSignalForMoreOptions(
  input: AdaptivePromptInput,
): boolean {
  const employmentDone = hasText(input.workDailyLifeNotes)
  const familyDone =
    hasText(input.familyRelationshipNotes) ||
    input.hasChildren !== null ||
    input.isMarried !== null
  const housingDone =
    hasText(input.sleptLastNight) ||
    hasText(input.currentLocation) ||
    hasText(input.isCurrentlyHomeless)
  const locationDone = hasText(input.locationEnvironmentNotes)

  const completedCount = [
    employmentDone,
    familyDone,
    housingDone,
    locationDone,
  ].filter(Boolean).length

  return completedCount >= 2
}

export function getAdaptivePrompt(
  input: AdaptivePromptInput,
): AdaptivePrompt | null {
  if (!hasText(input.workDailyLifeNotes)) {
    return {
      kind: "employment",
      prompt: "Tell me what you do.",
      reason:
        "I’m asking because some programs are built around careers, licensing issues, and getting people back to work safely.",
      placeholder:
        "Example: I’m a pilot and I may get grounded. I’m a nurse. I’m unemployed right now. I own a business.",
      ctaLabel: "Save and continue",
      skipLabel: "Skip this for now",
    }
  }

  const familyDone =
    hasText(input.familyRelationshipNotes) ||
    input.hasChildren !== null ||
    input.isMarried !== null

  if (!familyDone) {
    return {
      kind: "family",
      prompt: "Tell me about your family.",
      reason:
        "I’m asking because some facilities have strong family programs, reunification support, and help for people trying to repair life at home.",
      placeholder:
        "Example: I have two kids. I’m married but things are rough. I’m going through a divorce. My family is very involved.",
      ctaLabel: "Save and continue",
      skipLabel: "Skip this for now",
    }
  }

  const housingDone =
    hasText(input.sleptLastNight) ||
    hasText(input.currentLocation) ||
    hasText(input.isCurrentlyHomeless)

  if (!housingDone) {
    return {
      kind: "housing",
      prompt: "What’s your living situation right now?",
      reason:
        "I’m asking because housing stability changes what level of support is realistic and safe after treatment.",
      placeholder:
        "Example: I’m staying with a friend. I’m homeless. I have an apartment but it’s not stable. I can go back home.",
      ctaLabel: "Save and continue",
      skipLabel: "Skip this for now",
    }
  }

  if (!hasText(input.locationEnvironmentNotes)) {
    return {
      kind: "location",
      prompt: "Tell me what kind of place you want.",
      reason:
        "I’m asking because if geography, family proximity, or environment matters, we should account for that before showing more options.",
      placeholder:
        "Example: I want to stay near my kids. I want to get out of town. I prefer California. I want somewhere quiet.",
      ctaLabel: "Save and continue",
      skipLabel: "Skip this for now",
    }
  }

  return null
}
