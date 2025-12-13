import { AncestorHero } from "@/components/tree/AncestorHero";
import { TreeGrid } from "@/components/tree/TreeGrid";
import { InteractiveTree } from "@/components/tree/InteractiveTree";
import { getFamilyTree } from "@/lib/data";
import { getGrandchildrenFromSanity } from "@/sanity/lib/fetch";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
	title: "Family Tree",
	description:
		"Explore the Nsibirwa family lineage and discover the descendants of Owek. Martin Luther Nsibirwa.",
	image: "/og/tree.jpg",
	path: "/tree",
});

export default async function TreePage() {
	const [treeData, grandchildren] = await Promise.all([
		getFamilyTree(),
		getGrandchildrenFromSanity(),
	]);

	return (
		<>
			<AncestorHero />
			{treeData ? (
				<InteractiveTree tree={treeData} />
			) : (
				<div className="py-16 text-center text-muted">
					Family tree data unavailable
				</div>
			)}
			<TreeGrid grandchildren={grandchildren} />
		</>
	);
}
