#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import type { Brand } from '../src/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.join(__dirname, '../public/data')
const outputFile = path.join(__dirname, '../public/brands-index.json')

function generateIndex(): void {
  try {
    const brands: Brand[] = []
    const directories = fs.readdirSync(dataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const dir of directories) {
      const yamlPath = path.join(dataDir, dir, 'brand.yaml')
      
      if (fs.existsSync(yamlPath)) {
        try {
          const content = fs.readFileSync(yamlPath, 'utf8')
          const brandData = yaml.load(content) as Brand
          
          if (brandData && brandData.id) {
            brands.push(brandData)
          }
        } catch (err) {
          const error = err as Error
          console.error(`Error parsing ${dir}/brand.yaml:`, error.message)
        }
      }
    }

    // Sort brands by name
    brands.sort((a, b) => a.name.localeCompare(b.name))

    // Write to output file
    fs.writeFileSync(outputFile, JSON.stringify(brands, null, 2), 'utf8')
    
    console.log(`✓ Generated index with ${brands.length} brands`)
    console.log(`  Output: ${outputFile}`)
  } catch (err) {
    const error = err as Error
    console.error('Error generating index:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIndex()
}

export { generateIndex }

