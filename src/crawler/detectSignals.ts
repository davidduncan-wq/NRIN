import { EvidenceSnippet } from "./types"

export function collectEvidenceSnippets(
  pageUrl: string,
  pageText: string,
  patterns: RegExp[],
  label: string
): EvidenceSnippet[] {
  const snippets: EvidenceSnippet[] = []
  const seen = new Set<string>()

  for (const pattern of patterns) {
    const regex = new RegExp(
      pattern.source,
      pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`
    )

    let match: RegExpExecArray | null

    while ((match = regex.exec(pageText)) !== null) {
      const snippet = buildSentenceSnippet(pageText, match.index, match[0].length)
      if (!snippet) continue

      const normalizedSnippet = normalizeSnippet(snippet)
      const key = `${pageUrl}::${label}::${normalizedSnippet}`

      if (seen.has(key)) continue
      seen.add(key)

      snippets.push({
        pageUrl,
        label,
        snippet,
      })
    }
  }

  return snippets
}

function buildSentenceSnippet(text: string, matchIndex: number, matchLength: number): string {
  const start = findSentenceStart(text, matchIndex)
  const end = findSentenceEnd(text, matchIndex + matchLength)
  return text.slice(start, end).replace(/\s+/g, " ").trim()
}

function findSentenceStart(text: string, index: number): number {
  for (let i = index; i >= 0; i--) {
    const char = text[i]
    if (char === "." || char === "!" || char === "?" || char === "\n") {
      return i + 1
    }
  }

  return 0
}

function findSentenceEnd(text: string, index: number): number {
  for (let i = index; i < text.length; i++) {
    const char = text[i]
    if (char === "." || char === "!" || char === "?" || char === "\n") {
      return i + 1
    }
  }

  return text.length
}

function normalizeSnippet(snippet: string): string {
  return snippet.toLowerCase().replace(/\s+/g, " ").trim()
}