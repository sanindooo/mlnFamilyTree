import { client } from '../client'
import {
  familyTreeQuery,
  biographyBySlugQuery,
  allBiographiesQuery,
  docsIndexQuery,
  allGalleryImagesQuery,
  timelineEventsQuery,
  allMLNStoriesQuery,
  mlnStoryBySlugQuery,
} from './queries'
import { adaptFamilyTree, adaptSanityBiography, adaptSanityMLNStory } from './adapters'
import { Person, Biography, DocEntry, MLNStory } from '@/types'

/**
 * Fetch the family tree from Sanity
 */
export async function getFamilyTreeFromSanity(): Promise<Person | null> {
  try {
    const data = await client.fetch(familyTreeQuery)
    if (!data) return null
    return adaptFamilyTree(data)
  } catch (error) {
    console.error('Error fetching family tree from Sanity:', error)
    return null
  }
}

/**
 * Fetch a biography by slug from Sanity
 * Returns both the adapted Biography and the raw Sanity data (for PortableText)
 */
export async function getBiographyFromSanity(slug: string): Promise<{
  biography: Biography
  portableTextContent: any
  gallery: any
} | null> {
  try {
    const data = await client.fetch(biographyBySlugQuery, { slug })
    if (!data) return null
    
    return {
      biography: adaptSanityBiography(data),
      portableTextContent: data.content,
      gallery: data.gallery,
    }
  } catch (error) {
    console.error(`Error fetching biography ${slug} from Sanity:`, error)
    return null
  }
}

/**
 * Fetch all biographies from Sanity (for search indexing)
 */
export async function getAllBiographiesFromSanity(): Promise<Biography[]> {
  try {
    const data = await client.fetch(allBiographiesQuery)
    if (!data) return []
    
    return data.map((bio: any) => adaptSanityBiography(bio))
  } catch (error) {
    console.error('Error fetching all biographies from Sanity:', error)
    return []
  }
}

/**
 * Fetch docs index from Sanity
 */
export async function getDocsIndexFromSanity(): Promise<DocEntry[]> {
  try {
    const data = await client.fetch(docsIndexQuery)
    return data || []
  } catch (error) {
    console.error('Error fetching docs index from Sanity:', error)
    return []
  }
}

/**
 * Fetch gallery images from Sanity
 */
export async function getGalleryImagesFromSanity(): Promise<any[]> {
  try {
    const data = await client.fetch(allGalleryImagesQuery)
    return data || []
  } catch (error) {
    console.error('Error fetching gallery images from Sanity:', error)
    return []
  }
}

/**
 * Fetch timeline events from Sanity
 */
export async function getTimelineEventsFromSanity(): Promise<any[]> {
  try {
    const data = await client.fetch(timelineEventsQuery)
    return data || []
  } catch (error) {
    console.error('Error fetching timeline events from Sanity:', error)
    return []
  }
}

/**
 * Fetch all MLN stories from Sanity
 */
export async function getAllMLNStoriesFromSanity(): Promise<MLNStory[]> {
  try {
    const data = await client.fetch(allMLNStoriesQuery)
    if (!data) return []
    return data
      .map(adaptSanityMLNStory)
      .filter((story: MLNStory) => story.slug)
  } catch (error) {
    console.error('Error fetching MLN stories from Sanity:', error)
    return []
  }
}

/**
 * Fetch a single MLN story by slug from Sanity
 */
export async function getMLNStoryFromSanity(slug: string): Promise<MLNStory | null> {
  try {
    const data = await client.fetch(mlnStoryBySlugQuery, { slug })
    if (!data) return null
    return adaptSanityMLNStory(data)
  } catch (error) {
    console.error(`Error fetching MLN story ${slug} from Sanity:`, error)
    return null
  }
}
