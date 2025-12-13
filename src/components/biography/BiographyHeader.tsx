import React from "react";
import Image, { StaticImageData } from "next/image";
import {
	BiLinkAlt,
	BiLogoLinkedinSquare,
	BiLogoFacebookCircle,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { RevealText } from "@/components/ui/RevealText";
import { RevealImage } from "@/components/ui/RevealImage";
import { StaggerFade } from "@/components/ui/StaggerFade";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

interface BiographyHeaderProps {
	title: string;
	imageSrc: string | StaticImageData;
	category?: string;
}

export function BiographyHeader({
	title = "The roots that held them steady",
	imageSrc = "/placeholder-image.svg",
	category = "Origins",
}: BiographyHeaderProps) {
	return (
		<section className="relative pt-16 md:pt-24 lg:pt-28">
			<div className="container">
				<div className="grid gap-x-16 gap-y-12 md:grid-cols-[.75fr_1fr]">
					<div className="w-full self-center">
						<StaggerFade tag="div" delay={0.1}>
							{/* Breadcrumbs */}
							<div className="rb-5 mb-5 md:mb-6">
								<Breadcrumb className="flex w-full items-center font-semibold text-deep-umber">
									<BreadcrumbList>
										<BreadcrumbItem position={1}>
											<BreadcrumbLink href="/" className="hover:text-burgundy">
												Home
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem position={2}>
											<BreadcrumbLink
												href="/mln-story"
												className="hover:text-burgundy"
											>
												Biography
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem position={3}>
											<BreadcrumbLink
												href="#"
												isCurrentPage
												className="hover:text-burgundy"
											>
												MLN Biography
											</BreadcrumbLink>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>

							{/* Title - using RevealText inside StaggerFade is tricky, better to just let StaggerFade handle it or use RevealText separately?
								Actually, user wants UNIFIED animation.
								The simplest way is to treat the whole block as staggered children.
							*/}

							<div className="mb-5 md:mb-6">
								<RevealText
									tag="h1"
									className="text-4xl font-bold md:text-5xl lg:text-6xl font-serif text-deep-umber"
									delay={0.2}
								>
									{title}
								</RevealText>
							</div>

							<div className="flex size-full flex-col items-start justify-start">
								<div className="rb-4 mb-6 flex items-center md:mb-8">
									<div>
										<p className="font-semibold text-deep-umber">
											<span className="font-normal text-muted">Category</span>{" "}
											{category}
										</p>
									</div>
								</div>
								<aside className="w-full" aria-label="Share this biography">
									<p className="text-base font-semibold text-deep-umber">
										Share this biography
									</p>
									<ul className="rt-4 mt-3 flex items-center justify-start flex-wrap gap-2 md:mt-4 list-none m-0 p-0">
										<li>
											<button
												className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
												aria-label="Copy link"
											>
												<BiLinkAlt className="size-6 text-deep-umber" />
											</button>
										</li>
										<li>
											<button
												className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
												aria-label="Share on LinkedIn"
											>
												<BiLogoLinkedinSquare className="size-6 text-deep-umber" />
											</button>
										</li>
										<li>
											<button
												className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
												aria-label="Share on X"
											>
												<FaXTwitter className="size-6 p-0.5 text-deep-umber" />
											</button>
										</li>
										<li>
											<button
												className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
												aria-label="Share on Facebook"
											>
												<BiLogoFacebookCircle className="size-6 text-deep-umber" />
											</button>
										</li>
									</ul>
								</aside>
							</div>
						</StaggerFade>
					</div>
					<RevealImage delay={0.3}>
						<figure className="mx-auto w-full overflow-hidden rounded-xl border border-warm-sand shadow-lg relative aspect-square">
							<Image
								src={imageSrc}
								className="object-cover sepia-[.3]"
								alt={title}
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								priority
							/>
						</figure>
					</RevealImage>
				</div>
			</div>
		</section>
	);
}
