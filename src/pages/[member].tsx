import fs from 'node:fs';
import path from 'node:path';
import Head from 'next/head';
import matter from 'gray-matter';
import familyTree from '../../public/familyTree.json';

// Page props include the parsed markdown and any photos found for the member
type Props = { title: string; content: string; photos?: string[] };

export default function MemberPage({ title, content, photos = [] }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className="hero" style={{marginTop: 0}}>
        <div className="hero-text">
          <h1>{title}</h1>
          <p>Biography and selected photographs from the Nsibirwa family archives.</p>
        </div>
        {photos.length > 0 && (
          <div className="hero-card" aria-hidden>
            <img src={photos[0]} alt={title} style={{width:'100%',maxWidth:360,aspectRatio:'1/1',objectFit:'cover',borderRadius:16,border:'1px solid var(--warm-sand)',filter:'sepia(.5)'}}/>
          </div>
        )}
      </section>
      <article className="prose">
        {/** Render a very small markdown subset as HTML (no external libs). */}
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
        {photos.length > 0 && (
          <section style={{ marginTop: '32px' }}>
            <h2>Photo Gallery</h2>
            <div className="grid">
              {photos.map((photo) => {
                const fname = photo.split('/').pop() || '';
                const caption = fname.replace(/\.(jpg|jpeg|png)$/i, '').replace(/[-_]/g, ' ');
                return (
                  <figure key={photo} className="card">
                    <img src={photo} alt={`${title} — ${caption}`} />
                    <figcaption>{caption}</figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

export async function getStaticPaths() {
  // Pre-generate pages for any member that has a slug in the tree
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

