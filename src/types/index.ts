export interface Person {
  id: string;
  name: string;
  slug?: string;
  birthDate?: string;
  deathDate?: string;
  photo?: string;
  children?: Person[];
}

export interface DocEntry {
  slug: string;
  title: string;
  photos: string[];
}

export interface Biography {
  slug: string;
  title: string;
  content: string; // The HTML content
  rawContent: string; // The markdown content (for search)
  frontMatter: Record<string, string>;
}

export interface SearchResult {
  doc: Biography;
  score: number;
}

