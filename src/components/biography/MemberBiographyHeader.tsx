import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import React from "react";
import Image, { StaticImageData } from "next/image";
import {
	BiLinkAlt,
	BiLogoFacebookCircle,
	BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { RevealText } from "@/components/ui/RevealText";
import { RevealImage } from "@/components/ui/RevealImage";
import { StaggerFade } from "@/components/ui/StaggerFade";

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
										<BreadcrumbItem>
											<BreadcrumbLink href="/">Home</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbLink href="/tree">Family Tree</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbLink href="#">{category}</BreadcrumbLink>
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
										<h6 className="font-semibold text-deep-umber">
											<span className="font-normal text-muted">Category</span>{" "}
											{category}
										</h6>
									</div>
								</div>
								<div className="w-full">
									<p className="text-base font-semibold text-deep-umber">
										Share this biography
									</p>
									<div className="rt-4 mt-3 flex items-center justify-start flex-wrap gap-2 md:mt-4">
										<button className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
											<BiLinkAlt className="size-6 text-deep-umber" />
										</button>
										<button className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
											<BiLogoLinkedinSquare className="size-6 text-deep-umber" />
										</button>
										<button className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
											<FaXTwitter className="size-6 p-0.5 text-deep-umber" />
										</button>
										<button className="rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
											<BiLogoFacebookCircle className="size-6 text-deep-umber" />
										</button>
									</div>
								</div>
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
