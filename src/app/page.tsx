import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { Timeline } from "@/components/home/Timeline";
import { EventCTA } from "@/components/home/EventCTA";
import { getTimelineEventsFromSanity } from "@/sanity/lib/fetch";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
	title: "Virtual Museum of Martin Luther Nsibirwa",
	description:
		"Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.",
	path: "/",
});

export default async function Home() {
	const events = await getTimelineEventsFromSanity();

	return (
		<>
			<Hero />
			<Highlights />
			<Timeline events={events} />
			<EventCTA />
		</>
	);
}
