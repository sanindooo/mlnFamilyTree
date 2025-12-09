import React from "react";
import { BiographyContent } from "@/components/biography/BiographyContent";
import { SectionGallery } from "@/components/biography/SectionGallery";
import { getAllMLNStories, getMLNStory } from "@/lib/data";
import { notFound } from "next/navigation";
import { BiographyHeader } from "@/components/biography/BiographyHeader";
import { RelatedStories } from "@/components/biography/RelatedStories";
import fallbackImage from "@/assets/images/Children of MLN.jpg";

export const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

export async function generateStaticParams() {
	const stories = await getAllMLNStories();
	return stories
		.filter((story) => story.slug)
		.map((story) => ({
			section: story.slug,
		}));
}

export default async function BiographySectionPage({
	params,
}: {
	params: Promise<{ section: string }>;
}) {
	const { section: sectionSlug } = await params;

	// Fetch data in parallel
	const [story, allStories] = await Promise.all([
		getMLNStory(sectionSlug),
		getAllMLNStories(),
	]);

	if (!story) {
		notFound();
	}

	const galleryImages =
		story.galleryImages?.map((img: any) => ({
			src: img.asset,
			alt: img.alt,
			caption: img.caption,
		})) || [];

	return (
		<>
			<BiographyHeader
				title={story.title}
				imageSrc={story.heroImage || fallbackImage}
				category="MLN Biography"
			/>
			<BiographyContent portableTextContent={story.content} />
			<SectionGallery images={galleryImages} sectionTitle={story.title} />
			<RelatedStories currentSlug={sectionSlug} stories={allStories} />
		</>
	);
}
