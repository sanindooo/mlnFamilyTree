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
		<nav
			aria-label="Section navigation"
			className="py-8 md:py-12 bg-warm-sand/10 border-t border-warm-sand"
		>
			<div className="container">
				<div className="flex items-center justify-between gap-4">
					{prevSection ? (
						<Button
							variant="secondary"
							href={prevSection.href}
							className="flex items-center gap-2"
						>
							<BiChevronLeft className="size-5" />
							<span className="hidden md:inline">{prevSection.title}</span>
							<span className="md:hidden">Previous</span>
						</Button>
					) : (
						<div />
					)}

					<Button variant="secondary" href="/mln-story">
						View All Sections
					</Button>

					{nextSection ? (
						<Button
							variant="secondary"
							href={nextSection.href}
							className="flex items-center gap-2"
						>
							<span className="hidden md:inline">{nextSection.title}</span>
							<span className="md:hidden">Next</span>
							<BiChevronRight className="size-5" />
						</Button>
					) : (
						<div />
					)}
				</div>
			</div>
		</nav>
	);
}
