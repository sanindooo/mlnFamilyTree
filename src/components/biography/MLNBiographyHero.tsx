"use client";

import React, { useRef } from "react";
import Image from "next/image";
import heroImage from "@/assets/images/Document from Paul Kiwana Nsibirwa.png";
import { RevealText } from "@/components/ui/RevealText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export function MLNBiographyHero() {
	const container = useRef<HTMLElement>(null);
	const bgImageRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		if (!bgImageRef.current) return;

		const imageElement = bgImageRef.current.querySelector("img");
		if (!imageElement) return;

		// Set initial scale
		gsap.set(imageElement, { scale: 1.1, transformOrigin: "center center" });

	// Secondary motion: Image scales after text animation
	ScrollTrigger.create({
		trigger: container.current,
		start: "top 80%",
		onEnter: () => {
		gsap.to(imageElement, {
			scale: 1,
			duration: 1.2,
			ease: "expo.out", // Dramatic deceleration - starts fast, slows significantly
			delay: 0.9, // More pronounced secondary motion
		});
		},
		toggleActions: "play none none none",
	});
	}, { scope: container });

	return (
		<section ref={container} className="relative py-20 md:py-28 lg:py-32 bg-deep-umber overflow-hidden">
			{/* Content */}
			<div className="container relative z-10 text-center">
				<RevealText
					tag="h1"
					className="mb-5 text-4xl font-bold text-cream md:mb-6 md:text-5xl lg:text-6xl font-serif"
					delay={0.2}
				>
					MLN biography
				</RevealText>
				<RevealText
					tag="p"
					className="mx-auto max-w-2xl text-lg text-cream/90 md:text-xl"
					delay={0.3}
				>
					The journey from Bugerere to national leadership, told through
					documents and memory
				</RevealText>
			</div>

			{/* Background Image with Overlay */}
			<div ref={bgImageRef} className="absolute inset-0 z-0 size-full overflow-hidden">
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
			</div>
		</section>
	);
}
