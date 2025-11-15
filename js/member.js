import { loadJSON, loadText, parseFrontMatter, markdownToHtml, setFooterYear, flattenTree } from './site.js';

// Read the slug query parameter from the URL (e.g., member.html?slug=janet-mdoe)
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

// Cache references to key DOM elements on this page
const titleEl = document.querySelector('#member-title'); // <h1> for page title
const contentEl = document.querySelector('#member-content'); // container for bio HTML
const heroPhotoEl = document.querySelector('#member-hero-photo'); // hero image slot
const gallerySection = document.querySelector('#member-gallery'); // gallery section wrapper
const galleryGrid = document.querySelector('#member-gallery-grid'); // gallery grid container
const familyTreeSection = document.querySelector('#member-family-tree'); // family tree section wrapper
const familyTreeRoot = document.querySelector('#member-tree-root'); // family tree container

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

    // Special handling for Martin Luther Nsibirwa: use page_1.png as hero image
    if (slug === 'martin-luther-nsibirwa') {
      renderHeroPhoto('./mln_bio/page_1.png', title);
      const photos = Array.isArray(entry.photos) ? entry.photos : [];
      if (photos.length > 0) {
        renderGallery(photos, title); // show other photos in gallery if available
      }
    } else {
      const photos = Array.isArray(entry.photos) ? entry.photos : []; // photo list from docs.json
      if (photos.length > 0) {
        renderHeroPhoto(photos[0], title); // first photo in hero slot
        renderGallery(photos, title); // rest as a grid
      } else {
        heroPhotoEl?.remove(); // remove hero image placeholder if no photos
      }
    }

    // Load and render family tree for this member (if they have children)
    await renderFamilyTree(slug);
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
 * Loads the family tree and renders the subtree for the current member.
 * Only displays if the member has children.
 */
async function renderFamilyTree(memberSlug) {
  if (!familyTreeSection || !familyTreeRoot) return; // missing containers

  try {
    const fullTree = await loadJSON('./data/familyTree.json'); // load full tree
    const allNodes = flattenTree(fullTree); // flatten for searching
    const memberNode = allNodes.find((node) => node.slug === memberSlug); // find this member

    if (!memberNode || !Array.isArray(memberNode.children) || memberNode.children.length === 0) {
      return; // no children, don't show tree section
    }

    // Create a subtree with this member as root
    const subtree = {
      ...memberNode,
      // Keep children as-is (they're already the subtree we want)
    };

    // Render the subtree
    const fragment = document.createDocumentFragment();
    fragment.appendChild(renderTreeBranch(subtree, 0));
    familyTreeRoot.appendChild(fragment);
    familyTreeSection.style.display = ''; // show the section
  } catch (err) {
    console.error('Failed to load family tree:', err); // log but don't block page
    // Silently fail - tree section just won't appear
  }
}

/**
 * Recursively renders a tree branch (similar to tree.js but for member pages).
 * Each node shows a row with optional +/- toggle and link to biography.
 */
function renderTreeBranch(node, depth) {
  const branch = document.createElement('div'); // container for one branch
  branch.className = 'branch';
  branch.style.marginLeft = `${depth * 16}px`; // visual indentation by depth

  const row = document.createElement('div'); // header row for the node
  row.className = 'branch-row';
  branch.appendChild(row);

  const hasChildren = Array.isArray(node.children) && node.children.length > 0; // child presence

  let childContainer = null; // will contain rendered children
  if (hasChildren) {
    const toggle = document.createElement('button'); // disclosure control
    toggle.className = 'toggle';
    toggle.setAttribute('aria-label', 'toggle children');
    toggle.textContent = '−'; // start expanded
    toggle.addEventListener('click', () => {
      const open = toggle.textContent === '−'; // is currently open?
      toggle.textContent = open ? '+' : '−'; // flip symbol
      if (childContainer) {
        childContainer.hidden = open; // hide/show children
      }
    });
    row.appendChild(toggle); // add control to row
  }

  if (node.photo) {
    const img = document.createElement('img'); // small avatar
    img.src = node.photo;
    img.alt = node.name;
    img.className = 'tree-photo';
    row.appendChild(img);
  }

  if (node.slug) {
    const link = document.createElement('a'); // link to member biography
    link.href = `./member.html?slug=${encodeURIComponent(node.slug)}`;
    link.className = 'person';
    link.textContent = node.name;
    row.appendChild(link);
  } else {
    const span = document.createElement('span'); // fallback when no page exists
    span.className = 'person disabled';
    span.textContent = node.name;
    row.appendChild(span);
  }

  if (node.birthDate) {
    const birth = document.createElement('span'); // inline date display
    birth.className = 'muted';
    birth.textContent = ` — ${node.birthDate}`;
    row.appendChild(birth);
  }

  if (hasChildren) {
    childContainer = document.createElement('div'); // wrapper for child branches
    childContainer.className = 'children';
    for (const child of node.children) {
      childContainer.appendChild(renderTreeBranch(child, depth + 1)); // recursive render
    }
    branch.appendChild(childContainer); // add children to branch
  }

  return branch; // return assembled branch
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
  if (familyTreeSection) {
    familyTreeSection.remove(); // remove tree section
  }
}

// Start the member page logic
init();

