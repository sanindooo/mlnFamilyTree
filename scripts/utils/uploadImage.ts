import fs from 'fs-extra'
import path from 'path'
import { SanityClient } from '@sanity/client'

const MAPPING_FILE = path.join(process.cwd(), 'scripts', '.image-mapping.json')

interface ImageMapping {
  [originalPath: string]: string
}

// Load existing mapping
let imageMapping: ImageMapping = {}
if (fs.existsSync(MAPPING_FILE)) {
  try {
    imageMapping = fs.readJsonSync(MAPPING_FILE)
  } catch (e) {
    console.warn('Could not read existing image mapping')
  }
}

/**
 * Uploads an image to Sanity or returns existing asset ID
 */
export async function uploadImage(
  client: SanityClient,
  imagePath: string,
  isDryRun: boolean = false
): Promise<string | null> {
  // Normalize path
  const cleanPath = imagePath.startsWith('./') ? imagePath.slice(2) : imagePath
  
  // Check cache first
  if (imageMapping[cleanPath]) {
    console.log(`📦 Using cached image: ${cleanPath}`)
    return imageMapping[cleanPath]
  }

  // Construct full path
  // Handle both relative paths (from public) and absolute paths
  const fullPath = path.isAbsolute(cleanPath) 
    ? cleanPath 
    : path.join(process.cwd(), 'public', cleanPath)

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Image not found: ${fullPath}`)
    return null
  }

  if (isDryRun) {
    console.log(`📸 [Dry Run] Would upload: ${cleanPath}`)
    return `image-dryrun-${path.basename(cleanPath)}`
  }

  try {
    console.log(`⬆️ Uploading image: ${cleanPath}`)
    const buffer = await fs.readFile(fullPath)
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(cleanPath)
    })

    // Save to cache
    imageMapping[cleanPath] = asset._id
    await fs.writeJson(MAPPING_FILE, imageMapping, { spaces: 2 })

    return asset._id
  } catch (error) {
    console.error(`❌ Error uploading ${cleanPath}:`, error)
    return null
  }
}

