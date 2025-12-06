import { htmlToBlocks } from '@sanity/block-tools'
import { JSDOM } from 'jsdom'
import { Schema } from '@sanity/schema'

// Define a minimal schema for block content
const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
      ],
    },
  ],
})

const blockContentType = defaultSchema
  .get('blogPost')
  .fields.find((field: any) => field.name === 'body').type

/**
 * Convert Markdown to Portable Text
 * Note: Since block-tools parses HTML, we'd typically convert MD -> HTML -> PortableText
 * But for this migration, we'll do a simpler regex-based conversion for common MD patterns
 * or assume the input is simple enough to parse directly.
 * 
 * For better results, we'll use a markdown parser if needed, but for now
 * we'll implement a basic parser that handles paragraphs and headers.
 */
export function convertMarkdownToBlocks(markdown: string): any[] {
  // Remove frontmatter if present
  const content = markdown.replace(/^---[\s\S]*?---\n/, '').trim()

  // Split by double newlines to get blocks
  const chunks = content.split(/\n\n+/)

  return chunks.map(chunk => {
    // Check for headers
    if (chunk.startsWith('#')) {
      const level = chunk.match(/^#+/)?.[0].length || 1
      const text = chunk.replace(/^#+\s*/, '')
      return {
        _type: 'block',
        style: `h${level}`,
        children: [{ _type: 'span', text }],
      }
    }

    // Check for list items
    if (chunk.match(/^[-*]\s/m)) {
      // This is a simplification; proper list handling is complex
      // For now treating lists as text blocks with manual formatting
      return {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: chunk }],
      }
    }

    // Default to normal paragraph
    return {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: chunk.replace(/\n/g, ' ') }],
    }
  })
}

