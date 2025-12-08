import React from "react";
import Image from "next/image";
import heroImage from "@/assets/images/Document from Paul Kiwana Nsibirwa.png";

export function MLNBiographyHero() {
	return (
		<section className="relative py-20 md:py-28 lg:py-32 bg-deep-umber overflow-hidden">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<Image
					src={heroImage}
					alt="MLN"
					className="size-full object-cover opacity-20 sepia-[.5]"
					fill
					placeholder="blur"
				/>
				<div className="absolute inset-0 bg-deep-umber/70" />
			</div>

			{/* Content */}
			<div className="container relative z-10 text-center">
				<h1 className="mb-5 text-4xl font-bold text-cream md:mb-6 md:text-5xl lg:text-6xl font-serif">
					MLN biography
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-cream/90 md:text-xl">
					The journey from Bugerere to national leadership, told through
					documents and memory
				</p>
			</div>
		</section>
	);
}
