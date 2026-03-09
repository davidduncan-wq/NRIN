export function extractInternalLinks(html: string, rootUrl: string): string[] {
  const links = new Set<string>()
  const base = new URL(rootUrl)

  const anchorRegex = /<a[^>]+href=["']([^"'#]+)["']/gi

  let match
  while ((match = anchorRegex.exec(html)) !== null) {
    try {
      const href = match[1]

      const url = new URL(href, base)

      if (url.hostname !== base.hostname) continue

      url.hash = ""
      url.search = ""

      links.add(url.toString())
    } catch {
      continue
    }
  }

  return [...links]
}