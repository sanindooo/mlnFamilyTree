import React from "react";
import Image from "next/image";
import heroImage from "@/assets/images/Document from Paul Kiwana Nsibirwa.png";
import { ScaleBackground } from "@/components/ui/ScaleBackground";
import { StaggerFade } from "@/components/ui/StaggerFade";

export function MLNBiographyHero() {
	return (
		<section className="relative py-20 md:py-28 lg:py-32 bg-deep-umber overflow-hidden">
			{/* Content */}
			<StaggerFade tag="div" className="container relative z-10 text-center" delay={0.2}>
				<div>
					<h1 className="mb-5 text-4xl font-bold text-cream md:mb-6 md:text-5xl lg:text-6xl font-serif">
						MLN biography
					</h1>
				</div>
				<div>
					<p className="mx-auto max-w-2xl text-lg text-cream/90 md:text-xl">
						The journey from Bugerere to national leadership, told through
						documents and memory
					</p>
				</div>
			</StaggerFade>

			{/* Background Image with Overlay - ensure absolute positioning works */}
			<ScaleBackground className="absolute inset-0 z-0 size-full">
				<div className="relative size-full">
					<Image
						src={heroImage}
						alt="MLN"
						className="size-full object-cover opacity-20 sepia-[.5]"
						fill
						placeholder="blur"
					/>
					<div className="absolute inset-0 bg-deep-umber/70" />
				</div>
			</ScaleBackground>
		</section>
	);
}
