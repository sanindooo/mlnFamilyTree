import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { getGalleryImagesFromSanity } from "@/sanity/lib/fetch";

export const revalidate = 3600;

export default async function GalleryPage() {
	const galleryImages = await getGalleryImagesFromSanity();

	return (
		<>
			<PhotoGallery images={galleryImages} />
		</>
	);
}
