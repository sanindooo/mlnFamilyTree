"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface RevealImageProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
}

export const RevealImage = ({
	children,
	className = "",
	delay = 0,
	duration = 1.5,
}: RevealImageProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!containerRef.current) return;

			const element = containerRef.current;

			// Initial state: Hidden by clip-path (top down reveal effect)
			// polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%) -> Top strip hidden
			gsap.set(element, {
				clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
			});

			ScrollTrigger.create({
				trigger: element,
				start: "top 80%",
				onEnter: () => {
					gsap.to(element, {
						clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
						duration: duration,
						ease: "power2.inOut",
						delay: delay,
					});
				},
			});
		},
		{ scope: containerRef }
	);

	return (
		<div ref={containerRef} className={className}>
			{children}
		</div>
	);
};
