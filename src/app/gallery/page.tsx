import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { getGalleryImagesFromSanity } from "@/sanity/lib/fetch";

export const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

export default async function GalleryPage() {
	const galleryImages = await getGalleryImagesFromSanity();

	return (
		<>
			<PhotoGallery images={galleryImages} />
		</>
	);
}
