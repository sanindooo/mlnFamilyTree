# Nsibirwa Family Website — Architecture

This project is a static site generated with Next.js (Pages Router) and deployed to Vercel. All content lives in the repository as files, so history and collaboration are preserved in Git.

## Key Ideas
- Static-first: JSON for the tree, Markdown for biographies, images in `public/`
- No-cost Q&A: local, client-side keyword search across Markdown
- Family-driven edits: optional serverless API commits to GitHub; no database

## Content Model
- `public/familyTree.json`: root node (MLN) and descendants
  - Node fields: `id`, `name`, `slug?`, `birthDate?`, `photo?`, `children?`
- `src/content/*.md`: member biographies (frontmatter: `title`)
- Images
  - Gallery-wide: `public/gallery/*`
  - Member-specific: `public/members/{slug}/*`

## Pages
- `index.tsx`: hero, highlights, timeline, site-wide quick search
- `tree.tsx`: hero + interactive tree (`src/components/Tree.tsx`)
- `[member].tsx`: member bio + auto-discovered photo gallery
- `gallery.tsx`: curated family photos
- `contribute.tsx`: generate JSON/Markdown or submit directly
- `chat.tsx`: local keyword Q&A over Markdown files

## Serverless API
- `pages/api/submit.ts`
  - Validates a shared `SUBMIT_SECRET`
  - Uses GitHub token to fetch, modify, and commit:
    - `public/familyTree.json` (insert under selected parent)
    - `src/content/{slug}.md` (creates biography)

Env vars:
- `GITHUB_TOKEN`: repo write token
- `GITHUB_REPO`: `owner/name`
- `GITHUB_BRANCH`: defaults to `main`
- `SUBMIT_SECRET`: shared family key

## Search
- Quick search (Home): flattens tree and filters by `name`/`birthDate`
- Q&A (Chat): TF-like term counts to rank documents; highlights snippets

## Styling
- Heritage Warmth palette with Playfair Display + Lato
- Subtle sepia on photos, warm sand cards, deep umber headings

## Extensibility
- Add roles/permissions by swapping shared key for GitHub OAuth
- Replace local Q&A with hosted search (e.g., Algolia) if desired
- Move to App Router later without changing content model

