import React from "react";
import {
	BiLinkAlt,
	BiLogoLinkedinSquare,
	BiLogoFacebookCircle,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { PortableTextRenderer } from "@/sanity/components/PortableTextRenderer";
import { StaggerFade } from "@/components/ui/StaggerFade";

interface BiographyContentProps {
	content?: string; // Legacy HTML content
	portableTextContent?: any[]; // New Sanity Portable Text content
	children?: React.ReactNode;
}

export function BiographyContent({
	content,
	portableTextContent,
	children,
}: BiographyContentProps) {
	return (
		<section id="bio-content" className="py-16 md:py-24 lg:py-28">
			<div className="container">
				<div className="mx-auto max-w-lg xl:max-w-2xl">
					<div className="prose mb-12 md:prose-md lg:prose-lg md:mb-16 lg:mb-20 text-deep-umber prose-headings:font-serif prose-headings:text-deep-umber prose-a:text-burgundy prose-img:rounded-xl prose-img:sepia-[.4]">
						{children}
						{portableTextContent && portableTextContent.length > 0 && (
							<PortableTextRenderer value={portableTextContent} />
						)}
						{(!portableTextContent || portableTextContent.length === 0) &&
							content && <div dangerouslySetInnerHTML={{ __html: content }} />}
					</div>

					<StaggerFade
						tag="aside"
						triggerStart="top 90%"
						aria-label="Share and related topics"
					>
						<div className="mb-8 text-center md:mb-10 lg:mb-12">
							<p className="font-semibold md:text-md text-deep-umber">
								Share this
							</p>
							<ul className="mb-8 mt-3 flex items-start justify-center gap-2 sm:mb-0 md:mt-4 list-none m-0 p-0">
								<li>
									<button
										className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
										aria-label="Copy link"
									>
										<BiLinkAlt className="size-6 text-deep-umber" />
									</button>
								</li>
								<li>
									<button
										className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
										aria-label="Share on LinkedIn"
									>
										<BiLogoLinkedinSquare className="size-6 text-deep-umber" />
									</button>
								</li>
								<li>
									<button
										className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
										aria-label="Share on X"
									>
										<FaXTwitter className="size-6 p-0.5 text-deep-umber" />
									</button>
								</li>
								<li>
									<button
										className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
										aria-label="Share on Facebook"
									>
										<BiLogoFacebookCircle className="size-6 text-deep-umber" />
									</button>
								</li>
							</ul>
						</div>
						<nav aria-label="Related topics">
							<ul className="flex flex-wrap justify-center gap-2">
								<li className="flex items-center">
									<a
										href="#"
										className="flex items-center gap-2 rounded-lg bg-warm-sand/20 px-4 py-2 text-sm font-medium text-deep-umber hover:bg-warm-sand/40 transition-colors"
									>
										Family history
									</a>
								</li>
								<li className="flex items-center">
									<a
										href="#"
										className="flex items-center gap-2 rounded-lg bg-warm-sand/20 px-4 py-2 text-sm font-medium text-deep-umber hover:bg-warm-sand/40 transition-colors"
									>
										Personal legacy
									</a>
								</li>
								<li className="flex items-center">
									<a
										href="#"
										className="flex items-center gap-2 rounded-lg bg-warm-sand/20 px-4 py-2 text-sm font-medium text-deep-umber hover:bg-warm-sand/40 transition-colors"
									>
										Life story
									</a>
								</li>
							</ul>
						</nav>
					</StaggerFade>
				</div>
			</div>
		</section>
	);
}
