import { Biography, SearchResult } from "@/types";

/**
 * Counts occurrences of a term within text (case-insensitive).
 */
export function countTerm(text: string, term: string): number {
  if (!term) return 0; // early exit for empty input
  const safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex characters
  const regex = new RegExp(safe, 'gi'); // global, case-insensitive
  return (text.match(regex) || []).length; // count matches
}

/**
 * Wraps all occurrences of each term in <mark> ... </mark> for highlighting.
 * Returns safe HTML (input is escaped before replacement).
 */
export function highlightTerms(text: string, terms: string[]): string {
  // escape the incoming text to avoid accidental HTML
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  for (const term of terms) {
    if (!term) continue; // skip blanks
    const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
    const regex = new RegExp(`(${safeTerm})`, 'gi'); // global match
    safe = safe.replace(regex, '<mark class="bg-yellow-200 text-deep-umber rounded-sm px-0.5">$1</mark>'); // wrap match
  }
  return safe; // highlighted HTML string
}

/**
 * Returns the first N logical lines as a preview snippet.
 */
export function makeSnippet(text: string, lines = 5): string {
  return text.split(/\n+/).slice(0, lines).join('\n'); // join first N lines
}

/**
 * Ranks documents by term frequency.
 */
export function rankDocuments(documents: Biography[], query: string): SearchResult[] {
  if (!query) return [];

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean); // split into words

  return documents
    .map((doc) => {
      // naive TF scoring on title + content
      const titleScore = terms.reduce((acc, term) => acc + countTerm(doc.title.toLowerCase(), term), 0);
      const contentScore = terms.reduce((acc, term) => acc + countTerm(doc.rawContent.toLowerCase(), term), 0);
      const score = titleScore * 2 + contentScore; // Give title matches more weight
      
      return { doc, score };
    })
    .filter((item) => item.score > 0) // drop zero-score docs
    .sort((a, b) => b.score - a.score); // descending score
}

