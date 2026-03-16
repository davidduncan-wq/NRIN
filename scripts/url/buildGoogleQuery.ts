export function buildGoogleQuery(name: string, city?: string, state?: string): string {
    let query = `"${name}"`

    if (city) query += ` "${city}"`
    if (state) query += ` "${state}"`

    query += ' ("addiction treatment" OR "substance abuse treatment" OR "behavioral health" OR "mental health")'

    return query
}