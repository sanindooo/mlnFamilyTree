import { setFooterYear } from './site.js';

// Static list of gallery images to render on the page.
// Add more entries here to expand the public gallery.
const images = [
  { src: './gallery/Children of MLN.jpg', alt: 'Children of MLN' },
  { src: './gallery/MLN Family in Mamakomo 80s.jpg', alt: 'MLN Family in Mamakomo 80s' },
  {
    src: './gallery/MLN Family Reunion 2003 at Greenhill Schools, Children of MLN.jpg',
    alt: 'MLN Family Reunion 2003 at Greenhill Schools',
  },
];

// Grid container that holds the gallery cards
const grid = document.querySelector('#gallery-grid');

// Keep footer year current
setFooterYear();

// Render each image as a card with a caption
if (grid) {
  for (const image of images) {
    const figure = document.createElement('figure'); // wrapper element
    figure.className = 'card';

    const img = document.createElement('img'); // image itself
    img.src = image.src;
    img.alt = image.alt;
    figure.appendChild(img);

    const caption = document.createElement('figcaption'); // caption text
    caption.textContent = image.alt;
    figure.appendChild(caption);

    grid.appendChild(figure); // add card to the grid
  }
}

