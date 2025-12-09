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
				<div className="grid gap-x-20 gap-y-12 md:grid-cols-[.75fr_1fr]">
					<div className="w-full self-center">
						<div className="rb-5 mb-5 md:mb-6">
							<nav className="flex items-center">
								<p className="flex items-center text-sm font-semibold text-deep-umber">
									<a href="/" className="hover:text-burgundy">
										Home
									</a>
									<span className="mx-2">
										<svg
											stroke="currentColor"
											fill="none"
											strokeWidth="0"
											viewBox="0 0 15 15"
											className="h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
												fill="currentColor"
											></path>
										</svg>
									</span>
									<a href="/mln-story" className="hover:text-burgundy">
										Biography
									</a>
									<span className="mx-2">
										<svg
											stroke="currentColor"
											fill="none"
											strokeWidth="0"
											viewBox="0 0 15 15"
											className="h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
												fill="currentColor"
											></path>
										</svg>
									</span>
									MLN Biography
								</p>
							</nav>
						</div>
						<RevealText
							tag="h1"
							className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl font-serif text-deep-umber"
						>
							{title}
						</RevealText>
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
								<StaggerFade className="rt-4 mt-3 grid grid-flow-col grid-cols-[max-content] items-start gap-2 md:mt-4" delay={0.4}>
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
								</StaggerFade>
							</div>
						</div>
					</div>
					<RevealImage delay={0.2}>
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
					</RevealImage>
				</div>
			</div>
		</section>
	);
}
