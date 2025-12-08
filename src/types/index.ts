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
	hasBioOrGallery?: boolean;
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
	portableTextContent?: PortableTextBlock[]; // New field from Sanity
	gallery?: any[]; // New field from Sanity
	photo?: string; // Hero photo from Person
}

export interface MLNStory {
	slug: string;
	title: string;
	description: string;
	heroImage?: any; // Sanity image source
	content?: PortableTextBlock[];
	galleryImages?: any[];
	order?: number;
}

export interface GalleryImage {
	src: string;
	thumbnailSrc: string;
	title: string;
	description?: string;
	tags: string[];
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
	// New fields for two-way sync
	manualGallery?: any[];
	taggedGallery?: any[];
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

export interface SanityMLNStory {
	_id: string;
	_type: "mlnStory";
	title: string;
	slug: {
		current: string;
	};
	description: string;
	order?: number;
	heroImage?: {
		asset: SanityImageSource;
		alt?: string;
	};
	content?: PortableTextBlock[];
	galleryImages?: Array<{
		_key: string;
		asset: SanityImageSource;
		alt?: string;
		caption?: string;
	}>;
	// New fields for two-way sync
	manualGalleryImages?: any[];
	taggedGalleryImages?: any[];
}
