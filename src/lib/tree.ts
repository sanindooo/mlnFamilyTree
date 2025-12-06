import { Person } from "@/types";

/**
 * Produces a flat list of all nodes within a tree, depth-first.
 * Useful for search and indexing.
 */
export function flattenTree(root: Person): Person[] {
  const stack = [root]; // start with the root node
  const out: Person[] = []; // accumulator for flattened nodes
  while (stack.length) { // iterate until all nodes visited
    const node = stack.pop(); // pop last element (depth-first)
    if (!node) continue;
    
    out.push(node); // record current node
    (node.children || []).slice().reverse().forEach((child) => stack.push(child)); // push children for later (reverse to preserve order in stack)
  }
  return out; // final flattened collection
}

/**
 * Finds a specific node by slug in the tree.
 */
export function findNodeBySlug(root: Person, slug: string): Person | null {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (node.slug === slug) return node;
    if (node.children) {
      node.children.forEach(child => stack.push(child));
    }
  }
  return null;
}

