import { PortableText, PortableTextComponents } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlForImage } from '../lib/adapters'

interface PortableTextRendererProps {
  value: PortableTextBlock[]
}

/**
 * Custom components for rendering Portable Text with Tailwind prose styling
 */
const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-deep-umber mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-deep-umber mb-3 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl md:text-2xl font-bold text-deep-umber mb-2 mt-6">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-deep-umber">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-burgundy pl-4 italic my-6 text-deep-umber/80">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-deep-umber">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-deep-umber">{children}</em>
    ),
    link: ({ children, value }) => {
      const href = value?.href || ''
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-burgundy hover:underline"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      
      const imageUrl = urlForImage(value.asset).url()
      
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={value.alt || 'Image'}
              fill
              className="object-cover sepia-[.4]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sm text-center text-deep-umber/70 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  )
}

