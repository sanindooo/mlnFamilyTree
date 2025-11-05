import Head from 'next/head';
import familyTree from '../../public/familyTree.json';
import { Tree } from '../components/Tree';

export default function TreePage() {
  return (
    <>
      <Head>
        <title>Family Tree</title>
      </Head>
      <h1>Family Tree</h1>
      <Tree data={familyTree as any} />
    </>
  );
}

