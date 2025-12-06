import { BiographyHeader } from "@/components/biography/BiographyHeader";
import { BiographyContent } from "@/components/biography/BiographyContent";
import { SectionGallery } from "@/components/biography/SectionGallery";
import { SectionNavigation } from "@/components/biography/SectionNavigation";
import { RelatedStories } from "@/components/biography/RelatedStories";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

// Define the sections and their metadata
const sections = [
	{
		slug: "early-years",
		title: "Early years and family origins",
		description: "The formative experiences that built character and purpose",
		heroImage: "/gallery/Children of MLN.jpg",
		galleryImages: [
			"/gallery/Children of MLN.jpg",
			"/gallery/MLN Family in Mamakomo 80s.jpg",
			"/slideshow/Document from Paul Kiwana Nsibirwa.png",
			"/slideshow/Document from Paul Kiwana Nsibirwa (1).png",
		],
	},
	{
		slug: "professional-achievements",
		title: "Professional achievements and milestones",
		description: "Work that mattered, done with skill and dedication",
		heroImage: "/gallery/MLN Family in Mamakomo 80s.jpg",
		galleryImages: [
			"/slideshow/Document from Paul Kiwana Nsibirwa (2).png",
			"/gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg",
		],
	},
	{
		slug: "family-bonds",
		title: "Family bonds and lasting legacy",
		description: "Relationships that endured and shaped generations forward",
		heroImage:
			"/gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg",
		galleryImages: [
			"/gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg",
			"/gallery/Children of MLN.jpg",
		],
	},
];

interface SectionContent {
	slug: string;
	content: string[];
}

export async function generateStaticParams() {
	return sections.map((section) => ({
		section: section.slug,
	}));
}

async function getSectionContent(slug: string): Promise<string | null> {
	try {
		const filePath = path.join(
			process.cwd(),
			"public",
			"content",
			"mln-sections.json"
		);
		const fileContents = await fs.promises.readFile(filePath, "utf8");
		const allSections: SectionContent[] = JSON.parse(fileContents);

		const section = allSections.find((s) => s.slug === slug);
		if (!section) return null;

		// Convert array of paragraphs to HTML
		const htmlContent = section.content
			.map((paragraph) => `<p>${paragraph}</p>`)
			.join("\n");

		return htmlContent;
	} catch (err) {
		console.error(`Error loading section ${slug}:`, err);
		return null;
	}
}

export default async function BiographySectionPage({
	params,
}: {
	params: Promise<{ section: string }>;
}) {
	const { section: sectionSlug } = await params;

	const sectionIndex = sections.findIndex((s) => s.slug === sectionSlug);
	if (sectionIndex === -1) {
		notFound();
	}

	const section = sections[sectionIndex];
	const content = await getSectionContent(sectionSlug);

	if (!content) {
		notFound();
	}

	// Determine prev/next sections
	const prevSection =
		sectionIndex > 0
			? {
					title: sections[sectionIndex - 1].title,
					href: `/mln-story/${sections[sectionIndex - 1].slug}`,
			  }
			: undefined;

	const nextSection =
		sectionIndex < sections.length - 1
			? {
					title: sections[sectionIndex + 1].title,
					href: `/mln-story/${sections[sectionIndex + 1].slug}`,
			  }
			: undefined;

	return (
		<>
			<BiographyHeader
				title={section.title}
				imageSrc={section.heroImage}
				category="MLN Biography"
			/>
			<BiographyContent content={content} />
			<SectionGallery
				images={section.galleryImages}
				sectionTitle={section.title}
			/>
			<RelatedStories currentSlug={sectionSlug} />
			<SectionNavigation prevSection={prevSection} nextSection={nextSection} />
		</>
	);
}
