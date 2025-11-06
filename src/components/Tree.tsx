import { useState } from 'react';

export type TreeNode = {
  id: string;
  name: string;
  slug?: string;
  birthDate?: string;
  photo?: string;
  children?: TreeNode[];
};

export function Tree({ data }: { data: TreeNode }) {
  return (
    <div className="tree">
      <TreeBranch node={data} depth={0} />
    </div>
  );
}

function TreeBranch({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = (node.children || []).length > 0;

  return (
    <div className="branch" style={{ marginLeft: depth * 16 }}>
      <div className="branch-row">
        {hasChildren && (
          <button className="toggle" aria-label="toggle" onClick={() => setOpen(v => !v)}>
            {open ? '−' : '+'}
          </button>
        )}
        {node.photo && (
          <img src={node.photo} alt={node.name} className="tree-photo" />
        )}
        <a className={node.slug ? 'person' : 'person disabled'} href={node.slug ? `/${node.slug}` : '#'}>
          {node.name}
        </a>
        {node.birthDate && <span className="muted"> — {node.birthDate}</span>}
      </div>
      {open && hasChildren && (
        <div className="children">
          {node.children!.map(child => (
            <TreeBranch key={child.id} node={child} depth={depth + 1} />)
          )}
        </div>
      )}
    </div>
  );
}

