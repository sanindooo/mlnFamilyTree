import { SearchInterface } from "@/components/search/SearchInterface";
import { getAllBiographies } from "@/lib/data";

export const revalidate = 3600;

export default async function SearchPage() {
	const documents = await getAllBiographies();

	return (
		<>
			<SearchInterface documents={documents} />
		</>
	);
}
