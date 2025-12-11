import { AncestorHero } from "@/components/tree/AncestorHero";
import { TreeGrid } from "@/components/tree/TreeGrid";
import { InteractiveTree } from "@/components/tree/InteractiveTree";
import { getFamilyTree } from "@/lib/data";
import { getGrandchildrenFromSanity } from "@/sanity/lib/fetch";

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
