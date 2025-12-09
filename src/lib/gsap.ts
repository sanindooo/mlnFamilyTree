import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Configure GSAP defaults if needed
gsap.defaults({
	ease: "power2.out",
	duration: 1,
});

export { gsap, ScrollTrigger };
