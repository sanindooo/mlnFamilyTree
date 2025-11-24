import { loadJSON, flattenTree, setFooterYear } from './site.js';

// Maximum number of search results to display in the quick search
const SEARCH_LIMIT = 10;
const SLIDESHOW_INTERVAL = 6000;

// Cache references to DOM elements used on the home page
const searchInput = document.querySelector('#search-box'); // text input for search
const resultsList = document.querySelector('#search-results'); // <ul> to render results
const slideshowEl = document.querySelector('[data-slideshow]'); // hero slideshow container

// Holds the flattened list of people for fast filtering at runtime
let people = [];
const slideshowSlides = [
  {
    src: './slideshow/Document from Paul Kiwana Nsibirwa.png',
    caption: 'An early record from the Nsibirwa archives',
  },
  {
    src: './slideshow/Document from Paul Kiwana Nsibirwa (1).png',
    caption: 'An early record from the Nsibirwa archives',
  },
  {
    src: './slideshow/Document from Paul Kiwana Nsibirwa (2).png',
    caption: 'Images from the Nsibirwa heritage collection',
  },
];
let slideshowTimer = null;
let activeSlideIndex = 0;
const slideNodes = [];
const dotNodes = [];

/**
 * Initializes the home page:
 * - Sets footer year
 * - Loads and flattens the family tree for search
 * - Handles graceful failure if the data cannot be loaded
 */
async function init() {
  setFooterYear(); // update footer copyright year
  initSlideshow(); // build hero slideshow
  try {
    const tree = await loadJSON('./data/familyTree.json'); // fetch tree JSON
    people = flattenTree(tree); // flatten for quick search
  } catch (err) {
    console.error(err); // log error for debugging
    const li = document.createElement('li'); // create a friendly message
    li.className = 'muted';
    li.textContent = 'Unable to load family tree data.';
    resultsList.appendChild(li); // show message in results area
  }
}

/**
 * Filters the flattened people list based on the user's query
 * and renders a concise list of matches.
 */
function handleSearch(event) {
  const query = event.target.value.trim(); // current input
  resultsList.innerHTML = ''; // clear previous results
  if (!query) {
    return; // nothing to search
  }

  const lower = query.toLowerCase(); // normalized text
  const matches = people
    .filter((person) => {
      // check for name match or birthDate match
      const nameMatch = person.name.toLowerCase().includes(lower);
      const birthMatch = (person.birthDate || '').includes(lower);
      return nameMatch || birthMatch;
    })
    .slice(0, SEARCH_LIMIT); // cap results to avoid long lists

  if (matches.length === 0) {
    const li = document.createElement('li'); // no results message
    li.className = 'muted';
    li.textContent = 'No results';
    resultsList.appendChild(li);
    return;
  }

  // Render each match as a list item with optional link to the member page
  for (const person of matches) {
    const li = document.createElement('li'); // container for one result
    if (person.slug) {
      const link = document.createElement('a'); // link to biography page
      link.href = `./member.html?slug=${encodeURIComponent(person.slug)}`;
      link.textContent = person.name;
      li.appendChild(link);
    } else {
      li.textContent = person.name; // if no slug, just show name
    }
    if (person.birthDate) {
      const span = document.createElement('span'); // show birth date inline
      span.className = 'muted';
      span.textContent = ` — ${person.birthDate}`;
      li.appendChild(span);
    }
    resultsList.appendChild(li); // add to results list
  }
}

/**
 * Builds and starts the hero slideshow using the provided document images.
 * Adds dot controls and respects prefers-reduced-motion when auto-playing.
 */
function initSlideshow() {
  if (!slideshowEl || slideshowSlides.length === 0) {
    return;
  }

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'hero-slides';
  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'hero-dots';

  slideshowSlides.forEach((slide, index) => {
    const figure = document.createElement('figure');
    figure.className = 'hero-slide';
    if (index === 0) {
      figure.classList.add('active');
    }

    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.caption;
    figure.appendChild(img);

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = slide.caption;
    figure.appendChild(figcaption);

    slidesWrapper.appendChild(figure);
    slideNodes.push(figure);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index, true));
    dotsWrapper.appendChild(dot);
    dotNodes.push(dot);
  });

  slideshowEl.appendChild(slidesWrapper);
  slideshowEl.appendChild(dotsWrapper);

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && slideshowSlides.length > 1) {
    slideshowTimer = window.setInterval(() => {
      const nextIndex = (activeSlideIndex + 1) % slideshowSlides.length;
      goToSlide(nextIndex);
    }, SLIDESHOW_INTERVAL);
  }
}

/**
 * Switches the visible slide and keeps the dot indicators in sync.
 */
function goToSlide(index, stopTimer = false) {
  if (index === activeSlideIndex) return;
  slideNodes[activeSlideIndex]?.classList.remove('active');
  dotNodes[activeSlideIndex]?.classList.remove('active');
  activeSlideIndex = index;
  slideNodes[activeSlideIndex]?.classList.add('active');
  dotNodes[activeSlideIndex]?.classList.add('active');
  if (stopTimer && slideshowTimer) {
    window.clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
}

// Kick off initialization on module load
init();

// Wire up the input listener if present on the page
if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

