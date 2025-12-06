import { loadJSON, setFooterYear } from './site.js';

// Root element where the interactive tree will be rendered
const treeRoot = document.querySelector('#tree-root');

/**
 * Initializes the tree page:
 * - Sets footer year
 * - Loads the family tree JSON
 * - Renders the full tree with expandable branches
 */
async function init() {
  setFooterYear(); // keep footer year current
  if (!treeRoot) return; // abort if container is missing

  try {
    const tree = await loadJSON('./data/familyTree.json'); // fetch hierarchical data
    const fragment = document.createDocumentFragment(); // batch DOM ops
    fragment.appendChild(renderBranch(tree, 0)); // render root branch
    treeRoot.appendChild(fragment); // mount in DOM
  } catch (err) {
    console.error(err); // log for debug
    treeRoot.textContent = 'Unable to load family tree.'; // friendly error
  }
}

/**
 * Recursively renders a node and its children.
 * Each node draws a row with optional +/- toggle and link to biography.
 */
function renderBranch(node, depth) {
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
      childContainer.appendChild(renderBranch(child, depth + 1)); // recursive render
    }
    branch.appendChild(childContainer); // add children to branch
  }

  return branch; // return assembled branch
}

// Start the page logic
init();

