import { MLNBiographyHero } from "@/components/biography/MLNBiographyHero";
import { BiographyListing } from "@/components/biography/BiographyListing";
import { getAllMLNStories } from "@/lib/data";

export const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

export default async function MLNStoryPage() {
	const stories = await getAllMLNStories();

	return (
		<>
			<MLNBiographyHero />
			<BiographyListing stories={stories} />
		</>
	);
}
