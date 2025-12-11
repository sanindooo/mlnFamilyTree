import { client } from "../client";
import {
	familyTreeQuery,
	biographyBySlugQuery,
	allBiographiesQuery,
	docsIndexQuery,
	allGalleryImagesQuery,
	timelineEventsQuery,
	allMLNStoriesQuery,
	mlnStoryBySlugQuery,
	allGrandchildrenQuery,
} from "./queries";
import {
	adaptFamilyTree,
	adaptSanityBiography,
	adaptSanityMLNStory,
	adaptGalleryImage,
	adaptGrandchild,
} from "./adapters";
import {
	Person,
	Biography,
	DocEntry,
	MLNStory,
	GalleryImage,
	Grandchild,
} from "@/types";

// Cache strategy:
// - Prod: USE_CACHE=true -> 1 hour ISR
// - Dev: USE_CACHE=false (default) -> 0 (no cache)
const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

// Helper to add cache config to fetch options
const fetchOptions = { next: { revalidate } };

/**
 * Fetch the family tree from Sanity
 */
export async function getFamilyTreeFromSanity(): Promise<Person | null> {
	try {
		const data = await client.fetch(familyTreeQuery, {}, fetchOptions);
		if (!data) return null;
		return adaptFamilyTree(data);
	} catch (error) {
		console.error("Error fetching family tree from Sanity:", error);
		return null;
	}
}

/**
 * Fetch a biography by slug from Sanity
 * Returns both the adapted Biography and the raw Sanity data (for PortableText)
 */
export async function getBiographyFromSanity(slug: string): Promise<{
	biography: Biography;
	portableTextContent: any;
} | null> {
	try {
		const data = await client.fetch(
			biographyBySlugQuery,
			{ slug },
			fetchOptions
		);
		if (!data) return null;

		return {
			biography: adaptSanityBiography(data),
			portableTextContent: data.content,
			// Gallery is now handled inside adaptSanityBiography
		};
	} catch (error) {
		console.error(`Error fetching biography ${slug} from Sanity:`, error);
		return null;
	}
}

/**
 * Fetch all biographies from Sanity (for search indexing)
 */
export async function getAllBiographiesFromSanity(): Promise<Biography[]> {
	try {
		const data = await client.fetch(allBiographiesQuery, {}, fetchOptions);
		if (!data) return [];

		return data.map((bio: any) => adaptSanityBiography(bio));
	} catch (error) {
		console.error("Error fetching all biographies from Sanity:", error);
		return [];
	}
}

/**
 * Fetch docs index from Sanity
 */
export async function getDocsIndexFromSanity(): Promise<DocEntry[]> {
	try {
		const data = await client.fetch(docsIndexQuery, {}, fetchOptions);
		return data || [];
	} catch (error) {
		console.error("Error fetching docs index from Sanity:", error);
		return [];
	}
}

/**
 * Fetch gallery images from Sanity
 */
export async function getGalleryImagesFromSanity(): Promise<GalleryImage[]> {
	try {
		const data = await client.fetch(allGalleryImagesQuery, {}, fetchOptions);
		return data ? data.map(adaptGalleryImage) : [];
	} catch (error) {
		console.error("Error fetching gallery images from Sanity:", error);
		return [];
	}
}

/**
 * Fetch timeline events from Sanity
 */
export async function getTimelineEventsFromSanity(): Promise<any[]> {
	try {
		const data = await client.fetch(timelineEventsQuery, {}, fetchOptions);
		return data || [];
	} catch (error) {
		console.error("Error fetching timeline events from Sanity:", error);
		return [];
	}
}

/**
 * Fetch all MLN stories from Sanity
 */
export async function getAllMLNStoriesFromSanity(): Promise<MLNStory[]> {
	try {
		const data = await client.fetch(allMLNStoriesQuery, {}, fetchOptions);
		if (!data) return [];
		return data
			.map(adaptSanityMLNStory)
			.filter((story: MLNStory) => story.slug);
	} catch (error) {
		console.error("Error fetching MLN stories from Sanity:", error);
		return [];
	}
}

/**
 * Fetch a single MLN story by slug from Sanity
 */
export async function getMLNStoryFromSanity(
	slug: string
): Promise<MLNStory | null> {
	try {
		const data = await client.fetch(
			mlnStoryBySlugQuery,
			{ slug },
			fetchOptions
		);
		if (!data) return null;
		return adaptSanityMLNStory(data);
	} catch (error) {
		console.error(`Error fetching MLN story ${slug} from Sanity:`, error);
		return null;
	}
}

/**
 * Fetch all grandchildren from Sanity
 */
export async function getGrandchildrenFromSanity(): Promise<Grandchild[]> {
	try {
		const data = await client.fetch(allGrandchildrenQuery, {}, fetchOptions);
		if (!data) return [];
		return data.map(adaptGrandchild);
	} catch (error) {
		console.error("Error fetching grandchildren from Sanity:", error);
		return [];
	}
}
