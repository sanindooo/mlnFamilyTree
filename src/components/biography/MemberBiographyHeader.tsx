import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { RevealText } from "@/components/ui/RevealText";
import { RevealImage } from "@/components/ui/RevealImage";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { SocialShareButtons } from "@/components/shared/SocialShareButtons";

interface MemberBiographyHeaderProps {
	title: string;
	subtitle?: string;
	imageSrc?: string | StaticImageData;
	category?: string;
}

export function MemberBiographyHeader({
	title = "The roots that held them steady",
	imageSrc = "/placeholder-image.svg",
	category = "Origins",
}: MemberBiographyHeaderProps) {
	return (
		<section id="bio-header" className="pt-12 md:pt-16 lg:pt-20">
			<div className="container">
				<div className="grid gap-x-16 gap-y-12 md:grid-cols-[.75fr_1fr]">
					<div className="mx-auto flex size-full max-w-lg flex-col items-start justify-start">
						<StaggerFade tag="div" delay={0.1}>
							<div className="mb-6 md:mb-8">
								<Breadcrumb className="flex w-full items-center">
									<BreadcrumbList>
										<BreadcrumbItem position={1}>
											<BreadcrumbLink href="/">Home</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem position={2}>
											<BreadcrumbLink href="/tree">Family Tree</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem position={3}>
											<BreadcrumbLink href="#" isCurrentPage>
												{category}
											</BreadcrumbLink>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>

							<div className="mb-8 md:mb-10 lg:mb-12">
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
									<div className="rt-4 mt-3 md:mt-4">
										<SocialShareButtons />
									</div>
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
