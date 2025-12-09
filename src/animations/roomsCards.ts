declare const gsap: any;
declare const ScrollTrigger: any;
declare const SplitText: any;

export const roomsCards = () => {
  const roomsCards = document.querySelector('.rooms-cards-animation');
  if (!roomsCards) return;
  const headerTitle = roomsCards.querySelector('.slider-1_header h2');
  const headerDescription = roomsCards.querySelector('.slider-1_content p');
  const buttons = roomsCards.querySelectorAll('.slider-1_nav a.slider-1_nav-button');
  const cards = roomsCards.querySelectorAll('.slider-1_item');

  const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });

  const titleSplits = Array.from(cards).map((card) => {
    const title = card.querySelector('.slider-1_card-header h3');
    const titlesSplit = new SplitText(title, {
      type: 'words,lines',
      mask: 'lines',
    });

    return titlesSplit.lines;
  });
  const descriptionSplits = Array.from(cards).map((card) => {
    const description = card.querySelector('.text-rich-text p ');
    const descriptionsSplit = new SplitText(description, {
      type: 'words,lines',
      mask: 'lines',
    });
    return descriptionsSplit.lines;
  });

  const cardsImages = Array.from(cards).map(
    (card) => card.querySelector('.slider-1_item-fig') as HTMLElement
  );
  const cardsButtonLinks = Array.from(cards).map(
    (card) => card.querySelector('.slider-1_card-footer a') as HTMLElement
  );

  const headerTitleSplit = new SplitText(headerTitle, {
    type: 'words,lines',
    mask: 'lines',
  });
  const headerDescriptionSplit = new SplitText(headerDescription, {
    type: 'words,lines',
    mask: 'lines',
  });
  gsap.set(buttons[0].parentElement, {
    overflow: 'hidden',
  });
  cards.forEach((card) => {
    const button = card.querySelector('.slider-1_card-footer');
    gsap.set(button, {
      overflow: 'hidden',
    });
  });

  tl.add('header', 0);
  tl.add('cards', 0.75);

  tl.fromTo(
    headerTitleSplit.lines,
    {
      yPercent: 100,
    },
    {
      yPercent: 0,
    },
    'header'
  )
    .fromTo(
      headerDescriptionSplit.lines,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        stagger: 0.1,
      },
      'header+=.15'
    )
    .fromTo(
      buttons,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
      },
      'header+=.15'
    )
    .fromTo(
      cardsImages,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        stagger: 0.05,
      },
      'cards'
    )
    .fromTo(
      titleSplits,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
      },
      'cards+=.15'
    )
    .fromTo(
      descriptionSplits,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        stagger: 0.05,
      },
      'cards+=.5'
    )
    .fromTo(
      cardsButtonLinks,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
      },
      'cards+=.5'
    );

  ScrollTrigger.create({
    trigger: roomsCards,
    start: 'top 70%',
    // end: 'bottom 50%',
    markers: false,
    animation: tl,
  });
};
