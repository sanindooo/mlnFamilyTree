import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
	console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
	process.exit(1);
}

if (!token) {
	console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
	console.error(
		"Please add a Sanity API token with write permissions to .env.local"
	);
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: "2024-01-01",
	token,
	useCdn: false,
});

async function migrateGalleries() {
	console.log("Starting gallery migration...");

	// 1. Migrate Person Galleries
	const people =
		await client.fetch(`*[_type == "person" && defined(gallery) && count(gallery) > 0] {
    _id,
    name,
    gallery
  }`);

	console.log(`Found ${people.length} people with galleries to migrate`);

	for (const person of people) {
		console.log(`Migrating gallery for ${person.name}...`);

		// Check if gallery is already references (has _ref)
		if (person.gallery[0]._type === "reference") {
			console.log(`Skipping ${person.name} - already migrated`);
			continue;
		}

		const newGalleryRefs = [];

		for (let i = 0; i < person.gallery.length; i++) {
			const item = person.gallery[i];
			if (!item.asset) continue;

			// Create new galleryImage document
			const galleryImageDoc = {
				_type: "galleryImage",
				title: item.caption || `${person.name} - Photo ${i + 1}`,
				description: item.caption,
				image: {
					_type: "image",
					asset: item.asset,
					alt: item.alt || item.caption || `${person.name} photo`,
					hotspot: item.hotspot,
				},
				relatedPeople: [
					{
						_type: "reference",
						_ref: person._id,
					},
				],
			};

			try {
				const created = await client.create(galleryImageDoc);
				console.log(`  Created gallery image: ${created.title}`);

				newGalleryRefs.push({
					_key: uuidv4(),
					_type: "reference",
					_ref: created._id,
				});
			} catch (err) {
				console.error(
					`  Error creating gallery image for ${person.name}:`,
					err
				);
			}
		}

		if (newGalleryRefs.length > 0) {
			await client.patch(person._id).set({ gallery: newGalleryRefs }).commit();
			console.log(`  Updated person ${person.name} with new references`);
		}
	}

	// 2. Migrate MLN Stories
	const stories =
		await client.fetch(`*[_type == "mlnStory" && defined(galleryImages) && count(galleryImages) > 0] {
    _id,
    title,
    galleryImages
  }`);

	console.log(`\nFound ${stories.length} stories with galleries to migrate`);

	for (const story of stories) {
		console.log(`Migrating gallery for ${story.title}...`);

		// Check if gallery is already references
		if (story.galleryImages[0]._type === "reference") {
			console.log(`Skipping ${story.title} - already migrated`);
			continue;
		}

		const newGalleryRefs = [];

		for (let i = 0; i < story.galleryImages.length; i++) {
			const item = story.galleryImages[i];
			if (!item.asset) continue;

			// Create new galleryImage document
			const galleryImageDoc = {
				_type: "galleryImage",
				title: item.caption || `${story.title} - Photo ${i + 1}`,
				description: item.caption,
				image: {
					_type: "image",
					asset: item.asset,
					alt: item.alt || item.caption || `${story.title} photo`,
					hotspot: item.hotspot,
				},
				// We can't link stories in relatedPeople easily as it expects person type
				// but we could add a tags or just leave it loosely coupled
				tags: [
					{
						_type: "reference",
						_ref: "category-mln-story", // Assuming this might exist or just leave empty
						_weak: true,
					},
				],
			};

			try {
				const created = await client.create(galleryImageDoc);
				console.log(`  Created gallery image: ${created.title}`);

				newGalleryRefs.push({
					_key: uuidv4(),
					_type: "reference",
					_ref: created._id,
				});
			} catch (err) {
				console.error(
					`  Error creating gallery image for ${story.title}:`,
					err
				);
			}
		}

		if (newGalleryRefs.length > 0) {
			await client
				.patch(story._id)
				.set({ galleryImages: newGalleryRefs })
				.commit();
			console.log(`  Updated story ${story.title} with new references`);
		}
	}

	console.log("\nMigration complete!");
}

migrateGalleries().catch(console.error);
