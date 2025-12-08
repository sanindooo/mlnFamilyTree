import { AncestorHero } from "@/components/tree/AncestorHero";
import { TreeGrid } from "@/components/tree/TreeGrid";
import { InteractiveTree } from "@/components/tree/InteractiveTree";
import { getFamilyTree } from "@/lib/data";

export default async function TreePage() {
  const treeData = await getFamilyTree();

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
      <TreeGrid />
    </>
  );
}
