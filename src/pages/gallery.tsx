import Head from 'next/head';

const images = [
  {
    src: '/gallery/Children of MLN.jpg',
    alt: 'Children of MLN'
  },
  {
    src: '/gallery/MLN Family in Mamakomo 80s.jpg',
    alt: 'MLN Family in Mamakomo 80s'
  },
  {
    src: '/gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg',
    alt: 'MLN Family Reunion 2003 at Greenhill Schools'
  }
];

export default function GalleryPage() {
  return (
    <>
      <Head>
        <title>Gallery</title>
      </Head>
      <h1>Gallery</h1>
      <p>Family reunions, weddings, graduations, and memorable moments from the Nsibirwa family history.</p>
      <div className="grid">
        {images.map((img) => (
          <figure key={img.src} className="card">
            <img src={img.src} alt={img.alt} />
            <figcaption>{img.alt}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

