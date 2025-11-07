import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';

type Body = {
  familyKey?: string;
  parentId: string;
  name: string;
  slug: string;
  birthDate?: string;
  bioMarkdown: string;
};

/**
 * API route that commits a new member to the GitHub repo.
 * Keeps the website static while enabling family-driven updates via Git.
 * Requires env vars: GITHUB_TOKEN, GITHUB_REPO, (optional) GITHUB_BRANCH, SUBMIT_SECRET.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { familyKey, parentId, name, slug, birthDate, bioMarkdown } = req.body as Body;
  if (!familyKey || familyKey !== process.env.SUBMIT_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  if (!parentId || !name || !slug || !bioMarkdown) return res.status(400).json({ error: 'Missing fields' });

  // GitHub configuration is supplied via environment variables on Vercel.
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO; // e.g. owner/name
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token || !repoFull) return res.status(500).json({ error: 'Server not configured' });

  const [owner, repo] = repoFull.split('/');
  const octokit = new Octokit({ auth: token });

  try {
    // 1) Fetch familyTree.json from repo
    const treePath = 'public/familyTree.json';
    const treeFile = await octokit.repos.getContent({ owner, repo, path: treePath, ref: branch });
    if (!('content' in treeFile.data)) throw new Error('familyTree.json not found');
    const jsonStr = Buffer.from(treeFile.data.content, 'base64').toString('utf8');
    const tree = JSON.parse(jsonStr);

    // 2) Insert new node under parentId
    const newNode = { id: `id-${slug}`, name, slug, birthDate, children: [] as any[] };
    const inserted = insertChild(tree, parentId, newNode);
    if (!inserted) return res.status(400).json({ error: 'Parent not found' });

    const updatedJson = JSON.stringify(tree, null, 2);

    // 3) Create markdown content
    const mdPath = `src/content/${slug}.md`;
    const mdContent = `---\ntitle: ${name}\n---\n\n${bioMarkdown}\n`;

    // 4) Commit both changes in two writes (simple, readable approach)
    const commitMessage = `feat(content): add ${name}`;

    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: treePath, message: commitMessage, content: Buffer.from(updatedJson).toString('base64'), branch, sha: (treeFile.data as any).sha,
    });

    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: mdPath, message: commitMessage, content: Buffer.from(mdContent).toString('base64'), branch,
    });

    return res.status(200).json({ ok: true, slug });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Failed to submit' });
  }
}

/** Append a child node to a parent with matching id (depth-first). */
function insertChild(root: any, parentId: string, child: any): boolean {
  // Depth-first search to find a parent by id and append the child
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    if (n.id === parentId) {
      n.children = n.children || [];
      n.children.push(child);
      return true;
    }
    (n.children || []).forEach((c: any) => stack.push(c));
  }
  return false;
}


