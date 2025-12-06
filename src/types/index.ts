import { PortableTextBlock } from "@portabletext/types";

// Sanity image type (using any to avoid complex type imports)
type SanityImageSource = any;

// ===== Frontend Types (Current) =====
// These are kept for backwards compatibility with existing components

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

// ===== Sanity Types =====
// Raw data structures from Sanity CMS

export interface SanityPerson {
	_id: string;
	_type: "person";
	name: string;
	slug: {
		current: string;
	};
	birthDate?: string;
	deathDate?: string;
	photo?: SanityImageSource;
	children?: Array<{
		_ref: string;
		_type: "reference";
	}>;
	biography?: {
		_ref: string;
		_type: "reference";
	};
}

export interface SanityBiography {
	_id: string;
	_type: "biography";
	title: string;
	slug: {
		current: string;
	};
	person?: {
		_ref: string;
		_type: "reference";
	};
	content?: PortableTextBlock[];
	gallery?: Array<{
		_key: string;
		asset: SanityImageSource;
		alt?: string;
		caption?: string;
	}>;
}

export interface SanityGalleryImage {
	_id: string;
	_type: "galleryImage";
	title: string;
	image: {
		asset: SanityImageSource;
		alt: string;
	};
	description?: string;
	tags?: string[];
	relatedPeople?: Array<{
		_ref: string;
		_type: "reference";
	}>;
}
