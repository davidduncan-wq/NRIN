import { LanguageMapping } from "./mappingTypes";

/**
 * v1 mapping dictionary
 * High-confidence only — no guessing
 */
export const LANGUAGE_MAPPINGS: LanguageMapping[] = [

  // ===== CLINICAL (CRITICAL) =====

  {
    phrase: "intensive outpatient program",
    normalized: "intensive outpatient program",
    mapsTo: {
      category: "clinical",
      tag: "IOP",
      weight: "critical",
    },
  },
  {
    phrase: "partial hospitalization program",
    normalized: "partial hospitalization program",
    mapsTo: {
      category: "clinical",
      tag: "PHP",
      weight: "critical",
    },
  },
  {
    phrase: "residential treatment",
    normalized: "residential treatment",
    mapsTo: {
      category: "clinical",
      tag: "RESIDENTIAL",
      weight: "critical",
    },
  },
  {
    phrase: "medical detox",
    normalized: "medical detox",
    mapsTo: {
      category: "clinical",
      tag: "DETOX",
      weight: "critical",
    },
  },

  // ===== MAT =====

  {
    phrase: "medication-assisted treatment",
    normalized: "medication assisted treatment",
    mapsTo: {
      category: "clinical",
      tag: "MAT",
      weight: "critical",
    },
  },
  {
    phrase: "suboxone",
    normalized: "suboxone",
    mapsTo: {
      category: "clinical",
      tag: "MAT_OPIOID",
      weight: "critical",
    },
  },
  {
    phrase: "buprenorphine",
    normalized: "buprenorphine",
    mapsTo: {
      category: "clinical",
      tag: "MAT_OPIOID",
      weight: "critical",
    },
  },

  // ===== DUAL DIAGNOSIS =====

  {
    phrase: "dual diagnosis",
    normalized: "dual diagnosis",
    mapsTo: {
      category: "clinical",
      tag: "DUAL_DX",
      weight: "critical",
    },
  },
  {
    phrase: "co-occurring disorders",
    normalized: "co occurring disorders",
    mapsTo: {
      category: "clinical",
      tag: "DUAL_DX",
      weight: "critical",
    },
  },

  // ===== EXPERIENCE (LOW WEIGHT) =====

  {
    phrase: "equine therapy",
    normalized: "equine therapy",
    mapsTo: {
      category: "experience",
      tag: "EQUINE",
      weight: "low",
    },
  },
  {
    phrase: "yoga",
    normalized: "yoga",
    mapsTo: {
      category: "experience",
      tag: "YOGA",
      weight: "low",
    },
  },
  {
    phrase: "fitness",
    normalized: "fitness",
    mapsTo: {
      category: "experience",
      tag: "FITNESS",
      weight: "low",
    },
  },

  // ===== ALUMNI / RETURN NARRATIVE =====

  {
    phrase: "alumni program",
    normalized: "alumni program",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "alumni support",
    normalized: "alumni support",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "alumni community",
    normalized: "alumni community",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "alumni network",
    normalized: "alumni network",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "continuing care",
    normalized: "continuing care",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "stay connected",
    normalized: "stay connected",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "welcome back",
    normalized: "welcome back",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "lifelong support",
    normalized: "lifelong support",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "recovery community",
    normalized: "recovery community",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "ongoing support after treatment",
    normalized: "ongoing support after treatment",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
  {
    phrase: "alumni discount",
    normalized: "alumni discount",
    mapsTo: {
      category: "narrative",
      tag: "ALUMNI_NARRATIVE",
      weight: "low",
    },
  },
];

/**
 * Normalize text for matching
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract mapping hits from raw text
 */
export function extractMappings(text: string) {
  const normalized = normalizeText(text);

  const hits = [];

  for (const mapping of LANGUAGE_MAPPINGS) {
    if (normalized.includes(mapping.normalized)) {
      hits.push({
        phrase: mapping.phrase,
        tag: mapping.mapsTo.tag,
        category: mapping.mapsTo.category,
        weight: mapping.mapsTo.weight,
      });
    }
  }

  return hits;
}

/**
 * Placeholder for reporting layer (STEP 2 will use this)
 */
export function initializeMappingStats(tags: string[]) {
  const stats: Record<
    string,
    {
      tag: string;
      beforeCount: number;
      afterCount: number;
      lift: number;
      supportingPhrases: string[];
    }
  > = {};

  for (const tag of tags) {
    stats[tag] = {
      tag,
      beforeCount: 0,
      afterCount: 0,
      lift: 0,
      supportingPhrases: [],
    };
  }

  return stats;
}
