"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { GalleryImage } from "@/types";
import { StaggerFade } from "@/components/ui/StaggerFade";
import { RevealText } from "@/components/ui/RevealText";

interface PhotoGalleryProps {
	images: GalleryImage[];
}

export function PhotoGallery({ images }: PhotoGalleryProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	// Memoize categories to prevent recalculation on every render
	const categories = useMemo(() => {
		const allTags = images.flatMap((img) => img.tags).filter(Boolean);
		return ["all", ...Array.from(new Set(allTags)).sort()];
	}, [images]);

	// Memoize filtered images
	const filteredImages = useMemo(() => {
		if (selectedCategory === "all") return images;
		return images.filter((img) => img.tags.includes(selectedCategory));
	}, [images, selectedCategory]);

	// Memoize slides for lightbox
	const slides = useMemo(
		() =>
			filteredImages.map((img) => ({
				src: img.src,
				alt: img.title,
				title: img.title,
				description: img.description,
			})),
		[filteredImages]
	);

	const handleImageClick = (idx: number) => {
		setIndex(idx);
		setOpen(true);
	};

	return (
		<section className="py-12 md:py-16 lg:py-20 bg-white">
			<div className="container">
			{/* Header */}
			<header className="mb-12 md:mb-16 text-center">
				<RevealText
					tag="p"
					className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm"
					yOffset={30}
					duration={1.2}
				>
					Archive
				</RevealText>
				<RevealText
					tag="h1"
					className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl font-serif text-deep-umber"
					delay={0.1}
					yOffset={30}
					duration={1.2}
				>
					Photo Gallery
				</RevealText>
				<RevealText
					tag="p"
					className="text-lg text-deep-umber max-w-2xl mx-auto"
					delay={0.2}
					yOffset={30}
					duration={1.2}
				>
					A visual journey through the life and times of the Nsibirwa family
				</RevealText>
			</header>

				{/* Category Filter */}
				<nav
					className="mb-8 md:mb-12 flex flex-wrap justify-center gap-3"
					aria-label="Gallery filters"
				>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setSelectedCategory(category)}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								selectedCategory === category
									? "bg-burgundy text-white"
									: "bg-warm-sand/20 text-deep-umber hover:bg-warm-sand/40"
							}`}
							aria-pressed={selectedCategory === category}
						>
							{category === "all" ? "All Photos" : category}
						</button>
					))}
				</nav>

				{/* Gallery Grid */}
				{/* We use key={selectedCategory} to trigger re-animation on filter change */}
				<ul
					className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0" 
				>
					{filteredImages.map((image, idx) => (
						<li key={idx} onClick={() => handleImageClick(idx)}>
							<figure className="group relative overflow-hidden rounded-xl border border-warm-sand shadow-lg cursor-pointer aspect-square m-0">
								<Image
									src={image.thumbnailSrc || image.src}
									alt={image.title}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
									className="object-cover sepia-[.3] transition-transform duration-300 group-hover:scale-110"
								/>
								<figcaption className="absolute inset-0 bg-gradient-to-t from-deep-umber/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="absolute bottom-0 left-0 right-0 p-4">
										<p className="text-cream text-sm font-semibold">
											{image.title}
										</p>
										{image.description && (
											<p className="text-cream/70 text-xs line-clamp-2">
												{image.description}
											</p>
										)}
									</div>
								</figcaption>
							</figure>
						</li>
					))}
				</ul>

				{filteredImages.length === 0 && (
					<p className="text-center text-muted py-12">
						No images found in this category.
					</p>
				)}

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
