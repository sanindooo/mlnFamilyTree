import { useMemo, useState } from 'react';
import familyTree from '../../public/familyTree.json';

type Node = { id: string; name: string; slug?: string; children?: Node[] };

export default function ContributePage() {
  const nodes = useMemo(() => flatten(familyTree as Node), []);
  const [parentId, setParentId] = useState(nodes[0]?.id || '');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');

  const jsonSnippet = useMemo(() => {
    return JSON.stringify({ id: `id-${slug || name.toLowerCase().replace(/\s+/g, '-')}`, name, slug, birthDate }, null, 2);
  }, [name, slug, birthDate]);

  const mdTemplate = useMemo(() => {
    return `---\n` +
      `title: ${name || 'New Family Member'}\n` +
      `---\n\n` +
      `${bio || 'Write a short biography here.'}\n`;
  }, [name, bio]);

  function download(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1>Contribute</h1>
      <p>
        Add new relatives while keeping the site static. Fill the form, then download the JSON snippet
        and Markdown file. Share them with the site maintainer (email/PR) to be added to the tree.
      </p>
      <div className="form">
        <label>
          Parent in tree
          <select value={parentId} onChange={e => setParentId(e.target.value)}>
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </label>
        <label>
          Full name
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Janet Mdoe" />
        </label>
        <label>
          URL slug
          <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} placeholder="janet-mdoe" />
        </label>
        <label>
          Birth date
          <input value={birthDate} onChange={e => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" />
        </label>
        <label>
          Biography (Markdown)
          <textarea rows={8} value={bio} onChange={e => setBio(e.target.value)} placeholder="Life story, education, marriage, achievements..." />
        </label>
      </div>

      <h2>JSON Snippet (familyTree.json)</h2>
      <pre className="code-block">{jsonSnippet}</pre>
      <button className="button" onClick={() => download(jsonSnippet, `${slug || 'member'}.json`)}>Download JSON</button>

      <h2>Biography Markdown</h2>
      <pre className="code-block">{mdTemplate}</pre>
      <button className="button" onClick={() => download(mdTemplate, `${slug || 'member'}.md`)}>Download Markdown</button>

      <p className="muted">
        Submit these files via email or a GitHub Pull Request. The maintainer will attach the JSON under the chosen parent (ID: {parentId}) and add the Markdown to `src/content/`.
      </p>
    </>
  );
}

function flatten(root: Node): Node[] {
  const out: Node[] = [];
  const stack: Node[] = [root];
  while (stack.length) {
    const n = stack.pop()!;
    out.push(n);
    (n.children || []).forEach(c => stack.push(c));
  }
  return out;
}

