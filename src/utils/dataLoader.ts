import type { Brand } from '../types'

// This will hold all the brand data loaded from the JSON index
let brandsCache: Brand[] | null = null

/**
 * Loads all brand data from the pre-generated JSON index
 * The index is generated at build time from all YAML files
 */
export async function loadAllBrands(): Promise<Brand[]> {
  if (brandsCache) {
    return brandsCache
  }

  try {
    const base = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${base}brands-index.json`)
    
    if (!response.ok) {
      throw new Error(`Failed to load brands index: ${response.status}`)
    }
    
    const brands = await response.json() as Brand[]
    
    brandsCache = brands
    console.log(`✓ Loaded ${brands.length} brands`)
    return brands
  } catch (error) {
    console.error('Error loading brand data:', error)
    return []
  }
}

/**
 * Loads a single brand by ID
 */
export async function loadBrandById(id: string): Promise<Brand | undefined> {
  const brands = await loadAllBrands()
  return brands.find(brand => brand.id === id)
}

/**
 * Gets the full path for an asset (image, logo, etc.)
 */
export function getAssetPath(relativePath: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}data/${relativePath}`
}

