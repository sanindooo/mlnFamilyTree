"use client";

import { Button } from "@/components/ui/Button";
import React, { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { RevealText } from "@/components/ui/RevealText";

interface TimelineEvent {
	year: string;
	title: string;
	description: string;
}

interface TimelineProps {
	events?: TimelineEvent[];
}

export function Timeline({ events = [] }: TimelineProps) {
	const container = useRef<HTMLElement>(null);

	const displayEvents =
		events.length > 0
			? events
			: [
					{
						year: "1883",
						title: "Beginnings",
						description:
							"Born in Buganda Kingdom during a transformative period in Uganda's history. A time when tradition and change collided.",
					},
					{
						year: "1920s",
						title: "Ascent",
						description:
							"Rose to prominence as a respected leader and advocate for his community. His voice carried weight in rooms where decisions were made.",
					},
					{
						year: "1930s–1940s",
						title: "Service",
						description:
							"Served in the Legislative Council, working tirelessly for social justice and development. His dedication shaped the nation's course.",
					},
					{
						year: "1945",
						title: "Legacy",
						description:
							"Tragically assassinated, leaving a powerful legacy that continues to inspire. His memory endures in the hearts of those who knew his work.",
					},
					{
						year: "Present Day",
						title: "Remembrance",
						description:
							"Remembered as a hero and pioneer whose contributions shaped modern Uganda.",
					},
			  ];

	useGSAP(
		() => {
			if (!container.current) return;
			const rows = gsap.utils.toArray<HTMLElement>(
				container.current.querySelectorAll(".timeline_row")
			);

			rows.forEach((row) => {
				const year = row.querySelector(".timeline_year");
				const title = row.querySelector(".timeline_title");
				const text = row.querySelector(".timeline_text");
				const icon = row.querySelector(".timeline-icon-wrapper");

				if (!year || !title || !text || !icon) return;

				const titleSplit = new SplitType(title as HTMLElement, {
					types: "words",
				});
				const textSplit = new SplitType(text as HTMLElement, {
					types: "words",
				});

				// Initial state for SplitText
				gsap.set([titleSplit.words, textSplit.words], {
					yPercent: 80,
					opacity: 0,
					autoAlpha: 0,
				});

				// Initial state for Year (simple fade, NO transform)
				gsap.set(year, {
					opacity: 0,
					autoAlpha: 0,
					// Explicitly ensure no transform is set
					x: 0,
					y: 0
				});

				// Text Animation Timeline
				const tlText = gsap.timeline({ paused: true });
				
				// Year fade in first/simultaneously - PURE FADE
				tlText.to(year, {
					opacity: 1,
					autoAlpha: 1,
					duration: 0.8,
					ease: "power2.out",
				}, 0);

				// Then split text content
				tlText.to([titleSplit.words, textSplit.words], {
					yPercent: 0,
					opacity: 1,
					autoAlpha: 1,
					stagger: 0.01,
					duration: 1,
					ease: "power3.out",
				}, 0.2);

				// Icon Animation Timeline
				const tlIcon = gsap.timeline({ paused: true });
				tlIcon.fromTo(
					icon,
					{ backgroundColor: "#e2c8a8" }, // warm-sand
					{
						backgroundColor: "#6d2e2a", // burgundy
						duration: 0.5,
						ease: "power3.inOut",
					}
				);

				// ScrollTrigger
				ScrollTrigger.create({
					trigger: row,
					start: "top 80%",
					end: "bottom 20%",
					// Play once: onEnter play, onLeave/EnterBack do nothing
					toggleActions: "play none none none",
					onEnter: () => {
						tlText.play();
						tlIcon.play();
					},
				});
			});
		},
		{ scope: container }
	);

	return (
		<section
			id="timeline"
			ref={container}
			className="py-12 md:py-16 lg:py-20 bg-cream/30 overflow-clip"
		>
			<div className="container">
				<div className="relative grid auto-cols-fr grid-cols-1 items-start justify-center gap-6 sm:gap-12 md:grid-cols-2 md:gap-24 lg:gap-32">
					<div className="relative top-0 z-10 md:sticky md:top-20 md:z-auto md:pr-4">
						<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
							Life & Times
						</p>
						<h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber">
							A life marked by courage and conviction
						</h2>
						<p className="text-lg text-deep-umber">
							Born into Buganda Kingdom during a time of profound change and
							upheaval.
						</p>
						<div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
							<Button variant="secondary" href="/mln-story">
								Read Full Biography
							</Button>
						</div>
					</div>
					<div className="absolute z-0 flex h-full w-8 flex-col items-center justify-self-start [grid-area:2/1/3/2] md:z-auto md:justify-self-center md:[grid-area:auto]">
						<div className="absolute z-10 h-16 w-1 bg-gradient-to-b from-cream to-transparent" />
						<div className="sticky top-0 mt-[-50vh] h-[50vh] w-[3px] bg-warm-sand" />
						<div className="h-full w-[3px] bg-warm-sand/30" />
						<div className="absolute bottom-0 z-0 h-16 w-1 bg-gradient-to-b from-transparent to-cream" />
						<div className="absolute top-[-50vh] h-[50vh] w-full bg-cream" />
					</div>
					<div className="grid auto-cols-fr gap-x-12 gap-y-8 sm:gap-y-12 md:gap-x-20 md:gap-y-20">
						{displayEvents.map((event, index) => (
							<div className="relative timeline_row" key={index}>
								{/* Icon/Circle */}
								<div className="absolute flex h-full w-8 items-start justify-center md:-ml-24 md:w-24 lg:-ml-32 lg:w-32">
									<div className="timeline-icon-wrapper z-20 mt-7 size-4 rounded-full shadow-[0_0_0_8px_#fff] md:mt-8 border border-warm-sand bg-warm-sand" />
								</div>
								
								<div className="ml-12 mt-4 flex flex-col md:ml-0">
									<h3 className="timeline_year mb-2 text-2xl font-bold leading-[1.2] md:text-3xl text-burgundy font-serif">
										{event.year}
									</h3>
									<h4 className="timeline_title mb-2 text-lg font-bold md:text-xl text-deep-umber">
										{event.title}
									</h4>
									<p className="timeline_text text-deep-umber">
										{event.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
