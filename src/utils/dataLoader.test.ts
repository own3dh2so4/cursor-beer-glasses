import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mockBrands } from '../test/mocks/mockBrands'

describe('dataLoader', () => {
  beforeEach(async () => {
    // Clear the cache before each test by resetting the module
    vi.resetModules()
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })
  
  afterEach(() => {
    vi.resetModules()
  })

  describe('loadAllBrands', () => {
    it('should load and return all brands', async () => {
      const { loadAllBrands } = await import('./dataLoader')
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands
      })

      const brands = await loadAllBrands()

      expect(brands).toHaveLength(2)
      expect(brands[0].name).toBe('Test Beer 1')
      expect(brands[1].name).toBe('Test Beer 2')
    })

    it('should cache brands after first load', async () => {
      const { loadAllBrands } = await import('./dataLoader')
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands
      })

      const brands1 = await loadAllBrands()
      const brands2 = await loadAllBrands()

      expect(brands1).toBe(brands2)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch errors gracefully', async () => {
      const { loadAllBrands } = await import('./dataLoader')
      
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const brands = await loadAllBrands()

      expect(brands).toEqual([])
    })

    it('should handle non-ok responses', async () => {
      const { loadAllBrands } = await import('./dataLoader')
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const brands = await loadAllBrands()

      expect(brands).toEqual([])
    })

    it('should fetch from correct URL with base path', async () => {
      // Ensure import.meta.env.BASE_URL is set before importing
      if (!import.meta.env) {
        Object.defineProperty(import.meta, 'env', {
          value: { BASE_URL: '/cursor-beer-glasses/' },
          writable: true,
          configurable: true
        })
      }
      
      const { loadAllBrands } = await import('./dataLoader')
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands
      })

      await loadAllBrands()

      const expectedUrl = import.meta.env.BASE_URL 
        ? `${import.meta.env.BASE_URL}brands-index.json` 
        : '/brands-index.json'
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('loadBrandById', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockBrands
      })
    })

    it('should load a specific brand by id', async () => {
      const { loadBrandById } = await import('./dataLoader')
      
      const brand = await loadBrandById('test_beer_1')

      expect(brand).toBeDefined()
      expect(brand.name).toBe('Test Beer 1')
      expect(brand.id).toBe('test_beer_1')
    })

    it('should return undefined for non-existent id', async () => {
      const { loadBrandById } = await import('./dataLoader')
      
      const brand = await loadBrandById('non_existent')

      expect(brand).toBeUndefined()
    })
  })

  describe('getAssetPath', () => {
    it('should generate correct asset path with base URL', async () => {
      const { getAssetPath } = await import('./dataLoader')
      
      const path = getAssetPath('test_beer/logo.png')

      expect(path).toContain('data/test_beer/logo.png')
    })

    it('should handle paths with leading slash', async () => {
      const { getAssetPath } = await import('./dataLoader')
      
      const path = getAssetPath('/test_beer/logo.png')

      expect(path).toContain('data//test_beer/logo.png')
    })

    it('should handle empty path', async () => {
      const { getAssetPath } = await import('./dataLoader')
      
      const path = getAssetPath('')

      expect(path).toContain('data/')
    })
  })
})

