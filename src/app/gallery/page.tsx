import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { getGalleryImagesFromSanity } from "@/sanity/lib/fetch";

export default async function GalleryPage() {
	const galleryImages = await getGalleryImagesFromSanity();

	return (
		<>
			<PhotoGallery images={galleryImages} />
		</>
	);
}
