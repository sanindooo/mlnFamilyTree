"use client";

import React from "react";
import { BiLogoLinkedinSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export function TreeGrid() {
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
						The legacy continues to grow.
					</p>
				</div>

				{/* Static Grid Placeholder - Will be replaced by dynamic tree component */}
				<ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4 list-none m-0 p-0">
					{[1, 2, 3, 4].map((i) => (
						<li
							key={i}
							className="flex flex-col items-start p-4 border border-warm-sand rounded-xl"
						>
							<div className="mb-5 md:mb-6">
								<img
									src={`/members/children/Bulyaba.jpg`}
									alt="Family member"
									className="size-20 min-h-20 min-w-20 rounded-full object-cover border-2 border-warm-sand sepia-[.3]"
								/>
							</div>
							<div className="mb-3 md:mb-4">
								<h5 className="text-lg font-bold md:text-xl text-deep-umber font-serif">
									Family Member {i}
								</h5>
								<h6 className="text-base text-muted">Generation {i}</h6>
							</div>
							<p className="text-deep-umber text-sm">
								Carried forward what their parent began and added their own
								mark.
							</p>
							<div className="mt-6 flex gap-3.5">
								<a href="#" className="text-deep-umber hover:text-burgundy">
									<BiLogoLinkedinSquare className="size-6" />
								</a>
								<a href="#" className="text-deep-umber hover:text-burgundy">
									<FaXTwitter className="size-6 p-0.5" />
								</a>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
