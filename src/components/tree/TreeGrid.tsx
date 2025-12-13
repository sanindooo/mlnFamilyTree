import React from "react";
import Image from "next/image";
import { BiLogoLinkedinSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { Grandchild } from "@/types";

interface TreeGridProps {
	grandchildren: Grandchild[];
}

export function TreeGrid({ grandchildren }: TreeGridProps) {
	if (grandchildren.length === 0) {
		return null;
	}

	return (
		<section id="tree-grid" className="py-12 md:py-16 lg:py-20 bg-white">
			<div className="container">
				<div className="mb-12 max-w-lg md:mb-16 lg:mb-20">
					<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
						Generations
					</p>
					<h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber">
						Watch the family unfold across time
					</h2>
					<p className="text-lg text-deep-umber">
						Some members of the 3rd generation of the Nsibirwa family.
					</p>
				</div>

				<ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4 list-none m-0 p-0">
					{grandchildren.map((grandchild) => (
						<li
							key={grandchild.id}
							className="flex flex-col items-start p-4 border border-warm-sand rounded-xl"
						>
							{grandchild.photo && (
								<div className="mb-5 md:mb-6">
									<Image
										src={grandchild.photo}
										alt={grandchild.name}
										width={80}
										height={80}
										className="size-20 rounded-full object-cover border-2 border-warm-sand sepia-[.3]"
									/>
								</div>
							)}
							<div className="mb-3 md:mb-4">
								<h3 className="text-lg font-bold md:text-xl text-deep-umber font-serif">
									{grandchild.name}
								</h3>
							</div>
							{grandchild.description && (
								<p className="text-deep-umber text-sm">
									{grandchild.description}
								</p>
							)}
							{(grandchild.linkedinUrl || grandchild.twitterUrl) && (
								<div className="mt-6 flex gap-3.5">
									{grandchild.linkedinUrl && (
										<a
											href={grandchild.linkedinUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-deep-umber hover:text-burgundy"
										>
											<BiLogoLinkedinSquare className="size-6" />
										</a>
									)}
									{grandchild.twitterUrl && (
										<a
											href={grandchild.twitterUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-deep-umber hover:text-burgundy"
										>
											<FaXTwitter className="size-6 p-0.5" />
										</a>
									)}
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
