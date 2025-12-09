declare const gsap: any;
declare const ScrollTrigger: any;
declare const SplitText: any;

const titleAnimation = (headerTitle: Element, tl: any, order?: string) => {
  gsap.set(headerTitle, {
    textWrap: 'nowrap',
  });
  const titleSplit = new SplitText(headerTitle, {
    type: 'words',
    mask: 'words',
    // reduceWhiteSpace: true,
  });
  const parent = headerTitle.parentElement;
  const isRotated = parent?.hasAttribute('data-90deg-text');

  const animationOrder = headerTitle.getAttribute('data-animation-order');

  const mm = gsap.matchMedia();
  mm.add('(max-width: 767px)', () => {
    gsap.set(headerTitle, {
      textWrap: 'wrap',
    });
  });
  if (isRotated) {
    tl.fromTo(
      titleSplit.words,
      {
        xPercent: 100,
      },
      {
        xPercent: 0,
      },
      order ?? animationOrder ?? null
    );
  } else {
    tl.fromTo(
      titleSplit.words,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
      },
      order ?? animationOrder ?? null
    );
  }
};

const figureAnimation = (figures: NodeListOf<Element>, tl: any, order?: boolean) => {
  figures.forEach((figure, index) => {
    const animationOrder = figure.getAttribute('data-animation-order');
    tl.fromTo(
      figure,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      },
      order ? '-=75%' : animationOrder ?? `-=${index * 0.75}`
    );
  });
};

const paragraphsAnimation = (paragraphs: NodeListOf<Element>, tl: any, order?: string) => {
  paragraphs.forEach((paragraph) => {
    const animationOrder = paragraph.getAttribute('data-animation-order');
    const paragraphSplit = new SplitText(paragraph, {
      type: 'words,lines',
      mask: 'lines',
    });

    gsap.set(paragraphSplit.lines, {
      overflow: 'hidden',
    });
    gsap.set(paragraphSplit.lines, {
      yPercent: 100,
    });
    tl.to(
      paragraphSplit.lines,
      {
        yPercent: 0,
        stagger: 0.15,
      },
      order ?? animationOrder ?? null
    );
  });
};

