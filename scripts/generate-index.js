#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.join(__dirname, '../public/data')
const outputFile = path.join(__dirname, '../public/brands-index.json')

function generateIndex() {
  try {
    const brands = []
    const directories = fs.readdirSync(dataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const dir of directories) {
      const yamlPath = path.join(dataDir, dir, 'brand.yaml')
      
      if (fs.existsSync(yamlPath)) {
        try {
          const content = fs.readFileSync(yamlPath, 'utf8')
          const brandData = yaml.load(content)
          
          if (brandData && brandData.id) {
            brands.push(brandData)
          }
        } catch (err) {
          console.error(`Error parsing ${dir}/brand.yaml:`, err.message)
        }
      }
    }

    // Sort brands by name
    brands.sort((a, b) => a.name.localeCompare(b.name))

    // Write index file
    fs.writeFileSync(outputFile, JSON.stringify(brands, null, 2))
    console.log(`✓ Generated index with ${brands.length} brands`)
    console.log(`  Output: ${outputFile}`)
  } catch (error) {
    console.error('Error generating index:', error)
    process.exit(1)
  }
}

generateIndex()

