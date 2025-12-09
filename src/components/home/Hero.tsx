import { Button } from "@/components/ui/Button";
import React from "react";
import Image from "next/image";
import heroImage from "@/assets/images/Document from Paul Kiwana Nsibirwa.png";
import { RevealText } from "@/components/ui/RevealText";
import { RevealImage } from "@/components/ui/RevealImage";
import { StaggerFade } from "@/components/ui/StaggerFade";

export function Hero() {
	return (
		<section id="hero" className="py-12 md:py-16 lg:py-20">
			<div className="container">
				<div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
				<article>
					<RevealText
						tag="h1"
						className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl font-serif text-deep-umber"
						delay={0.1}
						yOffset={30}
						duration={1.2}
					>
						Katikkiro Martin Luther Nsibirwa MBE
					</RevealText>
					<RevealText tag="p" className="text-lg text-deep-umber" delay={0.3} yOffset={30} duration={1.2}>
						A pioneering leader, devoted family man, and cornerstone of
						Ugandan heritage. Explore the enduring legacy of a true visionary.
					</RevealText>
						<StaggerFade
							tag="nav"
							className="mt-6 flex flex-wrap gap-4 md:mt-8"
							aria-label="Hero actions"
							delay={0.5}
						>
							<div>
								<Button href="/mln-story">Discover the Biography</Button>
							</div>
							<div>
								<Button variant="secondary" href="/tree">
									View Family Tree
								</Button>
							</div>
						</StaggerFade>
					</article>
					<RevealImage delay={0.2}>
						<figure>
							<Image
								src={heroImage}
								className="w-full object-cover rounded-xl sepia-[.4] shadow-xl border border-warm-sand"
								alt="Katikkiro Martin Luther Nsibirwa"
								placeholder="blur"
							/>
						</figure>
					</RevealImage>
				</div>
			</div>
		</section>
	);
}
