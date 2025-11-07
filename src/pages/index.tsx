import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import familyTree from '../../public/familyTree.json';

// Minimal shape for people in the tree used by this page.
type TreeNode = {
  id: string;
  name: string;
  slug?: string;
  birthDate?: string;
  children?: TreeNode[];
};

export default function Home() {
  // Search state and index built from the tree.
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
      {/* Hero: Intro to MLN + CTAs */}
      <section className="hero">
        <div className="hero-text">
          <h1>Owek. Martin Luther Nsibirwa</h1>
          <p>A pioneering leader, devoted family man, and cornerstone of Ugandan heritage. Explore the enduring legacy of a true visionary.</p>
          <div className="cta-row">
            <Link className="button" href="/martin-luther-nsibirwa">Discover His Story</Link>
            <Link className="button secondary" href="/tree">View Family Tree</Link>
          </div>
        </div>
        <div className="hero-card" aria-hidden>
          <div className="hero-gradient">MLN</div>
        </div>
      </section>

      {/* Highlights: Three key legacy areas */}
      <section className="highlights">
        <h2>Legacy Highlights</h2>
        <div className="highlights-grid">
          <div className="card pad">
            <h3>Political Pioneer</h3>
            <p>Served on the Legislative Council, advocating for justice and progress in colonial Uganda.</p>
          </div>
          <div className="card pad">
            <h3>Family Foundation</h3>
            <p>Built a strong family legacy that inspires generations with integrity, education, and service.</p>
          </div>
          <div className="card pad">
            <h3>Educational Advocate</h3>
            <p>Championed education and literacy as keys to empowerment and national development.</p>
          </div>
        </div>
      </section>

      {/* Timeline: Milestones. Content kept brief; expand later as needed. */}
      <section className="timeline">
        <h2>Life & Times</h2>
        <ol>
          <li>
            <div className="year">1890s</div>
            <div className="desc">Born in Buganda Kingdom during a transformative period in Uganda's history.</div>
          </li>
          <li>
            <div className="year">1920s</div>
            <div className="desc">Rose to prominence as a respected leader and advocate for his community.</div>
          </li>
          <li>
            <div className="year">1930s–1940s</div>
            <div className="desc">Served in the Legislative Council, working tirelessly for social justice and development.</div>
          </li>
          <li>
            <div className="year">1945</div>
            <div className="desc">Tragically assassinated, leaving a powerful legacy that continues to inspire.</div>
          </li>
          <li>
            <div className="year">Present Day</div>
            <div className="desc">Remembered as a hero and pioneer whose contributions shaped modern Uganda.</div>
          </li>
        </ol>
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

/**
 * Flattens the tree into a simple array of nodes for quick client-side search.
 * @param root Root of the family tree
 * @returns Depth-first list of nodes
 */
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

