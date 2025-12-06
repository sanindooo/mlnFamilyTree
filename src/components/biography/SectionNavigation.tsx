"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface SectionNavigationProps {
	prevSection?: { title: string; href: string };
	nextSection?: { title: string; href: string };
}

export function SectionNavigation({
	prevSection,
	nextSection,
}: SectionNavigationProps) {
	return (
		<section className="py-8 md:py-12 bg-warm-sand/10 border-t border-warm-sand">
			<div className="container">
				<div className="flex items-center justify-between gap-4">
					{prevSection ? (
						<Button
							variant="secondary"
							asChild
							className="flex items-center gap-2"
						>
							<a href={prevSection.href}>
								<BiChevronLeft className="size-5" />
								<span className="hidden md:inline">{prevSection.title}</span>
								<span className="md:hidden">Previous</span>
							</a>
						</Button>
					) : (
						<div />
					)}

					<Button variant="secondary" asChild>
						<a href="/mln-story">View All Sections</a>
					</Button>

					{nextSection ? (
						<Button
							variant="secondary"
							asChild
							className="flex items-center gap-2"
						>
							<a href={nextSection.href}>
								<span className="hidden md:inline">{nextSection.title}</span>
								<span className="md:hidden">Next</span>
								<BiChevronRight className="size-5" />
							</a>
						</Button>
					) : (
						<div />
					)}
				</div>
			</div>
		</section>
	);
}
