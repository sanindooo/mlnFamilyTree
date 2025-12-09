import { getBiography, getDocsIndex } from "@/lib/data";
import { MemberBiographyHeader } from "@/components/biography/MemberBiographyHeader";
import { BiographyContent } from "@/components/biography/BiographyContent";
import { SectionGallery } from "@/components/biography/SectionGallery";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import { urlForImage } from "@/sanity/lib/adapters";

export const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

export async function generateStaticParams() {
	const docs = await getDocsIndex();
	return docs.map((doc) => ({
		slug: doc.slug,
	}));
}

export default async function MemberPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const bio = await getBiography(slug);

	if (!bio) {
		notFound();
	}

	// Get photos for header if available in docs
	const docs = await getDocsIndex();
	const docEntry = docs.find((d) => d.slug === slug);
	const heroImage =
		docEntry?.photos?.[0] || bio.photo || "/placeholder-image.svg";

	// Process gallery images
	const galleryImages =
		bio.gallery
			?.map((img) => {
				if (!img || !img.asset) return null;
				return {
					src: urlForImage(img.asset).url(),
					alt: img.alt,
					caption: img.caption,
				};
			})
			.filter((img) => img !== null) || [];

	return (
		<>
			<MemberBiographyHeader
				title={bio.title}
				imageSrc={heroImage}
				category="Family Member"
			/>
			<BiographyContent
				content={bio.content}
				portableTextContent={bio.portableTextContent}
			/>

			{galleryImages.length > 0 && (
				<SectionGallery images={galleryImages} sectionTitle={bio.title} />
			)}

			{/* Link to view their position in the family tree */}
			<section className="bg-warm-sand/20 py-12 md:py-16 border-t border-warm-sand">
				<div className="container text-center">
					<h2 className="text-2xl font-serif font-bold text-deep-umber mb-4 md:text-3xl">
						Explore the Family Tree
					</h2>
					<p className="text-deep-umber mb-6 max-w-2xl mx-auto">
						See {bio.title.split(" ")[0]}'s position in the Nsibirwa family
						lineage and explore their connections
					</p>
					<Button variant="secondary" href="/tree">
						View Family Tree
					</Button>
				</div>
			</section>
		</>
	);
}
