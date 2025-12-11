import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { getGalleryImagesFromSanity } from "@/sanity/lib/fetch";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
	title: "Photo Gallery",
	description:
		"Browse historic photographs and images from the Nsibirwa family archives.",
	path: "/gallery",
});

export default async function GalleryPage() {
	const galleryImages = await getGalleryImagesFromSanity();

	return (
		<>
			<PhotoGallery images={galleryImages} />
		</>
	);
}
