"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { RevealText } from "@/components/ui/RevealText";

export interface GalleryImage {
	src: string;
	alt?: string;
	caption?: string;
	title?: string;
}

interface SectionGalleryProps {
	images?: (string | GalleryImage)[];
	sectionTitle: string;
}

export function SectionGallery({ images, sectionTitle }: SectionGalleryProps) {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	if (!images || images.length === 0) return null;

	// Normalize images to GalleryImage objects
	const galleryImages = images.map((img) => {
		if (typeof img === "string") {
			return { src: img, alt: sectionTitle };
		}
		return img;
	});

	const slides = galleryImages.map((img) => ({
		src: img.src,
		alt: img.alt || sectionTitle,
		title: img.title || img.alt,
		description: img.caption,
	}));

	const handleImageClick = (idx: number) => {
		setIndex(idx);
		setOpen(true);
	};

	return (
		<section className="py-12 md:py-16 bg-cream/20">
			<div className="container">
			<header className="mb-8 md:mb-12">
				<RevealText
					tag="h3"
					className="text-2xl font-bold md:text-3xl font-serif text-deep-umber text-center"
				>
					Gallery
				</RevealText>
				<RevealText
					tag="p"
					className="text-center text-muted mt-2"
					delay={0.2}
				>
					Images from this period
				</RevealText>
			</header>
				<StaggerFade
					tag="ul"
					className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0"
					stagger={0.1}
				>
					{galleryImages.map((image, idx) => (
						<li key={idx} onClick={() => handleImageClick(idx)}>
							<figure className="relative h-48 w-full overflow-hidden rounded-xl border border-warm-sand shadow-lg group cursor-pointer m-0">
								<Image
									src={image.src}
									alt={image.alt || `${sectionTitle} - Image ${idx + 1}`}
									className="object-cover sepia-[.3] transition-transform duration-300 group-hover:scale-105"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</figure>
						</li>
					))}
				</StaggerFade>

				<Lightbox
					open={open}
					close={() => setOpen(false)}
					index={index}
					slides={slides}
					plugins={[Captions]}
					captions={{ showToggle: true, descriptionTextAlign: "center" }}
				/>
			</div>
		</section>
	);
}
