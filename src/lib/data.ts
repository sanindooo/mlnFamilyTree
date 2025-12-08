import { Biography, DocEntry, Person, MLNStory } from '@/types';
import { 
  getFamilyTreeFromSanity, 
  getBiographyFromSanity, 
  getAllBiographiesFromSanity,
  getDocsIndexFromSanity,
  getAllMLNStoriesFromSanity,
  getMLNStoryFromSanity
} from '@/sanity/lib/fetch';

/**
 * SERVER-SIDE: Loads the family tree JSON
 */
export async function getFamilyTree(): Promise<Person | null> {
  return getFamilyTreeFromSanity();
}

/**
 * SERVER-SIDE: Loads the docs index
 */
export async function getDocsIndex(): Promise<DocEntry[]> {
  return getDocsIndexFromSanity();
}

/**
 * SERVER-SIDE: Loads a biography by slug
 */
export async function getBiography(slug: string): Promise<Biography | null> {
  if (!slug || slug === 'undefined') return null;

  const data = await getBiographyFromSanity(slug);
  if (data) {
    return {
      ...data.biography,
      portableTextContent: data.portableTextContent, // New field for Portable Text
      gallery: data.gallery // New field for gallery images
    };
  }
  
  return null;
}

/**
 * SERVER-SIDE: Gets all biographies (for search index)
 */
export async function getAllBiographies(): Promise<Biography[]> {
  return getAllBiographiesFromSanity();
}

/**
 * SERVER-SIDE: Gets all MLN stories
 */
export async function getAllMLNStories(): Promise<MLNStory[]> {
  return getAllMLNStoriesFromSanity();
}

/**
 * SERVER-SIDE: Gets a single MLN story by slug
 */
export async function getMLNStory(slug: string): Promise<MLNStory | null> {
  return getMLNStoryFromSanity(slug);
}
