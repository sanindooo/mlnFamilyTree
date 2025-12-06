# Phase 2: Headless CMS Migration (Sanity.io)

This document outlines the plan to migrate the Martin Luther Nsibirwa Virtual Museum from static JSON/Markdown files to Sanity.io.

## Why Sanity?
- **Structured Content**: Define schemas for People, Biographies, and Gallery Images.
- **Real-time Editing**: Family members can edit content without touching code.
- **Image Management**: Built-in image pipeline (CDN, cropping, optimization).
- **Flexible Relationships**: Easily link parents, children, and stories.

## Schema Design

### 1. Person (`person`)
Represents a node in the family tree.
- `name` (string)
- `slug` (slug) - Unique ID
- `birthDate` (date/string)
- `deathDate` (date/string)
- `portrait` (image)
- `parents` (array of references to `person`)
- `children` (array of references to `person`) - *Computed or explicit? Explicit allows ordering.*
- `bioLink` (reference to `biography`) - *Optional, if they have a full bio page.*

### 2. Biography (`biography`)
Rich text content for a family member.
- `title` (string)
- `slug` (slug) - Matches the person's slug usually.
- `person` (reference to `person`)
- `content` (Portable Text) - Replaces Markdown.
- `gallery` (array of images)

### 3. Gallery Image (`galleryImage`)
For the main gallery page.
- `image` (image)
- `title` (string)
- `description` (text)
- `tags` (array of strings)

## Migration Strategy

1.  **Initialize Sanity Project**:
    ```bash
    npm create sanity@latest
    ```
    Set up in a `/sanity` studio folder or integrated if using Next.js app router embedded studio.

2.  **Define Schemas**:
    Create schema files in Sanity mimicking the structure above.

3.  **Import Data**:
    Write a script to read `public/data/familyTree.json`, `public/data/docs.json`, and `public/content/*.md`.
    - Map JSON nodes to `person` documents.
    - Map Markdown content to Portable Text (using `@portabletext/to-portable-text` or similar).
    - Upload images from `public/members/` etc. to Sanity asset pipeline.

4.  **Update Next.js Data Layer**:
    - Replace `src/lib/data.ts` functions (`getFamilyTree`, `getBiography`) to fetch from Sanity Client (`next-sanity`).
    - Update `getFamilyTree` to reconstruct the hierarchical tree from flat Sanity documents (since Sanity is flat database). Use `groq` queries for this.

5.  **Webhooks & ISR**:
    - Configure Sanity webhooks to trigger Next.js revalidation when content changes.
    - Update `revalidate` settings in `page.tsx` or `fetch` calls.

## Component Updates
- Update `BiographyContent` to use `<PortableText />` component instead of `dangerouslySetInnerHTML`.
- Update `InteractiveTree` to handle data shape if it changes (though we should map Sanity response to our existing `Person` type to minimize frontend changes).

## Timeline
- **Week 1**: Setup Sanity & Schemas.
- **Week 2**: Write Import Scripts & Migrate Data.
- **Week 3**: Update Frontend to fetch from Sanity.
- **Week 4**: Testing & Training family editors.

