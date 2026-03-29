export type InsuranceCarrierDefinition = {
  key: string
  patterns: RegExp[]
}

export const INSURANCE_CARRIER_UNIVERSE: InsuranceCarrierDefinition[] = [
  {
    key: "aetna",
    patterns: [/\baetna\b/i],
  },
  {
    key: "cigna",
    patterns: [/\bcigna\b/i, /\bevernorth\b/i],
  },
  {
    key: "blue_cross_blue_shield",
    patterns: [
      /\bblue cross\b/i,
      /\bblue shield\b/i,
      /\bbcbs\b/i,
      /\bblue cross blue shield\b/i,
      /\bflorida blue\b/i,
      /\bempire bluecross\b/i,
      /\bpremera\b/i,
      /\bregence\b/i,
      /\bblue plan\b/i,
      /\blucet\/blue plan\b/i,
    ],
  },
  {
    key: "anthem",
    patterns: [/\banthem\b/i, /\belevance\b/i],
  },
  {
    key: "united_healthcare",
    patterns: [
      /\bunited healthcare\b/i,
      /\bunitedhealthcare\b/i,
      /\buhc\b/i,
      /\bunited behavioral health\b/i,
      /\bubh\b/i,
      /\boptum\b/i,
    ],
  },
  {
    key: "humana",
    patterns: [/\bhumana\b/i],
  },
  {
    key: "medicare",
    patterns: [/\bmedicare\b/i],
  },
  {
    key: "medicaid",
    patterns: [/\bmedicaid\b/i],
  },
  {
    key: "tricare",
    patterns: [/\btricare\b/i, /\btriwest\b/i],
  },
  {
    key: "ambetter",
    patterns: [/\bambetter\b/i],
  },
  {
    key: "molina",
    patterns: [/\bmolina\b/i],
  },
  {
    key: "beacon",
    patterns: [
      /\bbeacon\b/i,
      /\bbeacon health\b/i,
      /\bbeacon health options\b/i,
      /\bcarelon\b/i,
    ],
  },
  {
    key: "kaiser_permanente",
    patterns: [/\bkaiser permanente\b/i, /\bkaiser\b/i],
  },
  {
    key: "magellan",
    patterns: [/\bmagellan\b/i, /\bmagellan health\b/i],
  },
  {
    key: "healthnet",
    patterns: [/\bhealthnet\b/i, /\bhealth net\b/i],
  },
  {
    key: "providence",
    patterns: [/\bprovidence health plan\b/i, /\bprovidence\b/i],
  },
  {
    key: "va_community_care",
    patterns: [/\bva community care\b/i],
  },
]
