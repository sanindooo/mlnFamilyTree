import { Button } from "@/components/ui/Button";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { RxChevronRight } from "react-icons/rx";
import { BiCube } from "react-icons/bi";
import { MLNStory } from "@/types";
import fallbackImage from "@/assets/images/Children of MLN.jpg";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { RevealText } from "@/components/ui/RevealText";

interface BiographySectionCardProps {
	title: string;
	description: string;
	href: string;
	imageSrc: string | StaticImageData;
}

function BiographySectionCard({
	title,
	description,
	href,
	imageSrc,
}: BiographySectionCardProps) {
	return (
		<Link
			href={href}
			className="relative p-6 md:p-8 group overflow-hidden rounded-xl block"
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-muted/80 z-10" />
				<Image
					src={imageSrc}
					className="size-full object-cover transition-transform duration-500 group-hover:scale-105 sepia-[.3]"
					alt={title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<div className="relative z-20 flex flex-col justify-between min-h-[240px]">
				<div className="mb-6">
					<BiCube className="size-12 text-cream mb-4" />
				</div>
				<div>
					<h3 className="mb-3 text-xl font-bold text-cream md:mb-4 md:text-2xl lg:text-3xl font-serif leading-tight">
						{title}
					</h3>
					<p className="text-cream/90 mb-4">{description}</p>
					<div className="flex items-center text-cream group-hover:text-antique-gold transition-colors">
						<RxChevronRight className="size-5" />
					</div>
				</div>
			</div>
		</Link>
	);
}

interface BiographyListingProps {
	stories: MLNStory[];
}

export function BiographyListing({ stories }: BiographyListingProps) {
	return (
		<section id="bio-listing" className="py-12 md:py-16 lg:py-20 bg-white">
			<div className="container">
				<div className="mb-12 md:mb-16 lg:mb-20">
					<div className="mx-auto max-w-2xl text-center">
						<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
							Foundation
						</p>
					<RevealText
						tag="h2"
						className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber"
						yOffset={30}
						duration={1.2}
					>
						The roots that shaped a life
					</RevealText>
					<RevealText tag="p" className="text-lg text-deep-umber" delay={0.2} yOffset={30} duration={1.2}>
						Every person begins somewhere, shaped by place and circumstance
					</RevealText>
					</div>
				</div>
				<StaggerFade
					tag="ul"
					className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 list-none m-0 p-0"
					stagger={0.15}
				>
					{stories.map((story, index) => (
						<li key={story.slug}>
							<BiographySectionCard
								title={story.title}
								description={story.description}
								href={`/mln-story/${story.slug}`}
								imageSrc={story.heroImage || fallbackImage}
							/>
						</li>
					))}
				</StaggerFade>
			</div>
		</section>
	);
}
