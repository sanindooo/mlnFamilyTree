import { useMemo, useState } from 'react';
import familyTree from '../../public/familyTree.json';

type Node = { id: string; name: string; slug?: string; children?: Node[] };

// Contribute page lets family add members using two paths:
// 1) Download JSON + Markdown to email/share
// 2) Direct submit to the GitHub repo (secured by SUBMIT_SECRET)
export default function ContributePage() {
  const nodes = useMemo(() => flatten(familyTree as Node), []);
  const [parentId, setParentId] = useState(nodes[0]?.id || '');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [familyKey, setFamilyKey] = useState('');
  const [status, setStatus] = useState<string>('');
  // expose setter for submitDirect helper
  (window as any).setStatus = setStatus;

  // Preview of the JSON node that will be added under the selected parent
  const jsonSnippet = useMemo(() => {
    return JSON.stringify({ id: `id-${slug || name.toLowerCase().replace(/\s+/g, '-')}`, name, slug, birthDate }, null, 2);
  }, [name, slug, birthDate]);

  // Preview of the Markdown biography file contents
  const mdTemplate = useMemo(() => {
    return `---\n` +
      `title: ${name || 'New Family Member'}\n` +
      `---\n\n` +
      `${bio || 'Write a short biography here.'}\n`;
  }, [name, bio]);

  // Helper to download a file generated on the client
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
        Add new relatives. Option A: download files and share. Option B: submit directly — updates are
        committed to the site repository after entering the family key.
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
        <label>
          Family key (for direct submit)
          <input value={familyKey} onChange={e => setFamilyKey(e.target.value)} placeholder="Provided privately" />
        </label>
      </div>

      <h2>JSON Snippet (familyTree.json)</h2>
      <pre className="code-block">{jsonSnippet}</pre>
      <button className="button" onClick={() => download(jsonSnippet, `${slug || 'member'}.json`)}>Download JSON</button>

      <h2>Biography Markdown</h2>
      <pre className="code-block">{mdTemplate}</pre>
      <button className="button" onClick={() => download(mdTemplate, `${slug || 'member'}.md`)}>Download Markdown</button>

      <h2>Submit Directly</h2>
      <button className="button" onClick={submitDirect}>Submit to Site</button>
      {status && <p className="muted">{status}</p>}

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

async function submitDirect(this: any) {
  // Minimal client helper to POST to our API route.
  const btn = (event?.target as HTMLButtonElement | undefined);
  if (btn) btn.disabled = true;
  try {
    const form = document.querySelector('.form') as HTMLDivElement;
    const [parentEl, nameEl, slugEl, birthEl, bioEl, keyEl] = Array.from(form.querySelectorAll('select,input,textarea')) as any[];
    const res = await fetch('/api/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        familyKey: keyEl.value,
        parentId: parentEl.value,
        name: nameEl.value,
        slug: slugEl.value,
        birthDate: birthEl.value,
        bioMarkdown: bioEl.value
      })
    });
    const data = await res.json();
    (window as any).setStatus?.(data.ok ? 'Submitted successfully. It may take a minute to appear.' : `Error: ${data.error || 'Unknown'}`);
  } catch (e: any) {
    (window as any).setStatus?.(`Error: ${e.message}`);
  } finally {
    if (btn) btn.disabled = false;
  }
}

