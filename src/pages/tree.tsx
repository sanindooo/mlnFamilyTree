import Head from 'next/head';
import familyTree from '../../public/familyTree.json';
import { Tree } from '../components/Tree';

export default function TreePage() {
  return (
    <>
      <Head>
        <title>Family Tree</title>
      </Head>
      <section className="hero" style={{marginTop: 0}}>
        <div className="hero-text">
          <h1>Family Tree</h1>
          <p>Browse the Nsibirwa lineage from MLN through his children, grandchildren, and great‑grandchildren.</p>
        </div>
        <div className="hero-card" aria-hidden>
          <div className="hero-gradient">Tree</div>
        </div>
      </section>
      {/** Interactive tree component. Click the +/- to expand/collapse branches. */}
      <Tree data={familyTree as any} />
    </>
  );
}

