import type { Brand } from '@/shared/types'

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
    // Use import.meta.env.BASE_URL which Vite sets correctly for both dev and prod
    const base = import.meta.env.BASE_URL || '/'
    // Ensure base ends with / for proper path construction
    const baseUrl = base.endsWith('/') ? base : `${base}/`
    // Construct URL - Vite handles the base path correctly
    const url = `${baseUrl}brands-index.json`
    
    const response = await fetch(url, {
      cache: 'no-cache' // Force fresh fetch in development
    })

    if (!response.ok) {
      throw new Error(`Failed to load brands index: ${response.status} ${response.statusText}`)
    }

    const brands = await response.json() as Brand[]

    brandsCache = brands
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

/**
 * Clears the brands cache (useful for testing)
 */
export function clearCache(): void {
  brandsCache = null
}

