"use client";

import { Button } from "@/components/ui/Button";
import React, { useRef } from "react";
import Image from "next/image";
import bgImage from "@/assets/images/Children of MLN.jpg";
import { RevealText } from "@/components/ui/RevealText";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { FooterCTAData } from "@/types";

interface FooterCTAProps {
	data: FooterCTAData;
}

export function FooterCTA({ data }: FooterCTAProps) {
	const container = useRef<HTMLDivElement>(null);
	const bgImageRef = useRef<HTMLDivElement>(null);

	// Determine alt text for the image
	const imageAlt = data.backgroundImage?.alt || "Family gathering";

	useGSAP(
		() => {
			if (!bgImageRef.current) return;

			const imageElement = bgImageRef.current.querySelector("img");
			if (!imageElement) return;

			// Set initial scale (reduced by 50%)
			gsap.set(imageElement, { scale: 1.1, transformOrigin: "center center" });

			// Secondary motion: Image scales after text animation
			ScrollTrigger.create({
				trigger: container.current,
				start: "top 80%",
				onEnter: () => {
					gsap.to(imageElement, {
						scale: 1,
						duration: 1.5,
						ease: "expo.out", // Dramatic deceleration - starts fast, slows significantly
						delay: 0.9, // More pronounced secondary motion
					});
				},
				toggleActions: "play none none none",
			});
		},
		{ scope: container },
	);

	return (
		<section
			id="cta"
			ref={container}
			className="relative py-12 md:py-16 lg:py-20 bg-deep-umber text-cream overflow-hidden"
		>
			<div className="container relative z-10">
				<div className="flex flex-col items-center p-8 md:p-12 lg:p-16">
					<div className="max-w-lg text-center">
						<RevealText
							tag="h2"
							className="rb-5 mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif"
						>
							{data.title}
						</RevealText>
						<RevealText tag="p" className="text-lg" delay={0.2}>
							{data.text}
						</RevealText>
					</div>
					{(data.primaryButton || data.secondaryButton) && (
						<StaggerFade
							className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8"
							delay={0.4}
						>
							{data.primaryButton && (
								<div>
									<Button
										title={data.primaryButton.text}
										href={data.primaryButton.link}
										target={data.primaryButton.openInNewTab ? "_blank" : undefined}
										rel={data.primaryButton.openInNewTab ? "noopener noreferrer" : undefined}
										className="bg-cream text-deep-umber border-cream hover:bg-cream/90"
									>
										{data.primaryButton.text}
									</Button>
								</div>
							)}
							{data.secondaryButton && (
								<div>
									<Button
										title={data.secondaryButton.text}
										href={data.secondaryButton.link}
										target={data.secondaryButton.openInNewTab ? "_blank" : undefined}
										rel={data.secondaryButton.openInNewTab ? "noopener noreferrer" : undefined}
										variant="secondary"
										className="border-cream text-cream hover:bg-cream/10 hover:text-cream"
									>
										{data.secondaryButton.text}
									</Button>
								</div>
							)}
						</StaggerFade>
					)}
				</div>
			</div>

			{/* Background Image */}
			<div
				ref={bgImageRef}
				className="absolute inset-0 z-0 size-full overflow-hidden"
			>
				<div className="relative size-full">
					{data.backgroundImage?.url ? (
						<Image
							src={data.backgroundImage.url}
							className="size-full object-cover opacity-30 sepia-[.5]"
							alt={imageAlt}
							fill
						/>
					) : (
						<Image
							src={bgImage}
							className="size-full object-cover opacity-30 sepia-[.5]"
							alt={imageAlt}
							fill
							placeholder="blur"
						/>
					)}
					<div className="absolute inset-0 bg-deep-umber/80 mix-blend-multiply" />
				</div>
			</div>
		</section>
	);
}
