import { Button } from "@/components/ui/Button";
import React from "react";
import { RxChevronRight } from "react-icons/rx";
import { BiBuildings, BiGroup, BiBook } from "react-icons/bi";
import { RevealText } from "@/components/ui/RevealText";

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
							<RevealText
								tag="h2"
								className="mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif text-deep-umber"
							>
								Legacy Highlights
							</RevealText>
							<RevealText tag="p" className="text-lg text-deep-umber" delay={0.2}>
								Understand the achievements that defined a remarkable life and
								shaped history.
							</RevealText>
						</div>
					</div>
					<div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
						<div className="flex w-full flex-col">
							<div className="mb-5 md:mb-6">
								<div className="size-12 flex items-center justify-center rounded-full bg-warm-sand/30 text-deep-umber">
									<BiBuildings className="size-6" />
								</div>
							</div>
							<RevealText
								tag="h3"
								className="mb-3 text-xl font-bold md:mb-4 md:text-2xl font-serif text-deep-umber"
								delay={0.1}
							>
								Political Pioneer
							</RevealText>
							<RevealText tag="p" className="text-deep-umber" delay={0.3}>
								Served on the Legislative Council, advocating for justice and
								progress in colonial Uganda.
							</RevealText>
						</div>
						<div className="flex w-full flex-col">
							<div className="mb-5 md:mb-6">
								<div className="size-12 flex items-center justify-center rounded-full bg-warm-sand/30 text-deep-umber">
									<BiGroup className="size-6" />
								</div>
							</div>
							<RevealText
								tag="h3"
								className="mb-3 text-xl font-bold md:mb-4 md:text-2xl font-serif text-deep-umber"
								delay={0.2}
							>
								Family Foundation
							</RevealText>
							<RevealText tag="p" className="text-deep-umber" delay={0.4}>
								Built a strong family legacy that inspires generations with
								integrity, education, and service.
							</RevealText>
						</div>
						<div className="flex w-full flex-col">
							<div className="mb-5 md:mb-6">
								<div className="size-12 flex items-center justify-center rounded-full bg-warm-sand/30 text-deep-umber">
									<BiBook className="size-6" />
								</div>
							</div>
							<RevealText
								tag="h3"
								className="mb-3 text-xl font-bold md:mb-4 md:text-2xl font-serif text-deep-umber"
								delay={0.3}
							>
								Educational Advocate
							</RevealText>
							<RevealText tag="p" className="text-deep-umber" delay={0.5}>
								Championed education and literacy as keys to empowerment and
								national development.
							</RevealText>
						</div>
					</div>
					<div className="mt-10 flex items-center justify-start gap-4 md:mt-14 lg:mt-16">
						<Button variant="secondary" href="/mln-story">
							Explore Full Legacy <RxChevronRight className="size-5" />
						</Button>
					</div>
				</div>
      </div>
    </section>
  );
}
