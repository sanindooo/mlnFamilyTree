import { groq } from "next-sanity";

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
    "biography": {
      "content": content,
      "gallery": gallery[]->{
        "_key": _id,
        "asset": image.asset,
        "alt": coalesce(image.alt, title),
        "caption": description,
        "title": title
      }
    },
    "children": children[]-> {
      _id,
      name,
      "slug": slug.current,
      birthDate,
      deathDate,
      photo,
      "biography": {
        "content": content,
        "gallery": gallery[]->{
          "_key": _id,
          "asset": image.asset,
          "alt": coalesce(image.alt, title),
          "caption": description,
          "title": title
        }
      },
      "children": children[]-> {
        _id,
        name,
        "slug": slug.current,
        birthDate,
        deathDate,
        photo,
        "biography": {
          "content": content,
          "gallery": gallery[]->{
            "_key": _id,
            "asset": image.asset,
            "alt": coalesce(image.alt, title),
            "caption": description,
            "title": title
          }
        },
        "children": children[]-> {
          _id,
          name,
          "slug": slug.current,
          birthDate,
          deathDate,
          photo,
          "biography": {
            "content": content,
            "gallery": gallery[]->{
              "_key": _id,
              "asset": image.asset,
              "alt": coalesce(image.alt, title),
              "caption": description,
              "title": title
            }
          }
        }
      }
    }
  }
`;

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
    "biography": {
      _id,
      "title": coalesce(bioTitle, name),
      "slug": slug.current,
      content,
      "gallery": gallery[]->{
        "_key": _id,
        "asset": image.asset,
        "alt": coalesce(image.alt, title),
        "caption": description,
        "title": title
      }
    }
  }
`;

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
`;

// ===== Biography Queries =====

/**
 * Get a biography by slug with full content
 * Now queries the Person document directly
 */
export const biographyBySlugQuery = groq`
  *[_type == "person" && slug.current == $slug][0] {
    _id,
    "title": coalesce(bioTitle, name),
    "slug": slug.current,
    content,
    "gallery": gallery[]->{
      "_key": _id,
      "asset": image.asset,
      "alt": coalesce(image.alt, title),
      "caption": description,
      "title": title
    },
    "person": {
      _id,
      name,
      "slug": slug.current,
      birthDate,
      deathDate,
      photo
    }
  }
`;

/**
 * Get all biographies (for search index)
 * Queries people who have biography content
 */
export const allBiographiesQuery = groq`
  *[_type == "person" && defined(content)] {
    _id,
    "title": coalesce(bioTitle, name),
    "slug": slug.current,
    content,
    "person": {
      name
    }
  } | order(title asc)
`;

/**
 * Get docs index (biographies with their photo galleries)
 */
export const docsIndexQuery = groq`
  *[_type == "person" && defined(content)] {
    "slug": slug.current,
    "title": coalesce(bioTitle, name),
    "photos": (coalesce(gallery, [])[]->).image.asset->url
  } | order(title asc)
`;

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
`;

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
    "galleryImages": galleryImages[]->{
      "_key": _id,
      "asset": image.asset,
      "alt": coalesce(image.alt, title),
      "caption": description,
      "title": title
    },
    order
  }
`;

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
    "tags": tags[]->title
  } | order(_createdAt desc)
`;

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
`;

// ===== Grandchildren Queries =====

/**
 * Get all grandchildren ordered by display order
 */
export const allGrandchildrenQuery = groq`
  *[_type == "grandchild"] {
    _id,
    name,
    "slug": slug.current,
    photo,
    description,
    linkedinUrl,
    twitterUrl,
    order
  } | order(order asc)
`;

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
`;
