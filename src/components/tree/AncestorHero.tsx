import { Button } from "@/components/ui/Button";
import React from "react";
import Image from "next/image";
import ancestorImage from "@/assets/images/Children of MLN.jpg";

export function AncestorHero() {
	return (
		<section
			id="ancestor-hero"
			className="relative py-12 md:py-16 lg:py-20 bg-deep-umber"
		>
			<div className="container relative z-10 max-w-lg text-center">
				<p className="mb-3 font-semibold text-cream/80 md:mb-4 uppercase tracking-wider text-sm">
					Ancestor
				</p>
				<h1 className="mb-5 text-4xl font-bold text-cream md:mb-6 md:text-5xl lg:text-6xl font-serif">
					A life remembered
				</h1>
				<p className="text-cream/90 text-lg">
					Born into a world that shaped generations. Their story lives on
					through family and legacy.
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
					<Button className="bg-cream text-deep-umber border-cream hover:bg-cream/90">
						Explore
					</Button>
					<Button
						variant="secondary"
						className="text-cream border-cream hover:bg-cream/10 hover:text-cream"
					>
						Share
					</Button>
				</div>
			</div>
			<div className="absolute inset-0 z-0">
				<Image
					src={ancestorImage}
					className="size-full object-cover opacity-40 sepia-[.5]"
					alt="Ancestor"
					fill
					placeholder="blur"
				/>
				<div className="absolute inset-0 bg-deep-umber/50 mix-blend-multiply" />
			</div>
		</section>
	);
}
