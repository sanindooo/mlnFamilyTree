import { SearchInterface } from "@/components/search/SearchInterface";
import { getAllBiographies } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
	title: "Search",
	description:
		"Search through biographies, stories, and historical records of the Nsibirwa family.",
	path: "/search",
});

export default async function SearchPage() {
	const documents = await getAllBiographies();

	return (
		<>
			<SearchInterface documents={documents} />
		</>
	);
}
