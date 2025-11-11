import {
  loadJSON,
  loadText,
  parseFrontMatter,
  makeSnippet,
  highlightTerms,
  countTerm,
  setFooterYear,
} from './site.js';

// DOM references for Q&A search input and results output
const searchInput = document.querySelector('#qa-search'); // <input> text box
const resultsList = document.querySelector('#qa-results'); // <ul> results list

// Holds parsed documents (slug, title, content) for ranking
let documents = [];

/**
 * Initializes the Q&A page:
 * - Sets footer year
 * - Loads docs index and each markdown file
 * - Builds an in-memory corpus for simple keyword ranking
 */
async function init() {
  setFooterYear(); // ensure footer is up-to-date

  try {
    const entries = await loadJSON('./data/docs.json'); // load doc metadata
    documents = await Promise.all(
      entries.map(async (entry) => {
        const raw = await loadText(`./content/${entry.slug}.md`); // load markdown
        const { data, content } = parseFrontMatter(raw); // parse front matter
        return {
          slug: entry.slug, // used to build links
          title: data.title || entry.title || entry.slug, // choose best title
          content, // raw content without front matter
        };
      }),
    );
  } catch (err) {
    console.error(err); // helpful for debugging
    const li = document.createElement('li'); // friendly error
    li.className = 'muted';
    li.textContent = 'Unable to load biographies.';
    resultsList.appendChild(li);
  }
}

/**
 * Ranks documents by term frequency and displays the top matches.
 */
function handleSearch(event) {
  const q = event.target.value.trim(); // user's query
  resultsList.innerHTML = ''; // clear previous results
  if (!q) {
    return; // no query to process
  }

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean); // split into words
  const ranked = documents
    .map((doc) => {
      // naive TF scoring on title + content
      const score =
        terms.reduce((acc, term) => acc + countTerm(doc.title.toLowerCase(), term), 0) +
        terms.reduce((acc, term) => acc + countTerm(doc.content.toLowerCase(), term), 0);
      return { doc, score }; // carry doc + score for sorting
    })
    .filter((item) => item.score > 0) // drop zero-score docs
    .sort((a, b) => b.score - a.score) // descending score
    .slice(0, 5); // take top 5

  if (ranked.length === 0) {
    const li = document.createElement('li'); // empty state
    li.className = 'muted';
    li.textContent = 'No matches found';
    resultsList.appendChild(li);
    return;
  }

  // Render each result with a link and a highlighted snippet
  for (const { doc } of ranked) {
    const li = document.createElement('li'); // container for item

    const link = document.createElement('a'); // link to member page
    link.href = `./member.html?slug=${encodeURIComponent(doc.slug)}`;
    link.innerHTML = `<strong>${doc.title}</strong>`;
    li.appendChild(link);

    const snippet = document.createElement('div'); // small preview text
    snippet.className = 'snippet';
    snippet.innerHTML = highlightTerms(makeSnippet(doc.content), terms).replace(/\n/g, '<br/>');
    li.appendChild(snippet);

    resultsList.appendChild(li); // add to list
  }
}

// Start the page logic
init();

// Attach the input event handler
if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

