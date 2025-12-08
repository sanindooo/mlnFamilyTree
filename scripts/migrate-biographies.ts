import { client } from './utils/sanityClient';

async function migrateBiographies() {
  console.log('Starting biography migration...');

  try {
    // 1. Fetch all biographies
    const biographies = await client.fetch(`
      *[_type == "biography"] {
        _id,
        title,
        content,
        gallery,
        person {
          _ref
        }
      }
    `);

    console.log(`Found ${biographies.length} biographies to migrate.`);

    // 2. Iterate and update
    for (const bio of biographies) {
      if (!bio.person?._ref) {
        console.warn(`Biography "${bio.title}" (${bio._id}) has no person reference. Skipping.`);
        continue;
      }

      const personId = bio.person._ref;
      
      console.log(`Migrating bio "${bio.title}" to person ${personId}...`);

      try {
        await client
          .patch(personId)
          .set({
            bioTitle: bio.title,
            content: bio.content,
            gallery: bio.gallery,
          })
          .commit();
        
        console.log(`Successfully updated person ${personId}`);
      } catch (err) {
        console.error(`Failed to update person ${personId}:`, err);
      }
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateBiographies();

