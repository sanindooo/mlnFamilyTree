import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { Timeline } from "@/components/home/Timeline";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getTimelineEventsFromSanity } from "@/sanity/lib/fetch";
import { getFooterCTA } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
	title: "Virtual Museum of Martin Luther Nsibirwa",
	description:
		"Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.",
	path: "/",
});

export default async function Home() {
	const [events, footerCTA] = await Promise.all([
		getTimelineEventsFromSanity(),
		getFooterCTA(),
	]);

	return (
		<>
			<Hero />
			<Highlights />
			<Timeline events={events} />
			{footerCTA && <FooterCTA data={footerCTA} />}
		</>
	);
}
