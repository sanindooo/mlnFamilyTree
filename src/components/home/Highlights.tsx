import { Button } from "@/components/ui/Button";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import { BiBuildings, BiGroup, BiBook } from "react-icons/bi";

export function Highlights() {
  return (
    <section
      id="highlights"
      className="py-12 md:py-16 lg:py-20 bg-white"
    >
      <div className="container">
				<div className="flex flex-col">
					<div className="rb-12 mb-12 md:mb-16 lg:mb-20">
						<div className="w-full max-w-lg">
							<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
								Legacy
							</p>
							<h2 className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber">
								Legacy Highlights
							</h2>
							<p className="text-lg text-deep-umber">
								Understand the achievements that defined a remarkable life and
								shaped history.
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
						<div className="flex w-full flex-col">
							<div className="mb-5 md:mb-6">
								<div className="size-12 flex items-center justify-center rounded-full bg-warm-sand/30 text-deep-umber">
									<BiBuildings className="size-6" />
								</div>
							</div>
							<h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl font-serif text-deep-umber">
								Political Pioneer
							</h3>
							<p className="text-deep-umber">
								Served on the Legislative Council, advocating for justice and
								progress in colonial Uganda.
							</p>
						</div>
						<div className="flex w-full flex-col">
							<div className="mb-5 md:mb-6">
								<div className="size-12 flex items-center justify-center rounded-full bg-warm-sand/30 text-deep-umber">
									<BiGroup className="size-6" />
								</div>
							</div>
							<h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl font-serif text-deep-umber">
								Family Foundation
							</h3>
							<p className="text-deep-umber">
								Built a strong family legacy that inspires generations with
								integrity, education, and service.
							</p>
						</div>
						<div className="flex w-full flex-col">
							<div className="mb-5 md:mb-6">
								<div className="size-12 flex items-center justify-center rounded-full bg-warm-sand/30 text-deep-umber">
									<BiBook className="size-6" />
								</div>
							</div>
							<h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl font-serif text-deep-umber">
								Educational Advocate
							</h3>
							<p className="text-deep-umber">
								Championed education and literacy as keys to empowerment and
								national development.
							</p>
						</div>
					</div>
					<div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
						<Button variant="secondary" asChild>
							<a href="/mln-story">Read Biography</a>
						</Button>
						<Button asChild variant="link" size="sm">
							<a href="/gallery" className="flex items-center">
								Explore Gallery <RxChevronRight className="ml-2" />
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
