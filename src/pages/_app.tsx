import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Head>
        {/**
         * Load favicon and fonts globally. Fonts match the Heritage Warmth spec:
         * - Playfair Display for headings
         * - Lato for body text
         */}
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet" />
      </Head>
      <header className="site-header">
        {/** Site logo and primary navigation. */}
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
        {/** Render the active page. */}
        <Component {...pageProps} />
      </main>
      <footer className="site-footer">
        {/**
         * Three-column footer:
         * - About text
         * - Quick links
         * - Contact note and copyright
         */}
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">Nsibirwa Family Legacy</h3>
            <p>Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/martin-luther-nsibirwa">Biography</Link></li>
              <li><Link href="/tree">Family Tree</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contribute">Contribute</Link></li>
              <li><Link href="/chat">Q&A</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>For additions or corrections, share files via email or PR.
            </p>
            <p className="muted">© {new Date().getFullYear()} Nsibirwa Family</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

