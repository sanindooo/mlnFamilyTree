import { AncestorHero } from "@/components/tree/AncestorHero";
import { TreeGrid } from "@/components/tree/TreeGrid";
import { InteractiveTree } from "@/components/tree/InteractiveTree";
import { getFamilyTree } from "@/lib/data";

export default async function TreePage() {
  const treeData = await getFamilyTree();

  return (
    <>
      <AncestorHero />
      <InteractiveTree tree={treeData} />
      <TreeGrid />
    </>
  );
}
