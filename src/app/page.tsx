import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { Timeline } from "@/components/home/Timeline";
import { EventCTA } from "@/components/home/EventCTA";
import { getTimelineEventsFromSanity } from "@/sanity/lib/fetch";

export const revalidate = process.env.USE_CACHE === "true" ? 3600 : 0;

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
