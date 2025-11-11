# 🌳 Nsibirwa Family Legacy Site

This repository now serves a purely static website composed of HTML, CSS, and vanilla JavaScript. The site keeps the interactive home page, family tree, gallery, biographies, and local Q&A search—without any React, Next.js, or server-side code.

---

## ✨ Quick Start

Because the pages fetch JSON/Markdown files, open them through a tiny static server (browsers block `fetch()` on the `file://` protocol).

Run one of the following from the project root:

```bash
# Python 3
python -m http.server 4173

# Node.js (if you have npm)
npx serve .
```

Then visit `http://localhost:4173/index.html` (or the port that `serve` prints).

---

## 🗂️ Project Structure

```
mln/
├── index.html            # Home + quick search
├── tree.html             # Interactive family tree
├── gallery.html          # Photo grid
├── chat.html             # Local Q&A search
├── member.html           # Biography viewer (uses ?slug=)
├── styles.css            # Shared styling
├── js/                   # Vanilla JS modules for each page
├── data/
│   ├── familyTree.json   # Tree data (IDs, slugs, relationships)
│   └── docs.json         # Biography index (titles + photo lists)
├── content/              # Markdown biographies (front matter optional)
├── gallery/              # Gallery images
├── members/              # Member-specific photo folders
└── templates/            # Copy-paste helpers for new entries
```

---

## 🧩 Editing the Site

| Update | File(s) to edit | Notes |
|--------|-----------------|-------|
| Family relationships & quick search | `data/familyTree.json` | Add children under the correct parent `id`. `slug` connects to biographies. |
| Biography pages | `content/{slug}.md` | Markdown with optional front matter. The `<title>` and search snippets come from the `title` field or file name. |
| Biography metadata (title + photo list) | `data/docs.json` | Used by Q&A search and member gallery. Keep photo paths relative (e.g. `./members/...`). |
| Gallery cards | `js/gallery.js` | Simple array of `{ src, alt }`. |
| Styling | `styles.css` | Global theme shared across pages. |

### Templates for new relatives

Copy the files in `templates/`:

- `templates/member.json` → structure for one person in `familyTree.json`
- `templates/biography.md` → starter Markdown file

Steps:

1. Give the new relative a unique `id` and `slug` (lowercase, hyphenated).  
2. Paste the JSON snippet inside `data/familyTree.json` under the parent’s `children` array.  
3. Duplicate `templates/biography.md` into `content/{slug}.md` and fill it in.  
4. Add an entry in `data/docs.json` with the `slug`, display `title`, and any photo paths in `members/{slug}/`.  
5. Drop images into `members/{slug}/` (create the folder if it does not exist).  
6. (Optional) add a gallery photo to `gallery/` and register it in `js/gallery.js`.

---

## 🔍 Feature Notes

- **Home search**: filters `familyTree.json` by name or `birthDate`.  
- **Family tree**: loads the same JSON and renders expandable branches with vanilla JS.  
- **Member biographies**: `member.html?slug=martin-luther-nsibirwa` loads the Markdown file and any photos you list in `docs.json`.  
- **Q&A search**: client-side keyword matching across all Markdown content—no remote API calls.  
- **Gallery**: simple DOM render from the array in `js/gallery.js`.

The previous “Contribute” upload form has been removed. All updates happen by editing the files listed above.

---

## 🧠 Tips

- Keep `id` values stable—they link children to parents.  
- When moving the site under a subdirectory (e.g. GitHub Pages), the relative image paths like `./members/...` keep everything working.  
- If you add new JS modules, remember to include them with `<script type="module">` at the end of the relevant HTML page.

---

## 📚 Reference Docs

- `docs/ARCHITECTURE.md` – historical context of the earlier setup (still accurate for content organization).  
- `docs/CONTRIBUTING.md` – suggestions for collecting stories, photos, and family approvals.

Feel free to simplify or expand as the family needs grow. The site now runs anywhere that can serve plain files—no build step required. Enjoy capturing the Nsibirwa legacy! 🙌