type EnvironmentClassification = {
  region: "west_coast" | "east_coast" | "midwest" | "southwest" | "southeast" | "northeast" | null
  coastal_flag: boolean
  desert_flag: boolean
  mountain_flag: boolean
  density_class: "urban" | "suburban" | "rural" | null
  classifier_version: "v1"
}

const WEST_COAST = ["CA", "OR", "WA"]

const EAST_COAST = [
  "ME","NH","MA","RI","CT",
  "NY","NJ","DE","MD",
  "VA","NC","SC","GA","FL"
]

const MIDWEST = [
  "OH","MI","IN","IL","WI",
  "MN","IA","MO",
  "ND","SD","NE","KS"
]

const SOUTHWEST = ["AZ","NM","NV","UT"]

const SOUTHEAST = ["AL","MS","LA","TN","KY","AR"]

function getRegion(state?: string | null): EnvironmentClassification["region"] {
  if (!state) return null

  if (WEST_COAST.includes(state)) return "west_coast"
  if (EAST_COAST.includes(state)) return "east_coast"
  if (MIDWEST.includes(state)) return "midwest"
  if (SOUTHWEST.includes(state)) return "southwest"
  if (SOUTHEAST.includes(state)) return "southeast"

  return null
}

// VERY LIGHT v1 heuristics — safe, conservative
function getTerrainFlags(state?: string | null): {
  coastal_flag: boolean
  desert_flag: boolean
  mountain_flag: boolean
} {
  if (!state) {
    return { coastal_flag: false, desert_flag: false, mountain_flag: false }
  }

  const coastalStates = ["CA","OR","WA","FL","NC","SC","GA","NY","NJ","MA","MD","VA"]
  const desertStates = ["AZ","NV","NM"]
  const mountainStates = ["CO","UT","ID","MT","WY"]

  return {
    coastal_flag: coastalStates.includes(state),
    desert_flag: desertStates.includes(state),
    mountain_flag: mountainStates.includes(state),
  }
}

export function classifyEnvironment(input: {
  state?: string | null
}): EnvironmentClassification {
  const { state } = input

  const region = getRegion(state)
  const terrain = getTerrainFlags(state)

  return {
    region,
    coastal_flag: terrain.coastal_flag,
    desert_flag: terrain.desert_flag,
    mountain_flag: terrain.mountain_flag,
    density_class: null, // not reliable yet (per doctrine)
    classifier_version: "v1"
  }
}
