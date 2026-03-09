export function extractInternalLinks(html: string, rootUrl: string): string[] {
  const links = new Set<string>()
  const base = new URL(rootUrl)

  const anchorRegex = /<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null = null

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[2]?.trim() ?? ""
    const normalized = normalizeInternalHref(href, base)
    if (!normalized) continue
    links.add(normalized)
  }

  return [...links]
}

function normalizeInternalHref(href: string, base: URL): string | null {
  if (!href) return null
  if (href.startsWith("#")) return null
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null

  let url: URL
  try {
    url = new URL(href, base)
  } catch {
    return null
  }

  if (url.hostname !== base.hostname) return null

  url.hash = ""
  url.search = ""

  const pathname = normalizePath(url.pathname)
  if (!pathname) return null

  if (isJunkPath(pathname)) return null

  url.pathname = pathname
  return url.toString()
}

function normalizePath(pathname: string): string | null {
  if (!pathname) return "/"

  let path = pathname.trim()

  if (!path.startsWith("/")) {
    path = `/${path}`
  }

  path = path.replace(/\/{2,}/g, "/")

  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1)
  }

  const lower = path.toLowerCase()

  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".svg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".pdf") ||
    lower.endsWith(".zip") ||
    lower.endsWith(".doc") ||
    lower.endsWith(".docx")
  ) {
    return null
  }

  return path
}

function isJunkPath(pathname: string): boolean {
  const lower = pathname.toLowerCase()

  if (lower === "/") return false

  const junkFragments = [
    "/wp-content/",
    "/wp-json/",
    "/feed",
    "/tag/",
    "/author/",
    "/category/",
    "/cart",
    "/checkout",
    "/account",
    "/login",
    "/logout",
    "/privacy",
    "/terms",
    "/cookie",
    "/accessibility",
    "/careers",
    "/jobs",
    "/job/",
    "/press",
    "/news",
    "/blog",
    "/events",
    "/event/",
  ]

  return junkFragments.some((fragment) => lower.includes(fragment))
}