import Head from 'next/head';

const images = [
  '/gallery/reunion-1.jpg',
  '/gallery/reunion-2.jpg',
];

export default function GalleryPage() {
  return (
    <>
      <Head>
        <title>Gallery</title>
      </Head>
      <h1>Gallery</h1>
      <p>Reunions, weddings, graduations, and more.</p>
      <div className="grid">
        {images.map((src) => (
          <figure key={src} className="card">
            <img src={src} alt="Family event" />
          </figure>
        ))}
      </div>
    </>
  );
}

