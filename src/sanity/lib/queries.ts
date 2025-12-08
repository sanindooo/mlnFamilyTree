import { groq } from 'next-sanity'

// ===== Person Queries =====

/**
 * Get the family tree root person (Martin Luther Nsibirwa)
 * with all children recursively populated
 */
export const familyTreeQuery = groq`
  *[_type == "person" && slug.current == "martin-luther-nsibirwa"][0] {
    _id,
    name,
    "slug": slug.current,
    birthDate,
    deathDate,
    photo,
    biography->{
      content,
      gallery
    },
    "children": children[]-> {
      _id,
      name,
      "slug": slug.current,
      birthDate,
      deathDate,
      photo,
      biography->{
        content,
        gallery
      },
      "children": children[]-> {
        _id,
        name,
        "slug": slug.current,
        birthDate,
        deathDate,
        photo,
        biography->{
          content,
          gallery
        },
        "children": children[]-> {
          _id,
          name,
          "slug": slug.current,
          birthDate,
          deathDate,
          photo,
          biography->{
            content,
            gallery
          }
        }
      }
    }
  }
`

/**
 * Get a single person by slug
 */
export const personBySlugQuery = groq`
  *[_type == "person" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    birthDate,
    deathDate,
    photo,
    biography->{
      _id,
      title,
      slug,
      content,
      gallery
    }
  }
`

/**
 * Get all people (for sitemap, search indexing, etc.)
 */
export const allPeopleQuery = groq`
  *[_type == "person"] {
    _id,
    name,
    "slug": slug.current,
    birthDate,
    deathDate
  } | order(name asc)
`

// ===== Biography Queries =====

/**
 * Get a biography by slug with full content
 */
export const biographyBySlugQuery = groq`
  *[_type == "biography" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    gallery,
    person->{
      _id,
      name,
      slug,
      birthDate,
      deathDate,
      photo
    }
  }
`

/**
 * Get all biographies (for search index)
 */
export const allBiographiesQuery = groq`
  *[_type == "biography"] {
    _id,
    title,
    slug,
    content,
    person->{
      name
    }
  } | order(title asc)
`

/**
 * Get docs index (biographies with their photo galleries)
 */
export const docsIndexQuery = groq`
  *[_type == "biography"] {
    "slug": slug.current,
    title,
    "photos": gallery[].asset->url
  } | order(title asc)
`

// ===== MLN Story Queries =====

/**
 * Get all MLN stories ordered by display order
 */
export const allMLNStoriesQuery = groq`
  *[_type == "mlnStory"] {
    _id,
    title,
    slug,
    description,
    heroImage,
    order
  } | order(order asc)
`

/**
 * Get a single MLN story by slug
 */
export const mlnStoryBySlugQuery = groq`
  *[_type == "mlnStory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    heroImage,
    content,
    galleryImages,
    order
  }
`

// ===== Gallery Queries =====

/**
 * Get all gallery images
 */
export const allGalleryImagesQuery = groq`
  *[_type == "galleryImage"] {
    _id,
    title,
    image,
    description,
    "tags": tags[]->title,
    relatedPeople[]-> {
      _id,
      name,
      "slug": slug.current
    }
  } | order(_createdAt desc)
`

/**
 * Get gallery images by tag
 */
export const galleryImagesByTagQuery = groq`
  *[_type == "galleryImage" && $tag in tags] {
    _id,
    title,
    image,
    description,
    tags
  } | order(_createdAt desc)
`

// ===== Timeline Queries =====

/**
 * Get all timeline events ordered by display order
 */
export const timelineEventsQuery = groq`
  *[_type == "timelineEvent"] {
    year,
    title,
    description,
    displayOrder
  } | order(displayOrder asc)
`
