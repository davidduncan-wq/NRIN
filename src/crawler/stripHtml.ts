export function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!match) return null
  return decodeHtml(match[1]).replace(/\s+/g, " ").trim() || null
}

export function stripHtmlToText(html: string): string {
  const withoutScript = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")

  const withLineBreaks = withoutScript
    .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")
    .replace(/<(p|div|section|article|li|h1|h2|h3|h4|h5|h6|br)[^>]*>/gi, "\n")

  const noTags = withLineBreaks.replace(/<[^>]+>/g, " ")
  const decoded = decodeHtml(noTags)

  return decoded
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function decodeHtml(input: string): string {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
}