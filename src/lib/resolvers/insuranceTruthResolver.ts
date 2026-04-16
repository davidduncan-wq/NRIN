export type InsuranceResolution = {
  acceptsPrivateInsuranceResolved: boolean | null;
  acceptedPrivateInsuranceCarriersResolved: string[];
  confidence: number;
  reason: string;
};

const PRIVATE_CARRIERS = [
  "aetna",
  "cigna",
  "blue cross",
  "blue shield",
  "bcbs",
  "united",
  "uhc",
  "humana",
  "anthem",
  "kaiser",
  "tricare",
];

const PRIVATE_PHRASES = [
  "private insurance",
  "commercial insurance",
  "most private insurance",
  "most commercial insurance",
  "most major insurance",
  "most major insurers",
  "major insurance plans",
  "major insurers",
  "most insurance plans",
  "accept most insurance",
  "accepts most insurance",
  "in-network with most major insurers",
];

const NEGATION_PHRASES = [
  "does not accept",
  "do not accept",
  "not accepted",
  "does not take",
  "do not take",
  "excluding",
  "except",
  "no medicaid",
  "no medicare",
  "self pay only",
  "cash pay only",
  "private pay only",
];

function hasAnyPhrase(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function normalizeEvidence(input: {
  accepted_insurance_providers_detected: string[] | null;
  detected_insurance_carriers: any[] | null;
}) {
  const detected = (input.accepted_insurance_providers_detected ?? []).map((x) =>
    x.toLowerCase(),
  );

  const rawObjects = input.detected_insurance_carriers ?? [];
  const rawJoined = rawObjects.map((x) => JSON.stringify(x).toLowerCase());

  const snippets: string[] = [];

  for (const item of rawObjects) {
    const evidence = Array.isArray(item?.evidence) ? item.evidence : [];
    const rawMentions = Array.isArray(item?.rawMentions) ? item.rawMentions : [];

    for (const ev of evidence) {
      if (typeof ev?.snippet === "string" && ev.snippet.trim()) {
        snippets.push(ev.snippet.toLowerCase());
      }
    }

    for (const mention of rawMentions) {
      if (typeof mention === "string" && mention.trim()) {
        snippets.push(mention.toLowerCase());
      }
    }

    if (typeof item?.normalizedName === "string" && item.normalizedName.trim()) {
      snippets.push(item.normalizedName.toLowerCase());
    }
  }

  const combined = [...detected, ...rawJoined, ...snippets].join(" ");

  return {
    detected,
    snippets,
    combined,
  };
}

function findNamedPrivateCarriers(combined: string) {
  return PRIVATE_CARRIERS.filter((carrier) => combined.includes(carrier));
}

function hasFlexiblePrivateSignal(text: string) {
  const hasMajor = text.includes("major");
  const hasInsurance =
    text.includes("insurance") ||
    text.includes("insurances") ||
    text.includes("insurer") ||
    text.includes("insurers");

  return hasMajor && hasInsurance;
}

function hasNegatedPublicOnly(snippets: string[]) {
  return snippets.some((snippet) => {
    const hasNegation = hasAnyPhrase(snippet, NEGATION_PHRASES);
    const mentionsPublic =
      snippet.includes("medicaid") || snippet.includes("medicare");
    const mentionsPrivate =
      hasAnyPhrase(snippet, PRIVATE_PHRASES) ||
      hasFlexiblePrivateSignal(snippet) ||
      PRIVATE_CARRIERS.some((carrier) => snippet.includes(carrier));

    return hasNegation && mentionsPublic && !mentionsPrivate;
  });
}

function hasMixedPrivatePositive(snippets: string[]) {
  return snippets.some((snippet) => {
    return (
      hasAnyPhrase(snippet, PRIVATE_PHRASES) ||
      hasFlexiblePrivateSignal(snippet) ||
      PRIVATE_CARRIERS.some((carrier) => snippet.includes(carrier))
    );
  });
}

export function resolveInsuranceTruth(input: {
  accepted_insurance_providers_detected: string[] | null;
  detected_insurance_carriers: any[] | null;
}): InsuranceResolution {
  const { detected, snippets, combined } = normalizeEvidence(input);

  const namedPrivateCarriers = findNamedPrivateCarriers(combined);
  const hasPrivatePhrase = hasAnyPhrase(combined, PRIVATE_PHRASES);
  const hasFlexiblePrivate = hasFlexiblePrivateSignal(combined);

  const hasMedicaid = combined.includes("medicaid");
  const hasMedicare = combined.includes("medicare");

  const negatedPublicOnly = hasNegatedPublicOnly(snippets);
  const mixedPrivatePositive = hasMixedPrivatePositive(snippets);

  if (namedPrivateCarriers.length > 0) {
    return {
      acceptsPrivateInsuranceResolved: true,
      acceptedPrivateInsuranceCarriersResolved: namedPrivateCarriers,
      confidence: 0.9,
      reason: "Detected named private/commercial insurance carriers",
    };
  }

  if (hasPrivatePhrase || hasFlexiblePrivate || mixedPrivatePositive) {
    return {
      acceptsPrivateInsuranceResolved: true,
      acceptedPrivateInsuranceCarriersResolved: [],
      confidence: 0.75,
      reason: "Detected implied private/commercial insurance acceptance",
    };
  }

  if (negatedPublicOnly) {
    return {
      acceptsPrivateInsuranceResolved: null,
      acceptedPrivateInsuranceCarriersResolved: [],
      confidence: 0.4,
      reason: "Detected exclusion/negation around public insurance only",
    };
  }

  if ((hasMedicaid || hasMedicare) && detected.length > 0) {
    return {
      acceptsPrivateInsuranceResolved: false,
      acceptedPrivateInsuranceCarriersResolved: [],
      confidence: 0.6,
      reason: "Only public insurance signals detected",
    };
  }

  return {
    acceptsPrivateInsuranceResolved: null,
    acceptedPrivateInsuranceCarriersResolved: [],
    confidence: 0.2,
    reason: "No strong insurance truth signal",
  };
}