"use client";

import { Button } from "@/components/ui/Button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { clsx } from "clsx";

const useRelume = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 991px)");
	const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

	const getMobileOverlayClassNames = clsx(
		"fixed inset-0 z-40 bg-black/50 lg:hidden",
		{
			block: isMobileMenuOpen,
			hidden: !isMobileMenuOpen,
		}
	);

	const NavbarWrapper = (isMobile ? motion.nav : "nav") as any;

	const animateMobileMenu = isMobileMenuOpen ? "open" : "closed";

	return {
		toggleMobileMenu,
		getMobileOverlayClassNames,
		animateMobileMenu,
		NavbarWrapper,
		isMobileMenuOpen,
	};
};

const navLinks = [
	{ href: "/mln-story", label: "Biography" },
	{ href: "/tree", label: "Family Tree" },
	{ href: "/gallery", label: "Gallery" },
];

export function Navbar() {
	const useActive = useRelume();

	return (
		<header className="border-b border-warm-sand bg-white sticky top-0 z-40">
			<div className="container">
				<div className="flex h-16 md:h-18 items-center justify-between">
					{/* Left: Desktop Navigation */}
					<nav
						className="hidden lg:flex items-center"
						aria-label="Main navigation"
					>
						<ul className="flex items-center gap-6 list-none m-0 p-0">
							{navLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-base font-medium text-deep-umber hover:text-burgundy transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					{/* Mobile Menu Button (Left on mobile) */}
					<button
						className="flex size-10 flex-col items-center justify-center gap-1 lg:hidden"
						onClick={useActive.toggleMobileMenu}
						aria-label="Toggle mobile menu"
						aria-expanded={useActive.isMobileMenuOpen}
					>
						<span className="h-0.5 w-6 bg-deep-umber transition-all" />
						<span className="h-0.5 w-6 bg-deep-umber transition-all" />
						<span className="h-0.5 w-6 bg-deep-umber transition-all" />
					</button>

					{/* Center: Logo */}
					<a
						href="/"
						className="absolute left-1/2 -translate-x-1/2 flex items-center"
					>
						<span className="font-serif font-bold text-xl md:text-2xl text-deep-umber whitespace-nowrap">
							MLN Museum
						</span>
					</a>

					{/* Right: CTA Button */}
					<div className="flex items-center">
						<Button
							asChild
							size="sm"
							className="bg-antique-gold border-antique-gold hover:bg-antique-gold/90"
						>
							<a href="/mln-story">Biography</a>
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu Drawer */}
			<AnimatePresence>
				{useActive.isMobileMenuOpen && (
					<>
						<useActive.NavbarWrapper
							key="mobile-menu"
							initial="closed"
							animate={useActive.animateMobileMenu}
							exit="closed"
							variants={{
								closed: {
									x: "-100%",
									opacity: 0,
									transition: { type: "spring", duration: 0.6, bounce: 0 },
								},
								open: {
									x: 0,
									opacity: 1,
									transition: { type: "spring", duration: 0.4, bounce: 0 },
								},
							}}
							className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-white border-r border-warm-sand px-6 py-6 shadow-xl"
							aria-label="Mobile navigation"
						>
							{/* Mobile Logo */}
							<a
								href="/"
								className="mb-8 flex items-center"
								onClick={useActive.toggleMobileMenu}
							>
								<span className="font-serif font-bold text-xl text-deep-umber">
									MLN Museum
								</span>
							</a>

							{/* Mobile Navigation Links */}
							<ul className="flex flex-col gap-1 list-none m-0 p-0">
								<li>
									<a
										href="/"
										className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
										onClick={useActive.toggleMobileMenu}
									>
										Home
									</a>
								</li>
								{navLinks.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
											onClick={useActive.toggleMobileMenu}
										>
											{link.label}
										</a>
									</li>
								))}
								<li>
									<a
										href="/search"
										className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
										onClick={useActive.toggleMobileMenu}
									>
										Search
									</a>
								</li>
							</ul>
						</useActive.NavbarWrapper>

						{/* Mobile Overlay */}
						<motion.div
							key="mobile-overlay"
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2 }}
							className={useActive.getMobileOverlayClassNames}
							onClick={useActive.toggleMobileMenu}
						/>
					</>
				)}
			</AnimatePresence>
		</header>
	);
}
