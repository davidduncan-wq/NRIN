import { FacilitySynopsisDraft, InsuranceDetection, ProgramDetection } from "./types"

export function parseSynopsis(
  insuranceDetections: InsuranceDetection[],
  programDetections: ProgramDetection[]
): FacilitySynopsisDraft {
  const insuranceNames = insuranceDetections.map((item) => item.normalizedName).slice(0, 4)
  const programNames = programDetections.map((item) => item.normalizedName).slice(0, 5)

  const parts: string[] = []
  const supportingSignals: string[] = []

  if (programNames.length > 0) {
    parts.push(`Detected program signals include ${humanizeList(programNames)}.`)
    supportingSignals.push(...programNames.map((name) => `program:${name}`))
  }

  if (insuranceNames.length > 0) {
    parts.push(`Insurance-related mentions include ${humanizeList(insuranceNames)}.`)
    supportingSignals.push(...insuranceNames.map((name) => `insurance:${name}`))
  }

  if (parts.length === 0) {
    parts.push("The crawler found limited structured treatment or insurance signals on the sampled pages.")
  }

  return {
    shortSynopsis: parts.join(" "),
    supportingSignals,
  }
}

function humanizeList(items: string[]): string {
  const readable = items.map((item) => item.replace(/_/g, " "))

  if (readable.length === 1) return readable[0]
  if (readable.length === 2) return `${readable[0]} and ${readable[1]}`
  return `${readable.slice(0, -1).join(", ")}, and ${readable[readable.length - 1]}`
}