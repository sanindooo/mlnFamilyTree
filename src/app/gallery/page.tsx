import { PhotoGallery, GalleryImage } from "@/components/gallery/PhotoGallery";

export default function GalleryPage() {
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

	return (
		<>
			<PhotoGallery images={galleryImages} />
		</>
	);
}
