export function scoreCandidateLink(url: string): number {
  const lower = url.toLowerCase()

  let score = 0

  const positive = [
    "detox",
    "treatment",
    "program",
    "programs",
    "levels-of-care",
    "residential",
    "outpatient",
    "php",
    "iop",
    "dual",
    "co-occurring",
    "opioid",
    "suboxone",
    "buprenorphine",
    "naltrexone",
    "vivitrol",
    "insurance",
    "verify-insurance",
    "admissions"
  ]

  const negative = [
    "blog",
    "news",
    "press",
    "careers",
    "team",
    "about"
  ]

  for (const keyword of positive) {
    if (lower.includes(keyword)) score += 5
  }

  for (const keyword of negative) {
    if (lower.includes(keyword)) score -= 5
  }

  return score
}