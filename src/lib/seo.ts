import { Metadata } from "next";

export const siteConfig = {
	name: "Virtual Museum of Martin Luther Nsibirwa",
	description:
		"Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.",
	url: "https://www.martinluthernsibirwa.com",
	ogImage: "/og/default.png",
};

export function buildMetadata(page: {
	title: string;
	description: string;
	image?: string;
	path?: string;
}): Metadata {
	const imageUrl = page.image?.startsWith("http")
		? page.image
		: `${siteConfig.url}${page.image || siteConfig.ogImage}`;

	return {
		title: page.title,
		description: page.description,
		openGraph: {
			title: page.title,
			description: page.description,
			url: `${siteConfig.url}${page.path || ""}`,
			siteName: siteConfig.name,
			images: [{ url: imageUrl, width: 1200, height: 630 }],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: page.title,
			description: page.description,
			images: [imageUrl],
		},
	};
}

// Helper to extract first sentence for descriptions
export function extractFirstSentence(html: string): string {
	const text = html.replace(/<[^>]*>/g, "").trim();
	const match = text.match(/^[^.!?]*[.!?]/);
	return match ? match[0].trim() : text.slice(0, 160) + "...";
}
