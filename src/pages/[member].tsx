import fs from 'node:fs';
import path from 'node:path';
import Head from 'next/head';
import matter from 'gray-matter';
import familyTree from '../../public/familyTree.json';

type Props = { title: string; content: string; photos?: string[] };

export default function MemberPage({ title, content, photos = [] }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="prose">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
        {photos.length > 0 && (
          <section style={{ marginTop: '32px' }}>
            <h2>Photo Gallery</h2>
            <div className="grid">
              {photos.map((photo) => (
                <figure key={photo} className="card">
                  <img src={photo} alt={`${title} - ${photo.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/i, '')}`} />
                </figure>
              ))}
            </div>
          </section>
        )}
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
  
  // Check for photos directory
  const photosDir = path.join(process.cwd(), 'public', 'members', params.member);
  let photos: string[] = [];
  if (fs.existsSync(photosDir)) {
    const files = fs.readdirSync(photosDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    photos = files.map(f => `/members/${params.member}/${f}`);
  }
  
  return { props: { title: data.title || params.member, content, photos } };
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

