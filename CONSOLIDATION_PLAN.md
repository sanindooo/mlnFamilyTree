# Plan: Consolidate Gallery Management to Person/Story

This plan outlines how to remove "tagging" from Gallery Images and rely solely on the "Photo Gallery" list within Person and Story documents.

## 1. Migration Strategy (Data Safety)

Before removing any fields, we must preserve existing tags by moving them to the Person/Story documents.

### Script: `scripts/migrate-tags-to-refs.ts`

```typescript
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN, // Requires write token
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  console.log("Fetching tagged gallery images...");
  const images = await client.fetch(`
    *[_type == "galleryImage" && (count(relatedPeople) > 0 || count(relatedStories) > 0)] {
      _id,
      relatedPeople[]->_id,
      relatedStories[]->_id
    }
  `);

  for (const img of images) {
    // 1. Move relatedPeople tags to Person.gallery
    if (img.relatedPeople) {
      for (const personId of img.relatedPeople) {
        console.log(`Linking image ${img._id} to Person ${personId}`);
        await client
          .patch(personId)
          .setIfMissing({ gallery: [] })
          .append("gallery", [
            {
              _key: uuidv4(),
              _type: "reference",
              _ref: img._id,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
      }
    }

    // 2. Move relatedStories tags to Story.galleryImages
    if (img.relatedStories) {
      for (const storyId of img.relatedStories) {
        console.log(`Linking image ${img._id} to Story ${storyId}`);
        await client
          .patch(storyId)
          .setIfMissing({ galleryImages: [] })
          .append("galleryImages", [
            {
              _key: uuidv4(),
              _type: "reference",
              _ref: img._id,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
      }
    }
  }
  
  console.log("Migration complete.");
}

run();
```

## 2. Schema Cleanup

Modify `src/sanity/schemas/galleryImage.ts`:
- Remove `relatedPeople` field
- Remove `relatedStories` field

## 3. Code Simplification

### `src/sanity/lib/queries.ts`
Revert queries to simple references:

```groq
// Revert biographyBySlugQuery
"gallery": gallery[]->{ ... }

// Revert mlnStoryBySlugQuery
"galleryImages": galleryImages[]->{ ... }
```

### `src/sanity/lib/adapters.ts`
- Remove merging logic (`manualGallery`, `taggedGallery`)
- Remove deduplication logic
- Revert to simple direct mapping

### `src/types/index.ts`
- Remove `manualGallery` and `taggedGallery` properties

