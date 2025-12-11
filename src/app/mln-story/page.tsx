import { MLNBiographyHero } from "@/components/biography/MLNBiographyHero";
import { BiographyListing } from "@/components/biography/BiographyListing";
import { getAllMLNStories } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
	title: "The MLN Story",
	description:
		"Discover the life story of Owek. Martin Luther Nsibirwa, his achievements, legacy, and lasting impact on Uganda.",
	path: "/mln-story",
});

export default async function MLNStoryPage() {
	const stories = await getAllMLNStories();

	return (
		<>
			<MLNBiographyHero />
			<BiographyListing stories={stories} />
		</>
	);
}
