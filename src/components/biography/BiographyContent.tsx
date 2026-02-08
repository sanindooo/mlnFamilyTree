import React from "react";
import { PortableTextRenderer } from "@/sanity/components/PortableTextRenderer";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { SocialShareButtons } from "@/components/shared/SocialShareButtons";

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
							<div className="mb-8 mt-3 sm:mb-0 md:mt-4 flex justify-center">
								<SocialShareButtons variant="compact" />
							</div>
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
