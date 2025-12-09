"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

interface RevealTextProps {
	children: React.ReactNode;
	className?: string;
	tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
	delay?: number;
	duration?: number;
}

export const RevealText = ({
	children,
	className = "",
	tag: Tag = "div",
	delay = 0,
	duration = 1,
}: RevealTextProps) => {
	const comp = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (!textRef.current) return;

			// Use SplitType to split text into words
			const split = new SplitType(textRef.current, { types: "words" });

			// Set initial state: words slightly down and invisible
			gsap.set(split.words, {
				yPercent: 100,
				opacity: 0,
				autoAlpha: 0,
			});

			ScrollTrigger.create({
				trigger: textRef.current,
				start: "top 85%", // Trigger when top of element hits 85% of viewport height
				onEnter: () => {
					gsap.to(split.words, {
						yPercent: 0,
						opacity: 1,
						autoAlpha: 1,
						duration: duration,
						ease: "power3.out",
						stagger: 0.02,
						delay: delay,
					});
				},
				// Optional: Reset when scrolling back up?
				// User didn't strictly specify, but usually "play once" is better for reading.
				// leaving it as play once for now.
			});

			// Cleanup on unmount (revert split)
			return () => {
				split.revert();
			};
		},
		{ scope: comp, dependencies: [children] }
	);

	return (
		<div ref={comp} className={className}>
			{/* 
        We use a specific ref for the tag. 
        Note: SplitType works on the DOM element content.
      */}
			<Tag ref={textRef as any} style={{ fontKerning: "none" }}>
				{children}
			</Tag>
		</div>
	);
};
