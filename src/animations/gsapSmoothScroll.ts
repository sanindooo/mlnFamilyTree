declare const gsap: any;
declare const ScrollTrigger: any;
declare const Lenis: any;

let lenis = null;

export const gsapSmoothScroll = () => {
  lenis = new Lenis({
    prevent: (node) => node.getAttribute('data-prevent-lenis') === 'true',
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  gsap.ticker.lagSmoothing(0);
};

export const stopSmoothScroll = () => {
  lenis.stop();
};

export const startSmoothScroll = () => {
  lenis.start();
};
