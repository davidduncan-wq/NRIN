export function buildGoogleQuery(name: string, city?: string, state?: string): string {
    let query = `${name}`

    if (city) query += ` ${city}`
    if (state) query += ` ${state}`

    query += " addiction treatment center"

    return query
}