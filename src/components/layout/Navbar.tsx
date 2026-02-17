"use client";

import { Button } from "@/components/ui/Button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { UserMenu } from "./UserMenu";

const navLinks = [
	{ href: "/tree", label: "Family Tree" },
	{ href: "/gallery", label: "Gallery" },
];

// Biography dropdown items (sub-sections only, main link is in the button)
const biographySections = [
	{ href: "/mln-story", label: "Overview" },
	{ href: "/mln-story/early-years", label: "Early years and family origins" },
	{
		href: "/mln-story/professional-achievements",
		label: "Professional achievements",
	},
	{ href: "/mln-story/family-bonds", label: "Family bonds and legacy" },
];

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 991px)");
	const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
	const { user } = useUser();
	const isAdmin = (user?.publicMetadata as { role?: string })?.role === "admin";
	const [pendingCount, setPendingCount] = useState(0);
	const [isBiographyOpen, setIsBiographyOpen] = useState(false);

	// Fetch pending waitlist count for admins
	useEffect(() => {
		if (!isAdmin) return;
		fetch("/api/admin/waitlist/count")
			.then((res) => (res.ok ? res.json() : null))
			.then((data: { count: number } | null) => {
				if (data) setPendingCount(data.count);
			})
			.catch(() => {});
	}, [isAdmin]);
	const dropdownRef = useRef<HTMLLIElement>(null);
	const mobileMenuRef = useRef<HTMLElement>(null);
	const mobileOverlayRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsBiographyOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// GSAP Animation for Mobile Menu
	useGSAP(
		() => {
			if (!isMobile) return;

			const menu = mobileMenuRef.current;
			const overlay = mobileOverlayRef.current;

			if (isMobileMenuOpen) {
				gsap.to(menu, { x: "0%", duration: 0.5, ease: "power3.out" });
				gsap.to(overlay, { autoAlpha: 1, duration: 0.3 });
			} else {
				gsap.to(menu, { x: "-100%", duration: 0.5, ease: "power3.in" });
				gsap.to(overlay, { autoAlpha: 0, duration: 0.3 });
			}
		},
		{ dependencies: [isMobileMenuOpen, isMobile] }
	);

	// Initial set up for mobile menu
	useGSAP(
		() => {
			if (isMobile && mobileMenuRef.current && mobileOverlayRef.current) {
				gsap.set(mobileMenuRef.current, { x: "-100%" });
				gsap.set(mobileOverlayRef.current, { autoAlpha: 0 });
			}
		},
		{ dependencies: [isMobile] }
	);

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
							{/* Biography Dropdown */}
							<li className="relative group" ref={dropdownRef}>
								<button
									className="flex items-center gap-0.5 text-base font-medium text-deep-umber hover:text-burgundy transition-colors cursor-pointer"
									onClick={() => setIsBiographyOpen(!isBiographyOpen)}
									aria-expanded={isBiographyOpen}
									aria-haspopup="true"
								>
									Biography
									<BiChevronDown
										className={`size-4 transition-transform ${
											isBiographyOpen ? "rotate-180" : ""
										}`}
									/>
								</button>

								{/* Dropdown Menu */}
								<div
									className={`absolute top-full left-0 mt-2 w-64 bg-white border border-warm-sand rounded-lg shadow-lg opacity-0 invisible transition-all duration-200 ${
										isBiographyOpen ? "opacity-100 visible" : ""
									}`}
								>
									<ul className="py-2 list-none m-0 p-0">
										{biographySections.map((section) => (
											<li key={section.href}>
												<Link
													href={section.href}
													className="block px-4 py-2.5 text-sm font-medium text-deep-umber hover:bg-warm-sand/20 hover:text-burgundy transition-colors"
													onClick={() => setIsBiographyOpen(false)}
												>
													{section.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							</li>

							{/* Other Nav Links */}
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-base font-medium text-deep-umber hover:text-burgundy transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Mobile Menu Button (Left on mobile) */}
					<button
						className="flex size-10 flex-col items-center justify-center gap-1 lg:hidden"
						onClick={toggleMobileMenu}
						aria-label="Toggle mobile menu"
						aria-expanded={isMobileMenuOpen}
					>
						<span className="h-0.5 w-6 bg-deep-umber transition-all" />
						<span className="h-0.5 w-6 bg-deep-umber transition-all" />
						<span className="h-0.5 w-6 bg-deep-umber transition-all" />
					</button>

					{/* Center: Logo */}
					<Link
						href="/"
						className="absolute left-1/2 -translate-x-1/2 flex items-center"
					>
						<span className="font-serif font-bold text-xl md:text-2xl text-deep-umber whitespace-nowrap">
							MLN Museum
						</span>
					</Link>

					{/* Right: Auth + CTA */}
					<div className="flex items-center gap-4">
						<SignedIn>
							<Link
								href="/members"
								className="text-base font-medium text-deep-umber hover:text-burgundy transition-colors hidden sm:block"
							>
								Members
							</Link>
							{isAdmin && (
								<Link
									href="/admin/waitlist"
									className={`relative text-base font-medium text-deep-umber hover:text-burgundy transition-colors hidden sm:block ${pendingCount > 0 ? "mr-5" : ""}`}
								>
									Waitlist
									{pendingCount > 0 && (
										<span className="absolute -top-2 -right-5 flex size-5 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white">
											{pendingCount}
										</span>
									)}
								</Link>
							)}
						</SignedIn>
						<SignedOut>
							<Link
								href="/sign-in"
								className="text-base font-medium text-deep-umber hover:text-burgundy transition-colors hidden sm:block"
							>
								Sign In
							</Link>
						</SignedOut>
						<Button
							href="/mln-story"
							size="sm"
							className="bg-antique-gold border-antique-gold hover:bg-antique-gold/90"
						>
							Biography
						</Button>
						<SignedIn>
							<UserMenu />
						</SignedIn>
					</div>
				</div>
			</div>

			{/* Mobile Menu Drawer - Always rendered if mobile (controlled by GSAP) */}
			{isMobile && (
				<>
					<nav
						ref={mobileMenuRef}
						className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-white border-r border-warm-sand px-6 py-6 shadow-xl transform -translate-x-full"
						aria-label="Mobile navigation"
					>
						{/* Mobile Logo */}
						<Link
							href="/"
							className="mb-8 flex items-center"
							onClick={toggleMobileMenu}
						>
							<span className="font-serif font-bold text-xl text-deep-umber">
								MLN Museum
							</span>
						</Link>

						{/* Mobile Navigation Links */}
						<ul className="flex flex-col gap-1 list-none m-0 p-0">
							<li>
								<Link
									href="/"
									className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
									onClick={toggleMobileMenu}
								>
									Home
								</Link>
							</li>

							{/* Biography Submenu */}
							<li>
								<Link
									href="/mln-story"
									className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
									onClick={toggleMobileMenu}
								>
									Biography
								</Link>
								<ul className="ml-4 flex flex-col gap-1 list-none mt-1">
									{biographySections
										.filter((s) => s.href !== "/mln-story")
										.map((section) => (
											<li key={section.href}>
												<Link
													href={section.href}
													className="block text-sm font-medium text-deep-umber hover:text-burgundy py-2 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
													onClick={toggleMobileMenu}
												>
													{section.label}
												</Link>
											</li>
										))}
								</ul>
							</li>

							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
										onClick={toggleMobileMenu}
									>
										{link.label}
									</Link>
								</li>
							))}

							<li>
								<Link
									href="/search"
									className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
									onClick={toggleMobileMenu}
								>
									Search
								</Link>
							</li>

							{/* Auth controls */}
							<li className="mt-4 pt-4 border-t border-warm-sand">
								<SignedIn>
									<Link
										href="/members/dashboard"
										className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
										onClick={toggleMobileMenu}
									>
										Dashboard
									</Link>
									<Link
										href="/members"
										className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
										onClick={toggleMobileMenu}
									>
										Members Directory
									</Link>
									{isAdmin && (
										<Link
											href="/admin/waitlist"
											className="flex items-center gap-2 text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
											onClick={toggleMobileMenu}
										>
											Waitlist
											{pendingCount > 0 && (
												<span className="flex size-5 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white">
													{pendingCount}
												</span>
											)}
										</Link>
									)}
								</SignedIn>
								<SignedOut>
									<Link
										href="/sign-in"
										className="block text-base font-medium text-deep-umber hover:text-burgundy py-3 px-2 rounded-lg hover:bg-warm-sand/10 transition-colors"
										onClick={toggleMobileMenu}
									>
										Sign In
									</Link>
								</SignedOut>
							</li>
						</ul>
					</nav>

					{/* Mobile Overlay */}
					<div
						ref={mobileOverlayRef}
						className="fixed inset-0 z-40 bg-black/50 lg:hidden opacity-0 invisible"
						onClick={toggleMobileMenu}
						aria-hidden="true"
					/>
				</>
			)}
		</header>
	);
}
