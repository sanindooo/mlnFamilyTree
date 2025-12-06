import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { apiVersion, dataset, projectId } from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Martin Luther Nsibirwa Museum',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})

