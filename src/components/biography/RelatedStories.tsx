"use client";

import { Button } from "@/components/ui/Button";
import React from "react";

export function RelatedStories() {
  return (
    <section
      id="related"
      className="py-12 md:py-16 lg:py-20 bg-cream/20"
    >
      <div className="container">
				<div className="mb-12 md:mb-16 lg:mb-20">
					<div className="mx-auto w-full max-w-lg text-center">
						<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
							Records
						</p>
						<h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber">
							Connected stories in this archive
						</h2>
						<p className="text-lg text-deep-umber">
							Discover the narratives that shaped this person's path
						</p>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:gap-x-12">
					{/* Placeholder Item 1 */}
					<div>
						<a href="/mln-story" className="mb-5 block sm:mb-6">
							<div className="w-full overflow-hidden rounded-xl border border-warm-sand">
								<img
									src="/slideshow/Document from Paul Kiwana Nsibirwa.png"
									alt="MLN"
									className="aspect-video size-full object-cover sepia-[.4]"
								/>
							</div>
						</a>
						<div className="mb-2 mr-4 max-w-full text-sm font-semibold text-burgundy">
							Biography
						</div>
						<a href="/mln-story" className="mb-2 block max-w-full">
							<h5 className="text-xl font-bold md:text-2xl font-serif text-deep-umber">
								Katikkiro Martin Luther Nsibirwa
							</h5>
						</a>
						<p className="text-deep-umber">
							The patriarch and visionary leader.
						</p>
					</div>
					{/* Placeholder Item 2 */}
					<div>
						<a href="/tree" className="mb-5 block sm:mb-6">
							<div className="w-full overflow-hidden rounded-xl border border-warm-sand">
								<img
									src="/gallery/MLN Family in Mamakomo 80s.jpg"
									alt="Family Tree"
									className="aspect-video size-full object-cover sepia-[.4]"
								/>
							</div>
						</a>
						<div className="mb-2 mr-4 max-w-full text-sm font-semibold text-burgundy">
							Lineage
						</div>
						<a href="/tree" className="mb-2 block max-w-full">
							<h5 className="text-xl font-bold md:text-2xl font-serif text-deep-umber">
								The Nsibirwa Family Tree
							</h5>
						</a>
						<p className="text-deep-umber">
							Explore the generations of the Nsibirwa family.
						</p>
					</div>
				</div>
				<div className="mt-12 flex items-center justify-center md:mt-16">
					<Button variant="secondary" asChild>
						<a href="/search">Search Archive</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
