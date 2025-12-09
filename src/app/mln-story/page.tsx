import { MLNBiographyHero } from "@/components/biography/MLNBiographyHero";
import { BiographyListing } from "@/components/biography/BiographyListing";
import { getAllMLNStories } from "@/lib/data";

export const revalidate = 3600;

export default async function MLNStoryPage() {
	const stories = await getAllMLNStories();

	return (
		<>
			<MLNBiographyHero />
			<BiographyListing stories={stories} />
		</>
	);
}
