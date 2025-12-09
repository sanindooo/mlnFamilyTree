declare const gsap: any;
declare const ScrollTrigger: any;
// declare const SplitText: any;

export const imagesScroll = () => {
  const sections = document.querySelectorAll('.section_flashy-gallery .flashy-gallery_component');
  if (sections.length > 0) {
    sections.forEach((section) => {
      const imageWrappers = section.querySelectorAll('.flashy-gallery_fig-2-wrap');
      const images = section.querySelectorAll('.flashy-gallery_fig-2');
      const background = section.querySelector('.flashy-gallery_component-bg');
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline();
        tl.to(
          imageWrappers,
          {
            yPercent: -100,
          },
          '0'
        ).to(
          images,
          {
            y: `-${images.length * 50}%`,
            ease: 'none',
          },
          '0'
        );
        ScrollTrigger.create({
          trigger: section,
          markers: false,
          pin: true,
          scrub: true,
          start: 'top top',
          end: `+=${images.length * 50}%`,
          animation: tl,
        });
        ScrollTrigger.create({
          trigger: section,
          markers: false,
          scrub: true,
          start: 'top top',
          end: 'bottom 50%',
          animation: gsap.fromTo(background, { scaleX: 0.95 }, { scaleX: 1, duration: 0.5 }, '0'),
        });
      });
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline();
        tl.to(images, {
          x: `-${images.length * 100}%`,
          ease: 'none',
        });
        ScrollTrigger.create({
          trigger: section,
          markers: false,
          pin: true,
          scrub: true,
          start: 'top top',
          end: `+=${images.length * 100}%`,
          animation: tl,
        });
        ScrollTrigger.create({
          trigger: section,
          markers: false,
          scrub: true,
          start: 'top top',
          end: 'bottom 50%',
          animation: gsap.fromTo(background, { scaleX: 0.9 }, { scaleX: 1, duration: 0.5 }, '0'),
        });
      });
    });
  }
};
