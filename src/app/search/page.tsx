import { SearchInterface } from "@/components/search/SearchInterface";
import { getAllBiographies } from "@/lib/data";

export default async function SearchPage() {
  const documents = await getAllBiographies();

  return (
    <>
      <SearchInterface documents={documents} />
    </>
  );
}

