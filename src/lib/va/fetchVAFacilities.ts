import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 3958.8

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function fetchVAFacilities(input: {
  latitude?: number
  longitude?: number
}) {
  const { data, error } = await supabase
    .from("facility_sites")
    .select("id, name, city, state, latitude, longitude, website")
    .not("website", "is", null)

  if (error || !data) {
    console.error("VA fetch error:", error)
    return []
  }

  const vaLike = data.filter((f) => {
    const site = (f.website || "").toLowerCase()
    const name = (f.name || "").toLowerCase()

    return (
      site.includes(".gov") ||
      site.includes(".mil") ||
      name.includes("va") ||
      name.includes("veterans")
    )
  })

  if (!input.latitude || !input.longitude) {
    return vaLike.slice(0, 5)
  }

  const withDistance = vaLike.map((f) => {
    if (!f.latitude || !f.longitude) return { ...f, distance: 9999 }

    return {
      ...f,
      distance: haversineDistance(
        input.latitude!,
        input.longitude!,
        f.latitude,
        f.longitude
      ),
    }
  })

  return withDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
}
