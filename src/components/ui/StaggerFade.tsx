"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface StaggerFadeProps {
	children: React.ReactNode;
	className?: string;
	tag?: "div" | "ul" | "ol" | "section" | "nav" | "aside";
	stagger?: number;
	delay?: number;
	duration?: number;
	triggerStart?: string;
}

export const StaggerFade = ({
	children,
	className = "",
	tag: Tag = "div",
	stagger = 0.1,
	delay = 0,
	duration = 0.8,
	triggerStart = "top 85%",
}: StaggerFadeProps) => {
	const container = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (!container.current) return;

			// Select direct children
			const childrenElements = container.current.children;

			if (childrenElements.length === 0) return;

			// Initial state: hidden and slightly down
			gsap.set(childrenElements, {
				opacity: 0,
				y: 20,
				autoAlpha: 0,
			});

			ScrollTrigger.create({
				trigger: container.current,
				start: triggerStart,
				onEnter: () => {
					gsap.to(childrenElements, {
						opacity: 1,
						y: 0,
						autoAlpha: 1,
						duration: duration,
						stagger: stagger,
						ease: "power2.out",
						delay: delay,
					});
				},
				// Play once logic
				toggleActions: "play none none none",
			});
		},
		{ scope: container, dependencies: [children] }
	);

	return (
		<Tag ref={container as any} className={className}>
			{children}
		</Tag>
	);
};
