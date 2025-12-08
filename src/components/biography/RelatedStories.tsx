import { Button } from "@/components/ui/Button";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MLNStory } from "@/types";
import fallbackImage from "@/assets/images/Children of MLN.jpg";

interface RelatedStoriesProps {
	currentSlug?: string;
	stories: MLNStory[];
}

export function RelatedStories({ currentSlug, stories }: RelatedStoriesProps) {
	// Filter out the current section if specified
	const relatedSections = currentSlug
		? stories.filter((s) => s.slug !== currentSlug)
		: stories;

	// Show max 2 items (these act as prev/next navigation)
	const displaySections = relatedSections.slice(0, 2);

	return (
		<section id="related" className="py-12 md:py-16 lg:py-20 bg-cream/20">
			<div className="container">
				<header className="mb-12 md:mb-16 lg:mb-20">
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
				</header>

				<ul className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:gap-x-12 list-none m-0 p-0">
					{displaySections.map((story) => (
						<li key={story.slug}>
							<article>
								<Link
									href={`/mln-story/${story.slug}`}
									className="mb-5 block sm:mb-6 group"
								>
									<figure className="w-full overflow-hidden rounded-xl border border-warm-sand m-0 relative aspect-video">
										<Image
											src={story.heroImage || fallbackImage}
											alt={story.title}
											className="object-cover sepia-[.4] transition-transform duration-300 group-hover:scale-105"
											fill
											sizes="(max-width: 768px) 100vw, 50vw"
										/>
									</figure>
								</Link>
								<div className="mb-2 mr-4 max-w-full text-sm font-semibold text-burgundy uppercase tracking-wider">
									Biography
								</div>
								<Link
									href={`/mln-story/${story.slug}`}
									className="mb-2 block max-w-full group"
								>
									<h3 className="text-xl font-bold md:text-2xl font-serif text-deep-umber group-hover:text-burgundy transition-colors">
										{story.title}
									</h3>
								</Link>
								<p className="text-deep-umber">{story.description}</p>
							</article>
						</li>
					))}
				</ul>

				<div className="mt-12 flex items-center justify-center md:mt-16">
					<Button variant="secondary" href="/mln-story">
						View All Sections
					</Button>
				</div>
			</div>
		</section>
	);
}
