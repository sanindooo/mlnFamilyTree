import fs from 'fs-extra'
import path from 'path'
import { client } from './utils/sanityClient'
import { uploadImage } from './utils/uploadImage'
import { convertMarkdownToBlocks } from './utils/markdownToPortableText'

// Define paths
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const DATA_DIR = path.join(PUBLIC_DIR, 'data')
const CONTENT_DIR = path.join(PUBLIC_DIR, 'content')

// Check for dry run flag
const isDryRun = process.argv.includes('--dry-run')

async function main() {
  console.log(`🚀 Starting migration... ${isDryRun ? '(DRY RUN)' : ''}`)

  try {
    // 1. Load Source Data
    console.log('📖 Reading source data...')
    const familyTree = await fs.readJson(path.join(DATA_DIR, 'familyTree.json'))
    const docsIndex = await fs.readJson(path.join(DATA_DIR, 'docs.json'))
    
    // Map to store created person IDs
    const personIdMap: Record<string, string> = {}

    // 2. Migrate People
    console.log('\n👥 Migrating People...')
    
    // Helper to process a person node recursively
    async function processPerson(node: any, parentId: string | null = null) {
      const slug = node.slug || node.id
      const name = node.name
      
      console.log(`Processing: ${name}`)

      // Upload photo if exists
      let photoAssetId = null
      if (node.photo) {
        photoAssetId = await uploadImage(client, node.photo, isDryRun)
      }

      // Prepare document
      const doc: any = {
        _type: 'person',
        name: name,
        slug: { current: slug },
        birthDate: node.birthDate,
        deathDate: node.deathDate,
      }

      if (photoAssetId) {
        doc.photo = {
          _type: 'image',
          asset: { _type: 'reference', _ref: photoAssetId }
        }
      }

      // Create person document
      let sanityId = `person-${slug}`
      
      if (!isDryRun) {
        const created = await client.createOrReplace({
          _id: sanityId,
          ...doc
        })
        sanityId = created._id
      }
      
      personIdMap[slug] = sanityId

      // Process children
      if (node.children && node.children.length > 0) {
        const childrenIds: string[] = []
        
        for (const child of node.children) {
          const childId = await processPerson(child, sanityId)
          childrenIds.push(childId)
        }

        // Update parent with children references
        if (!isDryRun && childrenIds.length > 0) {
          await client.patch(sanityId)
            .set({
              children: childrenIds.map(id => ({
                _type: 'reference',
                _ref: id,
                _key: id
              }))
            })
            .commit()
        }
      }

      return sanityId
    }

    // Start with root person
    await processPerson(familyTree)

    // 3. Migrate Biographies
    console.log('\n📜 Migrating Biographies...')
    const bioFiles = await fs.readdir(CONTENT_DIR)
    
    for (const file of bioFiles) {
      if (!file.endsWith('.md')) continue
      
      const slug = file.replace('.md', '')
      const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8')
      
      // Parse frontmatter (simple regex)
      const titleMatch = content.match(/title:\s*(.*)/)
      const title = titleMatch ? titleMatch[1].trim() : slug
      
      console.log(`Processing Bio: ${title}`)
      
      // Convert content
      const blocks = convertMarkdownToBlocks(content)

      // Find related person
      const personId = personIdMap[slug]
      
      // Upload gallery images for this bio
      const docEntry = docsIndex.find((d: any) => d.slug === slug)
      const galleryImages = []
      
      if (docEntry && docEntry.photos) {
        for (const photoPath of docEntry.photos) {
          const assetId = await uploadImage(client, photoPath, isDryRun)
          if (assetId) {
            // Create separate Gallery Image document
            const galleryDoc = {
              _type: 'galleryImage',
              title: `${title} - Gallery`,
              image: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
              },
              relatedPeople: personId ? [{ _type: 'reference', _ref: personId }] : [],
              tags: ['Biography Gallery']
            }

            if (!isDryRun) {
              await client.create(galleryDoc)
            }

            // Also add to biography's internal gallery
            galleryImages.push({
              _key: assetId,
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId }
            })
          }
        }
      }

      const bioDoc: any = {
        _type: 'biography',
        _id: `biography-${slug}`,
        title,
        slug: { current: slug },
        content: blocks,
        gallery: galleryImages
      }

      if (personId) {
        bioDoc.person = { _type: 'reference', _ref: personId }
      }

      if (!isDryRun) {
        await client.createOrReplace(bioDoc)
        
        // Link person back to biography
        if (personId) {
          await client.patch(personId)
            .set({ biography: { _type: 'reference', _ref: bioDoc._id } })
            .commit()
        }
      }
    }

    // 4. Migrate Timeline Events
    console.log('\n⏳ Migrating Timeline Events...')
    const timelineEvents = [
      { year: "1883", title: "Beginnings", description: "Born in Buganda Kingdom during a transformative period in Uganda's history. A time when tradition and change collided.", displayOrder: 1 },
      { year: "1920s", title: "Ascent", description: "Rose to prominence as a respected leader and advocate for his community. His voice carried weight in rooms where decisions were made.", displayOrder: 2 },
      { year: "1930s–1940s", title: "Service", description: "Served in the Legislative Council, working tirelessly for social justice and development. His dedication shaped the nation's course.", displayOrder: 3 },
      { year: "1945", title: "Legacy", description: "Tragically assassinated, leaving a powerful legacy that continues to inspire. His memory endures in the hearts of those who knew his work.", displayOrder: 4 },
      { year: "Present Day", title: "Remembrance", description: "Remembered as a hero and pioneer whose contributions shaped modern Uganda.", displayOrder: 5 },
    ]

    for (const event of timelineEvents) {
      console.log(`Processing Event: ${event.year} - ${event.title}`)
      
      const eventDoc = {
        _type: 'timelineEvent',
        ...event
      }

      if (!isDryRun) {
        await client.create(eventDoc)
      }
    }

    console.log('\n✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()

