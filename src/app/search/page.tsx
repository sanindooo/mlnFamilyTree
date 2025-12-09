import { SearchInterface } from "@/components/search/SearchInterface";
import { getAllBiographies } from "@/lib/data";

export const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

export default async function SearchPage() {
	const documents = await getAllBiographies();

	return (
		<>
			<SearchInterface documents={documents} />
		</>
	);
}
