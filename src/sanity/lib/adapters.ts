import { PortableTextBlock, toPlainText } from "@portabletext/react";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "../client";
import {
	Person,
	Biography,
	MLNStory,
	GalleryImage,
	Grandchild,
	FooterCTAData,
	SanityPerson,
	SanityMLNStory,
	SanityGalleryImage,
	SanityGrandchild,
	SanityFooterCTA,
} from "@/types";

/**
 * Image URL builder for Sanity images
 */
const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
	return builder.image(source).auto("format").fit("max");
}

/**
 * Convert Sanity Person to frontend Person type
 */
export function adaptSanityPerson(
	sanityPerson: SanityPerson,
	children?: SanityPerson[]
): Person {
	return {
		id: sanityPerson._id,
		name: sanityPerson.name,
		slug: sanityPerson.slug.current,
		birthDate: sanityPerson.birthDate,
		deathDate: sanityPerson.deathDate,
		photo: sanityPerson.photo
			? urlForImage(sanityPerson.photo).url()
			: undefined,
		children: children?.map((child) => adaptSanityPerson(child)) || [],
	};
}

/**
 * Recursively build the family tree from Sanity data
 */
export function adaptFamilyTree(sanityRoot: any): Person {
	const adaptPersonNode = (node: any): Person => {
		const hasBioContent =
			node.biography?.content && node.biography.content.length > 0;
		const hasGalleryImages =
			node.biography?.gallery && node.biography.gallery.length > 0;
		const hasBioOrGallery = hasBioContent || hasGalleryImages;

		return {
			id: node._id,
			name: node.name,
			slug: node.slug,
			birthDate: node.birthDate,
			deathDate: node.deathDate,
			photo: node.photo ? urlForImage(node.photo).url() : undefined,
			children: node.children?.map(adaptPersonNode) || [],
			hasBioOrGallery,
		};
	};

	return adaptPersonNode(sanityRoot);
}

/**
 * Convert Portable Text to plain text for search indexing
 */
export function portableTextToPlainText(blocks?: PortableTextBlock[]): string {
	if (!blocks) return "";
	return toPlainText(blocks);
}

/**
 * Convert Sanity Biography (or Person with bio fields) to frontend Biography type
 * Note: content is kept as empty string since we'll use PortableText component
 * rawContent is extracted for search purposes
 */
export function adaptSanityBiography(sanityBio: any): Biography {
	// Handle slug being either string (from Person query alias) or object (from original Biography)
	const slug =
		typeof sanityBio.slug === "string"
			? sanityBio.slug
			: sanityBio.slug?.current;

	const gallery = sanityBio.gallery;

	return {
		slug: slug,
		title: sanityBio.title,
		content: "", // Will use PortableText component instead
		rawContent: portableTextToPlainText(sanityBio.content),
		frontMatter: {
			title: sanityBio.title,
		},
		portableTextContent: sanityBio.content,
		gallery: gallery,
		photo: sanityBio.person?.photo
			? urlForImage(sanityBio.person.photo).url()
			: undefined,
	};
}

/**
 * Convert Sanity MLN Story to frontend MLNStory type
 */
export function adaptSanityMLNStory(sanityStory: SanityMLNStory): MLNStory {
	const galleryImages = sanityStory.galleryImages;

	return {
		slug: sanityStory.slug?.current,
		title: sanityStory.title,
		description: sanityStory.description,
		order: sanityStory.order,
		heroImage: sanityStory.heroImage
			? urlForImage(sanityStory.heroImage).url()
			: undefined,
		content: sanityStory.content,
		galleryImages: galleryImages?.map((img: any) => ({
			...img,
			asset: img?.asset ? urlForImage(img.asset).url() : undefined,
		})),
	};
}

/**
 * Convert Sanity Gallery Image to frontend GalleryImage type
 */
export function adaptGalleryImage(
	sanityImage: SanityGalleryImage
): GalleryImage {
	return {
		src: sanityImage.image ? urlForImage(sanityImage.image).url() : "",
		thumbnailSrc: sanityImage.image
			? urlForImage(sanityImage.image).width(600).url()
			: "",
		title: sanityImage.title,
		description: sanityImage.description,
		tags: sanityImage.tags || [],
	};
}

/**
 * Validate that a URL is safe to render in an href attribute.
 * Rejects javascript:, data:, vbscript: schemes.
 */
function isSafeUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	if (url.startsWith("/")) return url;
	try {
		const parsed = new URL(url);
		return ["https:", "http:"].includes(parsed.protocol) ? url : undefined;
	} catch {
		return undefined;
	}
}

/**
 * Helper to get optimized image URLs from Sanity
 */
export function getImageUrl(
	source: SanityImageSource | undefined,
	width?: number
): string | undefined {
	if (!source) return undefined;
	const base = urlForImage(source);
	return width ? base.width(width).url() : base.url();
}

/**
 * Convert Sanity Grandchild to frontend Grandchild type
 */
export function adaptGrandchild(sanityGrandchild: SanityGrandchild): Grandchild {
	return {
		id: sanityGrandchild._id,
		name: sanityGrandchild.name,
		slug: sanityGrandchild.slug,
		photo: sanityGrandchild.photo
			? urlForImage(sanityGrandchild.photo).url()
			: undefined,
		description: sanityGrandchild.description,
		linkedinUrl: isSafeUrl(sanityGrandchild.linkedinUrl),
		twitterUrl: isSafeUrl(sanityGrandchild.twitterUrl),
	};
}

/**
 * Convert Sanity Footer CTA to frontend FooterCTAData type
 * Returns null if title or text are missing (triggers conditional hiding)
 */
export function adaptFooterCTA(sanityFooterCTA: SanityFooterCTA): FooterCTAData | null {
	// Return null if title or text are missing (component won't render)
	if (!sanityFooterCTA?.title || !sanityFooterCTA?.text) {
		return null;
	}

	const result: FooterCTAData = {
		title: sanityFooterCTA.title,
		text: sanityFooterCTA.text,
	};

	// Add background image if present
	if (sanityFooterCTA.backgroundImage?.asset) {
		result.backgroundImage = {
			url: urlForImage(sanityFooterCTA.backgroundImage).url(),
			alt: sanityFooterCTA.backgroundImage.alt,
		};
	}

	// Add primary button only if both text and link are present and safe
	const primaryLink = isSafeUrl(sanityFooterCTA.primaryButton?.link);
	if (sanityFooterCTA.primaryButton?.text && primaryLink) {
		result.primaryButton = {
			text: sanityFooterCTA.primaryButton.text,
			link: primaryLink,
			openInNewTab: sanityFooterCTA.primaryButton.openInNewTab || false,
		};
	}

	// Add secondary button only if both text and link are present and safe
	const secondaryLink = isSafeUrl(sanityFooterCTA.secondaryButton?.link);
	if (sanityFooterCTA.secondaryButton?.text && secondaryLink) {
		result.secondaryButton = {
			text: sanityFooterCTA.secondaryButton.text,
			link: secondaryLink,
			openInNewTab: sanityFooterCTA.secondaryButton.openInNewTab || false,
		};
	}

	return result;
}
