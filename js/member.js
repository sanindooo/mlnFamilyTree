import { loadJSON, loadText, parseFrontMatter, markdownToHtml, setFooterYear } from './site.js';

// Read the slug query parameter from the URL (e.g., member.html?slug=janet-mdoe)
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

// Cache references to key DOM elements on this page
const titleEl = document.querySelector('#member-title'); // <h1> for page title
const contentEl = document.querySelector('#member-content'); // container for bio HTML
const heroPhotoEl = document.querySelector('#member-hero-photo'); // hero image slot
const gallerySection = document.querySelector('#member-gallery'); // gallery section wrapper
const galleryGrid = document.querySelector('#member-gallery-grid'); // gallery grid container

/**
 * Initializes the member page:
 * - Confirms a slug is present
 * - Loads metadata from docs.json and the member's markdown
 * - Renders title, content, and photos (if any)
 */
async function init() {
  setFooterYear(); // set current footer year

  if (!slug) {
    showError('No family member selected.'); // missing URL parameter
    return;
  }

  try {
    const docs = await loadJSON('./data/docs.json'); // metadata index
    const entry = docs.find((doc) => doc.slug === slug); // find matching entry
    if (!entry) {
      showError('Family member not found in the index.'); // unknown slug
      return;
    }

    const raw = await loadText(`./content/${slug}.md`); // load markdown file
    const { data, content } = parseFrontMatter(raw); // parse optional front matter

    const title = data.title || entry.title || slug; // prefer front matter title
    if (titleEl) {
      titleEl.textContent = title; // update heading
    }

    if (document.title) {
      document.title = `${title} — Nsibirwa Family`; // set browser tab title
    }

    if (contentEl) {
      // Convert simple Markdown to HTML for display
      contentEl.innerHTML = markdownToHtml(content || 'Biography coming soon.');
    }

    const photos = Array.isArray(entry.photos) ? entry.photos : []; // photo list from docs.json
    if (photos.length > 0) {
      renderHeroPhoto(photos[0], title); // first photo in hero slot
      renderGallery(photos, title); // rest as a grid
    } else {
      heroPhotoEl?.remove(); // remove hero image placeholder if no photos
    }
  } catch (err) {
    console.error(err); // log failure for debugging
    showError('Unable to load biography.'); // friendly message
  }
}

/**
 * Renders the hero image at the top-right of the member page.
 */
function renderHeroPhoto(url, title) {
  if (!heroPhotoEl) return; // no container present
  heroPhotoEl.innerHTML = ''; // clear any previous content
  const image = document.createElement('img'); // build <img>
  image.src = url;
  image.alt = title;
  image.className = 'hero-photo'; // styled by CSS

  heroPhotoEl.appendChild(image); // mount image
}

/**
 * Builds the photo gallery from a list of image URLs.
 */
function renderGallery(photos, title) {
  if (!gallerySection || !galleryGrid) return; // missing containers

  galleryGrid.innerHTML = ''; // reset grid
  for (const photo of photos) {
    const figure = document.createElement('figure'); // card wrapper
    figure.className = 'card';

    const img = document.createElement('img'); // image element
    img.src = photo;
    const captionText = photo.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/i, '').replace(/[-_]/g, ' ') || title;
    img.alt = `${title} — ${captionText}`; // alt text uses derived caption
    figure.appendChild(img);

    const caption = document.createElement('figcaption'); // caption element
    caption.textContent = captionText;
    figure.appendChild(caption);

    galleryGrid.appendChild(figure); // add card to grid
  }

  gallerySection.style.display = ''; // unhide gallery section
}

/**
 * Displays a muted error message in place of the biography.
 * Also removes visual containers that would be empty.
 */
function showError(message) {
  if (titleEl) {
    titleEl.textContent = 'Biography'; // generic fallback heading
  }
  if (contentEl) {
    contentEl.innerHTML = `<p class="muted">${message}</p>`; // inline error message
  }
  heroPhotoEl?.remove(); // hide empty hero
  if (gallerySection) {
    gallerySection.remove(); // remove gallery section entirely
  }
}

// Start the member page logic
init();

