# Contributing Content (Family Members)

There are two easy ways to add a person to the family website.

## 1) Quick and Offline (no login)
1. Open the Contribute page on the site
2. Choose the parent in the tree, fill in the name, slug, birth date and biography
3. Download the JSON snippet and Markdown file
4. Send both files by email/WhatsApp to the site maintainer

The maintainer drops the JSON into `public/familyTree.json` under the chosen parent and saves the Markdown to `src/content/{slug}.md`.

## 2) Direct Submit (auto-commit)
1. Get the family key from an admin
2. Fill the Contribute form and press “Submit to Site”
3. The site commits your changes directly to the GitHub repository — a new person appears in the tree and a page is created

Admin setup (Vercel env vars): `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`, `SUBMIT_SECRET` (see `.env.example`).

## Photos
- Add photos to `public/members/{slug}/` for an automatic gallery on that member’s page
- Reunion/event images belong in `public/gallery/`

## Tips
- The `slug` should be lowercase with `-` between words: `janet-mdoe`
- Use short paragraphs in biographies for readability

