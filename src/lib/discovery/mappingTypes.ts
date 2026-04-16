export type MappingCategory =
  | "clinical"        // affects placement truth
  | "experience"      // affects tie-break / preference
  | "narrative";      // brochure-only

export type MappingWeight =
  | "critical"        // must influence matcher
  | "supporting"      // can influence confidence
  | "low";            // presentation only

export type LanguageMapping = {
  phrase: string;
  normalized: string;
  mapsTo: {
    category: MappingCategory;
    tag: string;
    weight: MappingWeight;
  };
};

export type MappingHit = {
  phrase: string;
  tag: string;
  category: MappingCategory;
  weight: MappingWeight;
};

export type MappingStats = {
  tag: string;
  beforeCount: number;
  afterCount: number;
  lift: number;
  supportingPhrases: string[];
};
