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

function normalizeWebsite(value?: string | null) {
  const raw = (value ?? "").trim().toLowerCase()
  if (!raw) return ""
  return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
}

function isLikelyVADomain(website?: string | null) {
  const site = normalizeWebsite(website)
  return site.includes("va.gov") || site.includes(".va.gov")
}

function isLikelyVAName(name?: string | null) {
  const value = (name ?? "").toLowerCase()
  return /\bveteran\b/.test(value) || /\bveterans\b/.test(value) || /\bva\b/.test(value)
}

function hasUsableWebsite(website?: string | null) {
  const site = normalizeWebsite(website)
  return site.length > 0 && !site.includes("404error")
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

  const filtered = data.filter((f) => {
    const byDomain = isLikelyVADomain(f.website)
    const byName = isLikelyVAName(f.name)
    return (byDomain || byName) && hasUsableWebsite(f.website)
  })

  const deduped = Array.from(
    new Map(filtered.map((f) => [f.id, f])).values()
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
