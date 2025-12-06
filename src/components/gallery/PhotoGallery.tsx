"use client";

import React, { useState } from "react";

interface GalleryImage {
	src: string;
	title: string;
	category: string;
}

export function PhotoGallery() {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const galleryImages: GalleryImage[] = [
		// Main Gallery
		{
			src: "/gallery/Children of MLN.jpg",
			title: "Children of MLN",
			category: "Family",
		},
		{
			src: "/gallery/MLN Family in Mamakomo 80s.jpg",
			title: "MLN Family in Mamakomo 80s",
			category: "Family",
		},
		{
			src: "/gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg",
			title: "MLN Family Reunion 2003",
			category: "Family",
		},

		// Documents
		{
			src: "/slideshow/Document from Paul Kiwana Nsibirwa.png",
			title: "Historical Document 1",
			category: "Documents",
		},
		{
			src: "/slideshow/Document from Paul Kiwana Nsibirwa (1).png",
			title: "Historical Document 2",
			category: "Documents",
		},
		{
			src: "/slideshow/Document from Paul Kiwana Nsibirwa (2).png",
			title: "Historical Document 3",
			category: "Documents",
		},

		// Rhoda Kalema
		{
			src: "/members/rhoda-kalema/Her 96th Birthday 10 May 2025, Kisugu Church.jpg",
			title: "Rhoda Kalema - 96th Birthday",
			category: "Family Members",
		},
		{
			src: "/members/rhoda-kalema/With daughters Sarah, Maria and Gladys.jpg",
			title: "Rhoda with daughters",
			category: "Family Members",
		},
		{
			src: "/members/rhoda-kalema/Hon Rhoda Kalema Signing The constitution.JPG",
			title: "Signing the Constitution",
			category: "Family Members",
		},
		{
			src: "/members/rhoda-kalema/When she became Canon in 2025.jpg",
			title: "Canon Rhoda Kalema",
			category: "Family Members",
		},

		// Janet Mdoe
		{
			src: "/members/janet-mdoe/Her Younger yers.jpg",
			title: "Janet Mdoe - Younger Years",
			category: "Family Members",
		},
		{
			src: "/members/janet-mdoe/Receiving an Award from Fountain Publishers -40 years as an author.jpg",
			title: "Janet Mdoe - Author Award",
			category: "Family Members",
		},
		{
			src: "/members/janet-mdoe/With Rhoda Kalema and Eseza Kironde at her 80th Birthday Party.jpg",
			title: "Janet's 80th Birthday",
			category: "Family Members",
		},

		// Semu Ntulume
		{
			src: "/members/semu-ntulume/Semu Ntulume.jpg",
			title: "Dr. Semu Ntulume",
			category: "Family Members",
		},
		{
			src: "/members/semu-ntulume/Semu & Edisa_s Wedding - Studio.jpeg",
			title: "Semu & Edisa's Wedding",
			category: "Family Members",
		},
		{
			src: "/members/semu-ntulume/Gynaecologists at Mulago circa 1972.jpg",
			title: "Gynaecologists at Mulago",
			category: "Family Members",
		},
	];

	const categories = ["all", "Family", "Documents", "Family Members"];

	const filteredImages =
		selectedCategory === "all"
			? galleryImages
			: galleryImages.filter((img) => img.category === selectedCategory);

	return (
		<section className="py-12 md:py-16 lg:py-20 bg-white">
			<div className="container">
				{/* Header */}
				<header className="mb-12 md:mb-16 text-center">
					<p className="mb-3 font-semibold md:mb-4 text-antique-gold uppercase tracking-wider text-sm">
						Archive
					</p>
					<h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl font-serif text-deep-umber">
						Photo Gallery
					</h1>
					<p className="text-lg text-deep-umber max-w-2xl mx-auto">
						A visual journey through the life and times of the Nsibirwa family
					</p>
				</header>

				{/* Category Filter */}
				<nav className="mb-8 md:mb-12 flex flex-wrap justify-center gap-3" aria-label="Gallery filters">
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
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0">
					{filteredImages.map((image, index) => (
						<li key={index}>
							<figure className="group relative overflow-hidden rounded-xl border border-warm-sand shadow-lg cursor-pointer aspect-square m-0">
								<img
									src={image.src}
									alt={image.title}
									className="w-full h-full object-cover sepia-[.3] transition-transform duration-300 group-hover:scale-110"
								/>
								<figcaption className="absolute inset-0 bg-gradient-to-t from-deep-umber/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="absolute bottom-0 left-0 right-0 p-4">
										<p className="text-cream text-sm font-semibold">
											{image.title}
										</p>
										<p className="text-cream/70 text-xs">{image.category}</p>
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
			</div>
		</section>
	);
}
