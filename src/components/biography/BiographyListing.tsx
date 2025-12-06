"use client";

import { Button } from "@/components/ui/Button";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import { BiCube } from "react-icons/bi";

interface BiographySectionCardProps {
	title: string;
	description: string;
	href: string;
	imageSrc: string;
}

function BiographySectionCard({
	title,
	description,
	href,
	imageSrc,
}: BiographySectionCardProps) {
	return (
		<a
			href={href}
			className="relative p-6 md:p-8 group overflow-hidden rounded-xl block"
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-muted/80 z-10" />
				<img
					src={imageSrc}
					className="size-full object-cover transition-transform duration-500 group-hover:scale-105 sepia-[.3]"
					alt={title}
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
		</a>
	);
}

export function BiographyListing() {
	const sections = [
		{
			title: "Early years and family origins",
			description: "The formative experiences that built character and purpose",
			href: "/mln-story/early-years",
			imageSrc: "/gallery/Children of MLN.jpg",
		},
		{
			title: "Professional achievements and milestones",
			description: "Work that mattered, done with skill and dedication",
			href: "/mln-story/professional-achievements",
			imageSrc: "/gallery/MLN Family in Mamakomo 80s.jpg",
		},
		{
			title: "Family bonds and lasting legacy",
			description: "Relationships that endured and shaped generations forward",
			href: "/mln-story/family-bonds",
			imageSrc:
				"/gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg",
		},
	];

	return (
		<section
			id="bio-listing"
			className="py-12 md:py-16 lg:py-20 bg-white"
		>
			<div className="container">
				<div className="mb-12 md:mb-16 lg:mb-20">
					<div className="mx-auto max-w-2xl text-center">
						<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
							Foundation
						</p>
						<h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber">
							The roots that shaped a life
						</h2>
						<p className="text-lg text-deep-umber">
							Every person begins somewhere, shaped by place and circumstance
						</p>
					</div>
				</div>
				<ul className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 list-none m-0 p-0">
					{sections.map((section, index) => (
						<li key={index}>
							<BiographySectionCard {...section} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
