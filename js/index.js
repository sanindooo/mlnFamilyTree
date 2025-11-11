import { loadJSON, flattenTree, setFooterYear } from './site.js';

// Maximum number of search results to display in the quick search
const SEARCH_LIMIT = 10;

// Cache references to DOM elements used on the home page
const searchInput = document.querySelector('#search-box'); // text input for search
const resultsList = document.querySelector('#search-results'); // <ul> to render results

// Holds the flattened list of people for fast filtering at runtime
let people = [];

/**
 * Initializes the home page:
 * - Sets footer year
 * - Loads and flattens the family tree for search
 * - Handles graceful failure if the data cannot be loaded
 */
async function init() {
  setFooterYear(); // update footer copyright year
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

// Kick off initialization on module load
init();

// Wire up the input listener if present on the page
if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

