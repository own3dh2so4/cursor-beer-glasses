/**
 * Type definitions for the Beer Glass Collection app
 */

/**
 * Represents a single beer glass in the collection
 */
export interface Glass {
  id: string
  name: string
  got: 'buy' | 'present' | 'gift' | 'steal' | string
  bought_country?: string
  bought_city?: string
  got_from?: string
  photo?: string
  map?: string
}

/**
 * Represents a beer brand with its metadata and glasses
 */
export interface Brand {
  id: string
  name: string
  from_country: string
  from_city?: string
  brewery_location?: string
  website?: string
  logo: string
  name_image?: string
  map?: string
  glasses: Glass[]
}

/**
 * Filter state for the gallery
 */
export interface Filters {
  search: string
  country: string
  glassCount: '' | 'single' | 'multiple'
  gotMethod: '' | 'buy' | 'present' | 'gift' | 'steal' | string
  boughtCountry: string
  sort: 'name-asc' | 'name-desc' | 'country-asc' | 'glasses-desc' | 'glasses-asc'
}

/**
 * Available filter options based on current data
 */
export interface FilterOptions {
  countries: string[]
  gotMethods: string[]
  boughtCountries: string[]
}

/**
 * Result from the useImageBrightness hook
 */
export interface BrightnessResult {
  backgroundColor: string
  textColor: string
  isAnalyzing: boolean
}

