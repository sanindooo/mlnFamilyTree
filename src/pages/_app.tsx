import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet" />
      </Head>
      <header className="site-header">
        <Link className="logo" href="/">MLN</Link>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/tree">Family Tree</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/contribute">Contribute</Link>
          <Link href="/chat">Q&A</Link>
        </nav>
      </header>
      <main className="main">
        <Component {...pageProps} />
      </main>
      <footer className="site-footer">© {new Date().getFullYear()} Nsibirwa Family</footer>
    </div>
  );
}

