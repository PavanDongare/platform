function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  )
}

function similarity(query: string, docText: string): number {
  const queryWords = tokenize(query)
  const docWords = tokenize(docText)

  let matches = 0
  for (const word of queryWords) {
    if (docWords.has(word)) matches++
  }

  return matches
}

export function findRelevantDocs(
  query: string,
  docs: any[],
  topN: number = 2
): any[] {
  const scored = docs
    .map((doc) => {
      const searchText = [
        doc.document_type || '',
        doc.summary || '',
        JSON.stringify(doc.extracted_data || {}),
      ].join(' ')

      return {
        doc,
        score: similarity(query, searchText),
      }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, topN).map((s) => s.doc)
}
