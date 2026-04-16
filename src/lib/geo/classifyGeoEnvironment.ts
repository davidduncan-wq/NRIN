export type GeoEnvironmentType =
  | "desert"
  | "mountain"
  | "coastal"
  | "island"
  | "urban_city"
  | "rural_quiet"
  | "unknown";

export type GeoRegion =
  | "east_coast"
  | "west_coast"
  | "midwest"
  | "south"
  | "unknown";

export type GeoClassification = {
  environment: GeoEnvironmentType;
  region: GeoRegion;
  reasons: string[];
};

type Input = {
  lat: number | null;
  lng: number | null;
  state?: string | null;
  city?: string | null;
};

const WEST_COAST_STATES = new Set(["CA", "OR", "WA"]);
const EAST_COAST_STATES = new Set([
  "ME","NH","MA","RI","CT","NY","NJ","DE","MD","VA","NC","SC","GA","FL"
]);
const MIDWEST_STATES = new Set([
  "OH","MI","IN","IL","WI","MN","IA","MO","ND","SD","NE","KS"
]);
const SOUTH_STATES = new Set([
  "TX","OK","AR","LA","MS","AL","TN","KY","WV"
]);

const ISLAND_STATES = new Set(["HI"]);

const DESERT_STATES = new Set(["AZ", "NV"]);
const MOUNTAIN_STATES = new Set(["CO", "UT", "MT", "WY", "ID", "NM"]);

const MAJOR_URBAN_CITIES = new Set([
  "NEW YORK",
  "LOS ANGELES",
  "CHICAGO",
  "MIAMI",
  "SEATTLE",
  "SAN FRANCISCO",
  "SAN DIEGO",
  "BOSTON",
  "ATLANTA",
  "DALLAS",
  "HOUSTON",
  "PHOENIX",
  "DENVER",
  "LAS VEGAS",
  "PORTLAND",
  "WASHINGTON",
  "PHILADELPHIA",
]);

const DESERT_MARKET_CITIES = new Set([
  "PALM SPRINGS",
  "PALM DESERT",
  "RANCHO MIRAGE",
  "INDIAN WELLS",
  "LA QUINTA",
  "CATHEDRAL CITY",
  "INDIO",
  "SEDONA",
  "SCOTTSDALE",
]);

const MOUNTAIN_MARKET_CITIES = new Set([
  "ASPEN",
  "VAIL",
  "BRECKENRIDGE",
  "PARK CITY",
  "BOULDER",
  "TELLURIDE",
  "JACKSON",
  "DENVER",
]);

function normState(state?: string | null): string {
  return (state ?? "").trim().toUpperCase();
}

function normCity(city?: string | null): string {
  return (city ?? "").trim().toUpperCase();
}

function nearPacific(lat: number, lng: number): boolean {
  return lat >= 32 && lat <= 49 && lng <= -117;
}

function nearAtlantic(lat: number, lng: number): boolean {
  return lat >= 25 && lat <= 46 && lng >= -80;
}

function classifyRegion(state: string): GeoRegion {
  if (WEST_COAST_STATES.has(state) || state === "HI") return "west_coast";
  if (EAST_COAST_STATES.has(state)) return "east_coast";
  if (MIDWEST_STATES.has(state)) return "midwest";
  if (SOUTH_STATES.has(state)) return "south";

  // Interior / mountain states currently behave closer to western travel preference
  if (["AZ", "NV", "CO", "UT", "MT", "WY", "ID", "NM"].includes(state)) {
    return "west_coast";
  }

  return "unknown";
}

export function classifyGeoEnvironment(input: Input): GeoClassification {
  const reasons: string[] = [];
  const state = normState(input.state);
  const city = normCity(input.city);

  if (input.lat == null || input.lng == null) {
    return {
      environment: "unknown",
      region: classifyRegion(state),
      reasons: ["missing lat/lng"],
    };
  }

  const lat = input.lat;
  const lng = input.lng;
  const region = classifyRegion(state);

  // ISLAND must remain distinct from coastal.
  if (ISLAND_STATES.has(state)) {
    reasons.push("state=HI => island");
    return {
      environment: "island",
      region,
      reasons,
    };
  }

  // Known doctrine-aware market overrides before generic heuristics.
  if (DESERT_MARKET_CITIES.has(city)) {
    reasons.push(`desert market override: ${city}`);
    return {
      environment: "desert",
      region,
      reasons,
    };
  }

  if (MOUNTAIN_MARKET_CITIES.has(city)) {
    reasons.push(`mountain market override: ${city}`);
    return {
      environment: "mountain",
      region,
      reasons,
    };
  }

  // Urban/city should win before broad terrain buckets if city core is explicit.
  if (MAJOR_URBAN_CITIES.has(city)) {
    reasons.push(`major city heuristic: ${city}`);
    return {
      environment: "urban_city",
      region,
      reasons,
    };
  }

  // Desert
  if (DESERT_STATES.has(state)) {
    reasons.push(`desert state heuristic: ${state}`);
    return {
      environment: "desert",
      region,
      reasons,
    };
  }

  // Mountain
  if (MOUNTAIN_STATES.has(state)) {
    reasons.push(`mountain state heuristic: ${state}`);
    return {
      environment: "mountain",
      region,
      reasons,
    };
  }

  // Coastal (distinct from island)
  if (nearPacific(lat, lng)) {
    reasons.push("lat/lng near Pacific coastline heuristic");
    return {
      environment: "coastal",
      region,
      reasons,
    };
  }

  if (nearAtlantic(lat, lng)) {
    reasons.push("lat/lng near Atlantic coastline heuristic");
    return {
      environment: "coastal",
      region,
      reasons,
    };
  }

  // Rural/quiet fallback: broad interior, non-major-city, non-special terrain
  if (!MAJOR_URBAN_CITIES.has(city)) {
    reasons.push("non-major-city fallback");
    return {
      environment: "rural_quiet",
      region,
      reasons,
    };
  }

  return {
    environment: "unknown",
    region,
    reasons: reasons.length ? reasons : ["no heuristic matched"],
  };
}
