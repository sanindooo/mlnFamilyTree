import { Button } from "@/components/ui/Button";
import React from "react";

export function Hero() {
  return (
    <section id="hero" className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <article>
            <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl font-serif text-deep-umber">
              Katikkiro Martin Luther Nsibirwa MBE
            </h1>
            <p className="text-lg text-deep-umber">
              A pioneering leader, devoted family man, and cornerstone of Ugandan heritage. Explore the enduring legacy of a true visionary.
            </p>
            <nav className="mt-6 flex flex-wrap gap-4 md:mt-8" aria-label="Hero actions">
              <Button asChild>
                <a href="/mln-story">Discover the Biography</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/tree">View Family Tree</a>
              </Button>
            </nav>
          </article>
          <figure>
            <img
              src="/slideshow/Document from Paul Kiwana Nsibirwa.png"
              className="w-full object-cover rounded-xl sepia-[.4] shadow-xl border border-warm-sand"
              alt="Katikkiro Martin Luther Nsibirwa"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
