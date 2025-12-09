"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	useEffect(() => {
		// Don't initialize Lenis on Sanity Studio routes
		if (pathname?.startsWith("/studio")) {
			return;
		}

		const lenis = new Lenis({
			prevent: (node) => {
				// Prevent Lenis on elements with data-prevent-lenis attribute
				if (node.getAttribute("data-prevent-lenis") === "true") {
					return true;
				}

				// Prevent Lenis on Sanity Studio elements
				// Check for common Sanity classes and attributes
				const element = node as HTMLElement;
				if (
					element.classList?.contains("sanity") ||
					element.closest("[data-sanity]") ||
					element.closest('[class*="sanity-"]')
				) {
					return true;
				}

				return false;
			},
		});

		lenis.on("scroll", ScrollTrigger.update);

		const update = (time: number) => {
			lenis.raf(time * 1000);
		};

		gsap.ticker.add(update);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(update);
			lenis.destroy();
		};
	}, [pathname]);

	return <>{children}</>;
};
