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

interface BiographyHeaderProps {
	title: string;
	subtitle?: string;
	imageSrc?: string | StaticImageData;
	category?: string;
}

export function BiographyHeader({
	title = "The roots that held them steady",
	imageSrc = "/placeholder-image.svg",
	category = "Origins",
}: BiographyHeaderProps) {
	return (
		<section id="bio-header" className="pt-12 md:pt-16 lg:pt-20">
			<div className="container">
				<div className="grid gap-x-20 gap-y-12 md:grid-cols-[.75fr_1fr]">
					<div className="mx-auto flex size-full max-w-lg flex-col items-start justify-start">
						<Breadcrumb className="mb-6 flex w-full items-center md:mb-8">
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/">Home</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink href="/mln-story">Biography</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink href="#">{category}</BreadcrumbLink>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<h1 className="mb-8 text-4xl font-bold md:mb-10 md:text-5xl lg:mb-12 lg:text-6xl font-serif text-deep-umber">
							{title}
						</h1>
						<div className="flex size-full flex-col items-start justify-start">
							<div className="rb-4 mb-6 flex items-center md:mb-8">
								<div>
									<h6 className="font-semibold text-deep-umber">
										<span className="font-normal text-muted">Category</span>{" "}
										{category}
									</h6>
								</div>
							</div>
							<div>
								<p className="text-base font-semibold text-deep-umber">
									Share this biography
								</p>
								<div className="rt-4 mt-3 grid grid-flow-col grid-cols-[max-content] items-start gap-2 md:mt-4">
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
					</div>
					<div className="mx-auto w-full overflow-hidden rounded-xl border border-warm-sand shadow-lg relative aspect-[3/2]">
						<Image
							src={imageSrc}
							className="object-cover sepia-[.3]"
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
