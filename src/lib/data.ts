import fs from 'fs';
import path from 'path';
import { Biography, DocEntry, Person } from '@/types';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * Parses a simple YAML front matter block from a Markdown file.
 * Returns an object with { data, content }.
 */
export function parseFrontMatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/); // find front matter block
  if (!match) {
    return { data: {}, content: raw.trim() }; // no front matter, return original content
  }
  const data: Record<string, string> = {}; // metadata key/value pairs
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
export function markdownToHtml(md: string): string {
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
 * SERVER-SIDE: Loads the family tree JSON
 */
export async function getFamilyTree(): Promise<Person> {
  const filePath = path.join(PUBLIC_DIR, 'data', 'familyTree.json');
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

/**
 * SERVER-SIDE: Loads the docs index
 */
export async function getDocsIndex(): Promise<DocEntry[]> {
  const filePath = path.join(PUBLIC_DIR, 'data', 'docs.json');
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

/**
 * SERVER-SIDE: Loads a biography by slug
 */
export async function getBiography(slug: string): Promise<Biography | null> {
  if (!slug || slug === 'undefined') return null;
  try {
    const filePath = path.join(PUBLIC_DIR, 'content', `${slug}.md`);
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const { data, content } = parseFrontMatter(fileContents);
    
    // Fallback title from slug if not in frontmatter
    const title = data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return {
      slug,
      title,
      content: markdownToHtml(content),
      rawContent: content,
      frontMatter: data,
    };
  } catch (err) {
    console.error(`Error loading biography for ${slug}:`, err);
    return null;
  }
}

/**
 * SERVER-SIDE: Gets all biographies (for search index)
 */
export async function getAllBiographies(): Promise<Biography[]> {
  const docs = await getDocsIndex();
  const bios = await Promise.all(
    docs.map(doc => getBiography(doc.slug))
  );
  return bios.filter((bio): bio is Biography => bio !== null);
}

