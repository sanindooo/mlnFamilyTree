"use client";

import React from "react";

interface SectionGalleryProps {
  images: string[];
  sectionTitle: string;
}

export function SectionGallery({ images, sectionTitle }: SectionGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-cream/20">
      <div className="container">
        <header className="mb-8 md:mb-12">
          <h3 className="text-2xl font-bold md:text-3xl font-serif text-deep-umber text-center">
            Gallery
          </h3>
          <p className="text-center text-muted mt-2">Images from this period</p>
        </header>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0">
          {images.map((image, index) => (
            <li key={index}>
              <figure className="overflow-hidden rounded-xl border border-warm-sand shadow-lg group cursor-pointer m-0">
                <img
                  src={image}
                  alt={`${sectionTitle} - Image ${index + 1}`}
                  className="w-full h-48 object-cover sepia-[.3] transition-transform duration-300 group-hover:scale-105"
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
