import { Button } from "@/components/ui/Button";
import React from "react";
import Image from "next/image";
import bgImage from "@/assets/images/Children of MLN.jpg";
import { RevealText } from "@/components/ui/RevealText";
import { ScaleBackground } from "@/components/ui/ScaleBackground";
import { StaggerFade } from "@/components/ui/StaggerFade";

export function EventCTA() {
	return (
		<section
			id="cta"
			className="relative py-12 md:py-16 lg:py-20 bg-deep-umber text-cream overflow-hidden"
		>
			<div className="container relative z-10">
				<div className="flex flex-col items-center p-8 md:p-12 lg:p-16">
					<div className="max-w-lg text-center">
						<RevealText
							tag="h2"
							className="rb-5 mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif"
						>
							Join us this December
						</RevealText>
						<RevealText tag="p" className="text-lg" delay={0.2}>
							Mark your calendar for December 27th and be part of something
							meaningful as we celebrate this remarkable life.
						</RevealText>
					</div>
					<StaggerFade className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8" delay={0.4}>
						<div>
							<Button
								title="Register"
								className="bg-cream text-deep-umber border-cream hover:bg-cream/90"
							>
								Register
							</Button>
						</div>
						<div>
							<Button
								title="Details"
								variant="secondary"
								className="border-cream text-cream hover:bg-cream/10 hover:text-cream"
							>
								Details
							</Button>
						</div>
					</StaggerFade>
				</div>
			</div>
			
			{/* Background Image - moved outside container to be absolute to section */}
			<ScaleBackground className="absolute inset-0 z-0 size-full">
				<div className="relative size-full">
					<Image
						src={bgImage}
						className="size-full object-cover opacity-30 sepia-[.5]"
						alt="Family gathering"
						fill
						placeholder="blur"
					/>
					<div className="absolute inset-0 bg-deep-umber/80 mix-blend-multiply" />
				</div>
			</ScaleBackground>
		</section>
	);
}
