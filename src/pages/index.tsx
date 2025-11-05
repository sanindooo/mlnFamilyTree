import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import familyTree from '../../public/familyTree.json';

type TreeNode = {
  id: string;
  name: string;
  slug?: string;
  birthDate?: string;
  children?: TreeNode[];
};

export default function Home() {
  const [query, setQuery] = useState('');
  const people = useMemo(() => flattenTree(familyTree as TreeNode), []);
  const results = useMemo(() => {
    if (!query.trim()) return [] as TreeNode[];
    const q = query.toLowerCase();
    return people.filter(p =>
      p.name.toLowerCase().includes(q) || (p.birthDate || '').includes(q)
    ).slice(0, 10);
  }, [query, people]);

  return (
    <>
      <Head>
        <title>MLN Family</title>
      </Head>
      <section>
        <h1>MLN — Life and Legacy</h1>
        <p>
          Explore the Nsibirwa family history starting from Martin Luther Nsibirwa. Browse the tree,
          read biographies, and view our gallery.
        </p>
        <div className="cta-row">
          <Link className="button" href="/tree">View Family Tree</Link>
          <Link className="button secondary" href="/gallery">Open Gallery</Link>
        </div>
      </section>

      <section>
        <h2>Quick Search</h2>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search relatives, birth years, events..."
          className="search"
        />
        {query && (
          <ul className="results">
            {results.map(p => (
              <li key={p.id}>
                {p.slug ? <Link href={`/${p.slug}`}>{p.name}</Link> : p.name}
                {p.birthDate ? <span className="muted"> — {p.birthDate}</span> : null}
              </li>
            ))}
            {results.length === 0 && <li className="muted">No results</li>}
          </ul>
        )}
      </section>
    </>
  );
}

function flattenTree(root: TreeNode): TreeNode[] {
  const out: TreeNode[] = [];
  const stack: TreeNode[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    out.push(node);
    (node.children || []).forEach(child => stack.push(child));
  }
  return out;
}

