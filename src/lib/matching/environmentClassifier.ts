export type Region =
  | "west_coast"
  | "east_coast"
  | "midwest"
  | "southwest"
  | "southeast"
  | "northeast"

const REGION_MAP: Record<string, Region> = {
  // west_coast (ACTIVE)
  CA: "west_coast",
  OR: "west_coast",
  WA: "west_coast",

  // east_coast
  ME: "east_coast",
  NH: "east_coast",
  MA: "east_coast",
  RI: "east_coast",
  CT: "east_coast",
  NY: "east_coast",
  NJ: "east_coast",
  DE: "east_coast",
  MD: "east_coast",
  VA: "east_coast",
  NC: "east_coast",
  SC: "east_coast",
  GA: "east_coast",
  FL: "east_coast",

  // midwest
  OH: "midwest",
  MI: "midwest",
  IN: "midwest",
  IL: "midwest",
  WI: "midwest",
  MN: "midwest",
  IA: "midwest",
  MO: "midwest",
  ND: "midwest",
  SD: "midwest",
  NE: "midwest",
  KS: "midwest",

  // southwest
  AZ: "southwest",
  NM: "southwest",
  NV: "southwest",
  UT: "southwest",

  // southeast
  AL: "southeast",
  MS: "southeast",
  LA: "southeast",
  TN: "southeast",
  KY: "southeast",
  AR: "southeast",
}

export function getRegionFromState(state?: string | null): Region | null {
  if (!state) return null

  const normalized = state.trim().toUpperCase()

  return REGION_MAP[normalized] ?? null
}
