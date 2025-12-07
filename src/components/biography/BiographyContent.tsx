import React from "react";
import {
	BiLinkAlt,
	BiLogoFacebookCircle,
	BiLogoLinkedinSquare,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { PortableTextBlock } from "@portabletext/types";
import { PortableTextRenderer } from "@/sanity/components/PortableTextRenderer";

interface BiographyContentProps {
	content?: string; // Legacy HTML content
	portableTextContent?: PortableTextBlock[]; // New Sanity Portable Text content
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

					<div>
						<div className="mb-8 text-center md:mb-10 lg:mb-12">
							<p className="font-semibold md:text-md text-deep-umber">
								Share this
							</p>
							<div className="mb-8 mt-3 flex items-start justify-center gap-2 sm:mb-0 md:mt-4">
								<button className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
									<BiLinkAlt className="size-6 text-deep-umber" />
								</button>
								<button className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
									<BiLogoLinkedinSquare className="size-6 text-deep-umber" />
								</button>
								<button className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
									<FaXTwitter className="size-6 p-0.5 text-deep-umber" />
								</button>
								<button className="size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors">
									<BiLogoFacebookCircle className="size-6 text-deep-umber" />
								</button>
							</div>
						</div>
						<div>
							<ul className="flex flex-wrap justify-center gap-2">
								{["Family history", "Personal legacy", "Life story"].map(
									(tag, index) => (
										<li className="flex" key={index}>
											<span className="bg-warm-sand/20 px-2 py-1 text-sm font-semibold text-deep-umber rounded">
												{tag}
											</span>
										</li>
									)
								)}
							</ul>
						</div>
					</div>
					<div className="my-8 h-px bg-warm-sand md:my-10 lg:my-12" />
				</div>
			</div>
		</section>
	);
}
