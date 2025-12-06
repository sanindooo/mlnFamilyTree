import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { Timeline } from "@/components/home/Timeline";
import { EventCTA } from "@/components/home/EventCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Highlights />
      <Timeline />
      <EventCTA />
    </>
  );
}
