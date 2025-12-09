import { gsap } from 'gsap';
import SplitType from 'split-type';

export const gsapTimelineAnimation = () => {
  const targets = document.querySelectorAll('.timeline_row');
  if (targets) {
    let mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: 'screen and (max-width: 767px)',
        isDesktop: 'screen and (min-width: 768px)',
      },
      (context) => {
        let { isMobile, isDesktop } = context.conditions;

        targets.forEach((target) => {
          const timelineHeading = target.querySelector('.timeline_title');
          const timelineText = target.querySelector('.timeline_text');
          gsap.set([timelineHeading, timelineText], {
            display: 'inline-block',
          });

          const splitText = new SplitType(timelineText, { types: 'words' });
          const splitTextHeading = new SplitType(timelineHeading, { types: 'words' });

          gsap.set([splitText.words, splitTextHeading.words], {
            yPercent: 80,
            opacity: 0,
            autoAlpha: 0,
          });

          const timelineIcon = target.querySelector('.timeline-icon-wrapper');

          const tlTextAnimations = gsap.timeline({ paused: true });
          tlTextAnimations.to([splitTextHeading.words, splitText.words], {
            ease: (i) => 1 - Math.pow(1 - i, 4),
            duration: isMobile ? 1.5 : 1,
            yPercent: 0,
            opacity: 1,
            autoAlpha: 1,
            stagger: 0.01,
          });

          const tlIcon = gsap.timeline({ paused: true });
          tlIcon.from(timelineIcon, {
            borderColor: '#fff',
            duration: 0.5,
            ease: 'power3.inOut',
          });

          function timelinePlayAnimations() {
            tlTextAnimations.play(0);
            tlIcon.play(0);
          }

          function timelineResetAnimations() {
            tlTextAnimations.reverse();
            tlIcon.reverse();
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              start: isMobile ? 'top+=20 center' : 'top+=8 center',
              end: isMobile ? 'bottom center' : 'bottom center',
              trigger: target,
              scrub: true,
              // markers: true,
              onEnter: () => timelinePlayAnimations(),
              onLeaveBack: () => timelineResetAnimations(),
            },
          });
        });
      }
    );
  }
};
