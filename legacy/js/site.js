// Shared utility helpers used across pages in the site.
// These keep network and text parsing logic in one place.

/**
 * Fetches a JSON file and returns the parsed object.
 * Throws a helpful error if the request fails.
 */
export async function loadJSON(path) {
  const res = await fetch(path); // request the resource
  if (!res.ok) { // check HTTP status
    throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`); // surface failure
  }
  return res.json(); // parse and return JSON
}

/**
 * Fetches a text file (e.g., Markdown) and returns the raw text.
 */
export async function loadText(path) {
  const res = await fetch(path); // request the resource
  if (!res.ok) { // verify response
    throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`); // descriptive error
  }
  return res.text(); // return raw string
}

/**
 * Produces a flat list of all nodes within a tree, depth-first.
 * Useful for search and indexing.
 */
export function flattenTree(root) {
  const stack = [root]; // start with the root node
  const out = []; // accumulator for flattened nodes
  while (stack.length) { // iterate until all nodes visited
    const node = stack.pop(); // pop last element (depth-first)
    out.push(node); // record current node
    (node.children || []).forEach((child) => stack.push(child)); // push children for later
  }
  return out; // final flattened collection
}

/**
 * Parses a simple YAML front matter block from a Markdown file.
 * Returns an object with { data, content }.
 */
export function parseFrontMatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/); // find front matter block
  if (!match) {
    return { data: {}, content: raw.trim() }; // no front matter, return original content
  }
  const data = {}; // metadata key/value pairs
  const body = match[1] // captured front matter without the fences
    .split('\n') // split into lines
    .map((line) => line.trim()) // normalize whitespace
    .filter(Boolean); // drop empty lines
  for (const line of body) {
    const [key, ...rest] = line.split(':'); // key: value
    data[key.trim()] = rest.join(':').trim(); // preserve colons in values
  }
  const content = raw.slice(match[0].length).trim(); // remove the front matter from the text
  return { data, content }; // structured result
}

/**
 * Converts a small Markdown subset to HTML:
 * - Escapes HTML
 * - Splits on blank lines into paragraphs
 * - Converts single newlines to <br/>
 */
export function markdownToHtml(md) {
  const escaped = md
    .replace(/&/g, '&amp;') // escape &
    .replace(/</g, '&lt;') // escape <
    .replace(/>/g, '&gt;'); // escape >
  return escaped
    .split(/\n\n+/) // paragraphs by blank line
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`) // newline to <br/>
    .join('\n'); // rejoin as HTML
}

/**
 * Counts occurrences of a term within text (case-insensitive).
 */
export function countTerm(text, term) {
  if (!term) return 0; // early exit for empty input
  const safe = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex characters
  const regex = new RegExp(safe, 'gi'); // global, case-insensitive
  return (text.match(regex) || []).length; // count matches
}

/**
 * Wraps all occurrences of each term in <mark> ... </mark> for highlighting.
 * Returns safe HTML (input is escaped before replacement).
 */
export function highlightTerms(text, terms) {
  // escape the incoming text to avoid accidental HTML
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  for (const term of terms) {
    if (!term) continue; // skip blanks
    const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
    const regex = new RegExp(`(${safeTerm})`, 'gi'); // global match
    safe = safe.replace(regex, '<mark>$1</mark>'); // wrap match
  }
  return safe; // highlighted HTML string
}

/**
 * Returns the first N logical lines as a preview snippet.
 */
export function makeSnippet(text, lines = 5) {
  return text.split(/\n+/).slice(0, lines).join('\n'); // join first N lines
}

/**
 * Sets the year in the page footer to the current year (if the element exists).
 */
export function setFooterYear() {
  const el = document.querySelector('#footer-year'); // locate footer span
  if (el) {
    el.textContent = new Date().getFullYear(); // set current year
  }
}

