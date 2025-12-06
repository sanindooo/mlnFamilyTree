import { Button } from "@/components/ui/Button";
import React from "react";

export function EventCTA() {
  return (
    <section
      id="cta"
      className="py-12 md:py-16 lg:py-20 bg-deep-umber text-cream"
    >
      <div className="container relative">
				<div className="relative z-10 flex flex-col items-center p-8 md:p-12 lg:p-16">
					<div className="max-w-lg text-center">
						<h2 className="rb-5 mb-5 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl font-serif">
							Join us this December
						</h2>
						<p className="text-lg">
							Mark your calendar for December 27th and be part of something
							meaningful as we celebrate this remarkable life.
						</p>
					</div>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
						<Button
							title="Register"
							className="bg-cream text-deep-umber border-cream hover:bg-cream/90"
						>
							Register
						</Button>
						<Button
							title="Details"
							variant="secondary"
							className="border-cream text-cream hover:bg-cream/10 hover:text-cream"
						>
							Details
						</Button>
					</div>
				</div>
				<div className="absolute inset-0 z-0">
					<img
						src="/gallery/Children of MLN.jpg"
						className="size-full object-cover opacity-30 sepia-[.5]"
						alt="Family gathering"
					/>
					<div className="absolute inset-0 bg-deep-umber/80 mix-blend-multiply" />
				</div>
			</div>
		</section>
	);
}
