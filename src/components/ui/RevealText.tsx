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
	yOffset?: number;
	lineHeight?: number | string;
}

export const RevealText = ({
	children,
	className = "",
	tag: Tag = "div",
	delay = 0,
	duration = 1,
	yOffset = 100,
	lineHeight,
}: RevealTextProps) => {
	const comp = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (!textRef.current) return;

			// Use SplitType to split text into words
			const split = new SplitType(textRef.current, { types: "words,lines" });

			// Set overflow hidden on the lines to create the mask effect
			if (split.lines) {
				split.lines.forEach((line) => {
					gsap.set(line, {
						overflow: "hidden",
					});
				});
			}

			// Determine effective line height
			const isHeading = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(Tag);
			const effectiveLineHeight =
				lineHeight !== undefined ? lineHeight : isHeading ? 1.25 : undefined;

			// Set initial state: words start below the mask (invisible)
			gsap.set(split.words, {
				yPercent: yOffset,
				lineHeight: effectiveLineHeight,
			});

			ScrollTrigger.create({
				trigger: textRef.current,
				start: "top 85%",
				onEnter: () => {
					gsap.to(split.words, {
						yPercent: 0,
						duration: duration,
						ease: "power3.out",
						stagger: 0.02,
						delay: delay,
					});
				},
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
			<Tag ref={textRef as any} style={{ fontKerning: "none" }}>
				{children}
			</Tag>
		</div>
	);
};
