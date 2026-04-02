import type { FormState } from "@/app/patient/page"

export type LifeFitProfile = {
  captureMode: "" | "full" | "skip"

  constraints: {
    needsToStayNearFamily?: boolean
    needsToStayNearWork?: boolean
    legalPressurePresent?: boolean
  }

  preferences: {
    wantsDistanceFromHome?: boolean
    preferredEnvironment?: string
    privacyImportant?: boolean
  }

  signals: {
    familyProgramDesired?: boolean
    professionalTrackDesired?: boolean
  }

  narrativeSummary: string
}

export function buildLifeFitProfile(form: FormState): LifeFitProfile {
  const notes = [
    form.workDailyLifeNotes,
    form.familyRelationshipNotes,
    form.locationEnvironmentNotes,
    form.treatmentGoalsNotes,
    form.additionalContextNotes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const captureMode = form.lifeFitCaptureMode || ""

  const needsToStayNearFamily =
    notes.includes("stay close") ||
    notes.includes("near family") ||
    notes.includes("close to home")

  const needsToStayNearWork =
    notes.includes("work") ||
    notes.includes("job") ||
    notes.includes("career")

  const wantsDistanceFromHome =
    notes.includes("get away") ||
    notes.includes("leave town") ||
    notes.includes("out of state")

  const legalPressurePresent =
    notes.includes("court") ||
    notes.includes("legal") ||
    notes.includes("probation") ||
    notes.includes("dui")

  const privacyImportant =
    notes.includes("private") ||
    notes.includes("confidential") ||
    notes.includes("discreet")

  const familyProgramDesired =
    notes.includes("family") ||
    notes.includes("kids") ||
    notes.includes("children") ||
    notes.includes("wife") ||
    notes.includes("husband")

  const professionalTrackDesired =
    notes.includes("pilot") ||
    notes.includes("airline") ||
    notes.includes("flight") ||
    notes.includes("faa") ||
    notes.includes("physician") ||
    notes.includes("doctor") ||
    notes.includes("nurse") ||
    notes.includes("rn") ||
    notes.includes("md") ||
    notes.includes("attorney") ||
    notes.includes("lawyer") ||
    notes.includes("esq") ||
    notes.includes("executive") ||
    notes.includes("professional") ||
    notes.includes("license") ||
    notes.includes("licensed") ||
    notes.includes("board") ||
    notes.includes("credential") ||
    notes.includes("monitoring") ||
    notes.includes("career") ||
    notes.includes("job") ||
    notes.includes("work") ||
    notes.includes("fired") ||
    notes.includes("lost my job")

  return {
    captureMode,
    constraints: {
      needsToStayNearFamily: needsToStayNearFamily || undefined,
      needsToStayNearWork: needsToStayNearWork || undefined,
      legalPressurePresent: legalPressurePresent || undefined,
    },
    preferences: {
      wantsDistanceFromHome: wantsDistanceFromHome || undefined,
      preferredEnvironment:
        form.environmentPreference && form.environmentPreference !== "close_to_home"
          ? form.environmentPreference
          : undefined,
      privacyImportant: privacyImportant || undefined,
    },
    signals: {
      familyProgramDesired: familyProgramDesired || undefined,
      professionalTrackDesired: professionalTrackDesired || undefined,
    },
    narrativeSummary: notes,
  }
}
