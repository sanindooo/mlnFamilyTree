import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger and SplitText
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Configure GSAP defaults if needed
gsap.defaults({
	ease: "power2.out",
	duration: 1,
});

export { gsap, ScrollTrigger };
