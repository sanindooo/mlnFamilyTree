# 🌳 Family Tree Website — Nsibirwa Family

A static website preserving our family history from our great-grandfather down to the latest generation.  
Built and edited in **Cursor**, deployed on **Vercel (v0)** — fast, modern, and simple to maintain.

---

## ✨ Overview

This is a **static site** — it has no traditional backend or database.  
All content (biographies, tree data, and gallery images) is stored in files and deployed automatically.

You can edit the content directly inside **Cursor** or by updating JSON/Markdown files.

---

## 🧩 Features

- 🧬 **Interactive Family Tree** — displays relationships starting from our great-grandfather  
- 👨‍👩‍👧‍👦 **Biography Pages** — each family member has a Markdown bio  
- 🖼️ **Gallery** — shows photos from reunions and events  
- ⚡ **Static + Fast** — built with Next.js or Astro, served on Vercel  
- 🔒 **Optional Access Control** — simple password protection for family-only viewing  

---

## 🧱 Tech Stack

| Component | Technology | Purpose |
|------------|-------------|----------|
| **Editor** | [Cursor](https://cursor.sh) | AI-assisted code and content editing |
| **Framework** | [Next.js](https://nextjs.org/) or [Astro](https://astro.build/) | Builds the static website |
| **Hosting** | [Vercel (v0)](https://v0.dev) | Fast, free static hosting |
| **Tree Data** | JSON file | Defines family relationships |
| **Content** | Markdown (`.md`) | Stores biographies |
| **Images** | `/public/gallery` | Family photos and reunions |

---

## 🪜 Project Structure

family-website/
├── public/
│ ├── gallery/ # Reunion and event photos
│ ├── favicon.ico
│ └── familyTree.json # Data file for tree visualization
├── src/
│ ├── pages/
│ │ ├── index.tsx # Homepage
│ │ ├── tree.tsx # Family tree visualization
│ │ ├── gallery.tsx # Gallery page
│ │ └── [member].tsx # Individual bio pages
│ ├── content/
│ │ ├── great-grandfather.md
│ │ ├── children/
│ │ │ ├── child1.md
│ │ │ ├── child2.md
│ │ │ └── ...
│ │ └── grandchildren/
│ │ ├── grandchild1.md
│ │ ├── grandchild2.md
│ │ └── ...
│ └── components/
│ ├── Tree.tsx
│ ├── Gallery.tsx
│ └── BioCard.tsx
├── vercel.json # Optional Vercel configuration
├── package.json
└── README.md