export const dualImage = () => {
  const sections = document.querySelectorAll('[data-animation-general]');
  // const testSection = document.querySelector('.section_two-img-imba.is-2');
  // const test = testSection?.querySelectorAll('header > *:first-child');
  //  // console.log(test);

  const elems = document.getElementsByTagName('*');
  if (sections.length > 0) {
    sections.forEach((section) => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          defaults: {
            duration: 1,
            ease: 'power2.inOut',
          },
        });

        const figures = section.querySelectorAll('figure');
        const headerTitles = section.querySelectorAll('header > *:first-child');
        const paragraphs = section.querySelectorAll('p');
        const links = section.querySelectorAll('a.button.is-link');
        const liItems = section.querySelectorAll('li');
        const otherLinks = section.querySelectorAll('a.sticky-details_link');
        // let index = 0;
        const indexOfTitle = Array.from(elems).indexOf(headerTitles[0] as Element);
        const indexOfFirstFigure = Array.from(elems).indexOf(figures[0] as Element);
        const indexOfFirstParagraph = Array.from(elems).indexOf(paragraphs[0] as Element);

        if (indexOfTitle >= 0 && indexOfTitle < indexOfFirstFigure) {
          if (headerTitles.length > 0) {
            headerTitles.forEach((headerTitle) => {
              titleAnimation(headerTitle, tl);
            });
          }
          if (indexOfFirstFigure > indexOfFirstParagraph) {
            if (paragraphs.length > 0) {
              paragraphsAnimation(paragraphs, tl, '-=70%');
            }
            if (figures.length > 0) {
              figureAnimation(figures, tl, true);
            }
          } else {
            if (figures.length > 0) {
              figureAnimation(figures, tl, true);
            }
            if (paragraphs.length > 0) {
              paragraphsAnimation(paragraphs, tl, '-=50%');
            }
          }
        } else {
          figureAnimation(figures, tl);
          if (indexOfFirstParagraph > indexOfTitle) {
            if (headerTitles.length > 0) {
              headerTitles.forEach((headerTitle) => {
                titleAnimation(headerTitle, tl, '-=85%');
              });
            }
            if (paragraphs.length > 0) {
              paragraphsAnimation(paragraphs, tl, '-=60%');
            }
          } else {
            if (paragraphs.length > 0) {
              paragraphsAnimation(paragraphs, tl, '-=50%');
            }
            if (headerTitles.length > 0) {
              headerTitles.forEach((headerTitle) => {
                titleAnimation(headerTitle, tl);
              });
            }
          }
        }

        if (links.length > 0) {
          links.forEach((link) => {
            const linkSplit = new SplitText(link.querySelector('div'), {
              type: 'words,lines',
              mask: 'lines',
            });
            const icon = link.querySelector('svg');
            gsap.set(link, {
              overflow: 'hidden',
            });
            gsap.set(linkSplit.lines, {
              overflow: 'hidden',
            });
            tl.fromTo(
              linkSplit.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                // duration: 1,
                stagger: 0.05,
              },
              '-=.75'
            ).fromTo(
              icon,
              {
                yPercent: 140,
              },
              {
                yPercent: 0,
                // duration: 1,
                stagger: 0.1,
              },
              '-=.75'
            );
          });
        }

        if (liItems.length > 0) {
          liItems.forEach((li) => {
            const liSplit = new SplitText(li, {
              type: 'lines',
              mask: 'lines',
            });
            gsap.set(liSplit.lines, {
              overflow: 'hidden',
            });
            tl.fromTo(
              liSplit.lines,
              {
                yPercent: 120,
              },
              {
                yPercent: 0,
                stagger: 0.01,
              },
              '-=1'
            );
          });
        }

        if (otherLinks.length > 0) {
          otherLinks.forEach((otherLink) => {
            const otherLinkSplit = new SplitText(otherLink.querySelector('div'), {
              type: 'lines',
              mask: 'lines',
            });
            gsap.set(otherLink, {
              overflow: 'hidden',
            });
            gsap.set(otherLinkSplit.lines, {
              overflow: 'hidden',
            });
            tl.fromTo(
              otherLink.querySelector('svg'),
              {
                yPercent: 140,
              },
              {
                yPercent: 0,
              },
              '-=1'
            ).fromTo(
              otherLinkSplit.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
              },
              '-=.75'
            );
          });
        }

        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          markers: false,
          animation: tl,
        });
      });

      mm.add('(max-width: 767px)', () => {
        const duration = 0.5;
        const ease = 'ease.out';
        const figures = section.querySelectorAll('figure');
        const headerTitle = section.querySelector('header > *:first-child');
        const paragraphs = section.querySelectorAll('p');
        const links = section.querySelectorAll('a.button.is-link');
        const liItems = section.querySelectorAll('li');
        const otherLinks = section.querySelectorAll('a.sticky-details_link');
        if (figures.length > 0) {
          figures.forEach((figure) => {
            const tl = gsap.timeline({
              defaults: {
                duration: duration,
                ease: ease,
              },
            });
            gsap.set(figure, {
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            });

            tl.to(figure, {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            });
            ScrollTrigger.create({
              trigger: figure,
              start: 'top 80%',
              markers: false,
              animation: tl,
            });
          });
        }

        if (headerTitle) {
          const tl = gsap.timeline({
            defaults: {
              duration: duration,
              ease: ease,
            },
          });
          const titleSplit = new SplitText(headerTitle, {
            type: 'lines',
            mask: 'lines',
          });
          const parent = headerTitle.parentElement;
          const isRotated = parent?.hasAttribute('data-90deg-text');

          gsap.set(titleSplit.lines, {
            overflow: 'hidden',
          });
          if (isRotated) {
            tl.fromTo(
              titleSplit.lines,
              {
                xPercent: 100,
              },
              {
                xPercent: 0,
                stagger: 0.05,
              }
            );
          } else {
            tl.fromTo(
              titleSplit.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                stagger: 0.05,
              }
            );
          }
          ScrollTrigger.create({
            trigger: headerTitle,
            start: 'top 80%',
            markers: false,
            animation: tl,
          });
        }

        if (paragraphs.length > 0) {
          paragraphs.forEach((paragraph) => {
            const tl = gsap.timeline({
              defaults: {
                duration: duration,
                ease: ease,
              },
            });
            const paragraphSplit = new SplitText(paragraph, {
              type: 'lines',
              mask: 'lines',
            });

            gsap.set(paragraphSplit.lines, {
              overflow: 'hidden',
            });
            gsap.set(paragraphSplit.lines, {
              yPercent: 100,
            });
            tl.to(paragraphSplit.lines, {
              yPercent: 0,
              stagger: 0.01,
            });
            ScrollTrigger.create({
              trigger: paragraph,
              start: 'top 80%',
              markers: false,
              animation: tl,
            });
          });
        }

        if (links.length > 0) {
          links.forEach((link) => {
            const tl = gsap.timeline({
              defaults: {
                duration: duration,
                ease: ease,
              },
            });
            const linkSplit = new SplitText(link.querySelector('div'), {
              type: 'lines',
              mask: 'lines',
            });
            // const animationOrder = link.getAttribute('data-animation-order');
            const icon = link.querySelector('svg');
            gsap.set(link, {
              overflow: 'hidden',
            });
            gsap.set(linkSplit.lines, {
              overflow: 'hidden',
            });
            tl.fromTo(
              linkSplit.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
                stagger: 0.05,
              }
            ).fromTo(
              icon,
              {
                yPercent: 140,
              },
              {
                yPercent: 0,
                stagger: 0.1,
              },
              '-=1'
            );
            ScrollTrigger.create({
              trigger: link,
              start: 'top 80%',
              markers: false,
              animation: tl,
            });
          });
        }

        if (liItems.length > 0) {
          const tl = gsap.timeline({
            defaults: {
              duration: duration,
              ease: ease,
            },
          });
          liItems.forEach((li) => {
            const liSplit = new SplitText(li, {
              type: 'lines',
              mask: 'lines',
            });
            gsap.set(liSplit.lines, {
              overflow: 'hidden',
            });
            tl.fromTo(
              liSplit.lines,
              {
                yPercent: 120,
              },
              {
                yPercent: 0,
                stagger: 0.01,
              }
            );
            ScrollTrigger.create({
              trigger: li.parentElement,
              start: 'top 80%',
              markers: false,
              animation: tl,
            });
          });
        }

        if (otherLinks.length > 0) {
          otherLinks.forEach((otherLink) => {
            const tl = gsap.timeline({
              defaults: {
                duration: duration,
                ease: ease,
              },
            });
            const otherLinkSplit = new SplitText(otherLink.querySelector('div'), {
              type: 'lines',
              mask: 'lines',
            });
            gsap.set(otherLink, {
              overflow: 'hidden',
            });
            gsap.set(otherLinkSplit.lines, {
              overflow: 'hidden',
            });
            tl.fromTo(
              otherLink.querySelector('svg'),
              {
                yPercent: 140,
              },
              {
                yPercent: 0,
              }
            ).fromTo(
              otherLinkSplit.lines,
              {
                yPercent: 100,
              },
              {
                yPercent: 0,
              },
              '-=.75'
            );
            ScrollTrigger.create({
              trigger: otherLink,
              start: 'top 80%',
              markers: false,
              animation: tl,
            });
          });
        }
      });
    });
  }
};
