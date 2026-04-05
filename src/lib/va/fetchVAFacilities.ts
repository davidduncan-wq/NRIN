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

type VAFacilitySite = {
  id: string
  name: string | null
  city: string | null
  state: string | null
  latitude: number | null
  longitude: number | null
  website: string | null
}

type ClassifiedVARow = {
  facility_site_id: string
  facility_sites: VAFacilitySite | VAFacilitySite[] | null
}

export async function fetchVAFacilities(input: {
  latitude?: number
  longitude?: number
}) {
  const { data, error } = await supabase
    .from("facility_classification")
    .select(`
      facility_site_id,
      facility_sites:facility_site_id (
        id,
        name,
        city,
        state,
        latitude,
        longitude,
        website
      )
    `)
    .eq("network_route_class", "va")

  if (error || !data) {
    console.error("VA fetch error:", error)
    return []
  }

  const mapped = (data as ClassifiedVARow[])
    .map((row) => Array.isArray(row.facility_sites) ? row.facility_sites[0] ?? null : row.facility_sites ?? null)
    .filter((row): row is VAFacilitySite => Boolean(row))
    .filter((row) => row.id && row.name)

  const deduped = Array.from(
    new Map(mapped.map((f) => [f.id, f])).values()
  )

  if (!input.latitude || !input.longitude) {
    return deduped.slice(0, 5)
  }

  const withDistance = deduped.map((f) => {
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
