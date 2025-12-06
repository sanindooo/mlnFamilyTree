import { defineField, defineType } from 'sanity'

export const personType = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'birthDate',
      title: 'Birth Date',
      type: 'string',
      description: 'Can be a year (e.g., "1883") or full date (e.g., "1929-05-10")',
    }),
    defineField({
      name: 'deathDate',
      title: 'Death Date',
      type: 'string',
      description: 'Can be a year (e.g., "1945") or full date',
    }),
    defineField({
      name: 'photo',
      title: 'Portrait Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'children',
      title: 'Children',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }],
        },
      ],
      description: 'References to this person\'s children',
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'reference',
      to: [{ type: 'biography' }],
      description: 'Link to the full biography document',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'birthDate',
      media: 'photo',
    },
  },
})

