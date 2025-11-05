import fs from 'node:fs';
import path from 'node:path';
import Head from 'next/head';
import matter from 'gray-matter';
import familyTree from '../../public/familyTree.json';

type Props = { title: string; content: string };

export default function MemberPage({ title, content }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="prose">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = collectSlugs(familyTree as any);
  return { paths: slugs.map(slug => ({ params: { member: slug } })), fallback: false };
}

export async function getStaticProps({ params }: { params: { member: string } }) {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const file = path.join(contentDir, `${params.member}.md`);
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { props: { title: data.title || params.member, content } };
}

function collectSlugs(root: any): string[] {
  const out: string[] = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    if (n.slug) out.push(n.slug);
    (n.children || []).forEach((c: any) => stack.push(c));
  }
  return out;
}

function markdownToHtml(md: string): string {
  // very small subset: paragraphs and line breaks
  const esc = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`) 
    .join('\n');
}

