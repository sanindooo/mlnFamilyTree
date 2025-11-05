import fs from 'node:fs';
import path from 'node:path';
import { GetStaticProps } from 'next';
import { useMemo, useState } from 'react';

type Doc = { slug: string; title: string; content: string };

export default function ChatPage({ docs }: { docs: Doc[] }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => (q ? rank(docs, q).slice(0, 5) : []), [q, docs]);

  return (
    <>
      <h1>Q&A (Local)</h1>
      <p className="muted">No external AI costs. Uses keyword search across bios.</p>
      <input className="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask about a person, event, school..." />
      <ul className="results">
        {results.map(r => (
          <li key={r.slug}>
            <a href={`/${r.slug}`}><strong>{r.title}</strong></a>
            <div className="snippet" dangerouslySetInnerHTML={{ __html: highlight(r.content, q) }} />
          </li>
        ))}
        {q && results.length === 0 && <li className="muted">No matches found</li>}
      </ul>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  if (!fs.existsSync(contentDir)) {
    return { props: { docs: [] } };
  }
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const docs: Doc[] = files.map(f => {
    const raw = fs.readFileSync(path.join(contentDir, f), 'utf8');
    const title = (raw.match(/^title:\s*(.*)$/m)?.[1] || f.replace(/\.md$/, '')).trim();
    const content = raw.replace(/^---[\s\S]*?---/, '').trim();
    return { slug: f.replace(/\.md$/, ''), title, content };
  });
  return { props: { docs } };
};

function rank(docs: Doc[], q: string): Doc[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return [...docs]
    .map(d => ({ d, score: terms.reduce((s, t) => s + count(d.title + ' ' + d.content, t), 0) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.d);
}

function count(text: string, term: string): number {
  return (text.toLowerCase().match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

function highlight(text: string, q: string): string {
  const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const terms = q.split(/\s+/).filter(Boolean);
  let out = safe;
  for (const t of terms) {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  }
  // return a short snippet
  return out.split(/\n+/).slice(0, 5).join('<br/>');
}

