import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest'
import { mockBrand1, mockBrand2 } from '@/test/mocks/mockBrands'
import { loadAllBrands, loadBrandById, getAssetPath, clearCache } from '@/shared/utils/dataLoader'

const mockBrands = [mockBrand1, mockBrand2]

describe('dataLoader', () => {
  beforeEach(() => {
    // Clear cache and mocks before each test
    clearCache()
    vi.clearAllMocks()
    global.fetch = vi.fn() as Mock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadAllBrands', () => {
    it('should load and return all brands', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands
      })

      const brands = await loadAllBrands()

      expect(brands).toHaveLength(2)
      expect(brands[0]?.name).toBe('Test Beer 1')
      expect(brands[1]?.name).toBe('Test Beer 2')
    })

    it('should cache brands after first load', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands
      })

      const brands1 = await loadAllBrands()
      const brands2 = await loadAllBrands()

      expect(brands1).toBe(brands2)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'))

      const brands = await loadAllBrands()

      expect(brands).toEqual([])
    })

    it('should handle non-ok responses', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const brands = await loadAllBrands()

      expect(brands).toEqual([])
    })

    it('should fetch from correct URL with base path', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands
      })

      await loadAllBrands()

      const expectedUrl = import.meta.env.BASE_URL
        ? `${import.meta.env.BASE_URL}brands-index.json`
        : '/brands-index.json'
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, { cache: 'no-cache' })
    })
  })

  describe('loadBrandById', () => {
    beforeEach(() => {
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: async () => mockBrands
      })
    })

    it('should load a specific brand by id', async () => {
      const brand = await loadBrandById('test_beer_1')

      expect(brand).toBeDefined()
      expect(brand?.name).toBe('Test Beer 1')
      expect(brand?.id).toBe('test_beer_1')
    })

    it('should return undefined for non-existent id', async () => {
      const brand = await loadBrandById('non_existent')

      expect(brand).toBeUndefined()
    })
  })

  describe('getAssetPath', () => {
    it('should generate correct asset path with base URL', () => {
      const path = getAssetPath('test_beer/logo.png')

      expect(path).toContain('data/test_beer/logo.png')
    })

    it('should handle paths with leading slash', () => {
      const path = getAssetPath('/test_beer/logo.png')

      expect(path).toContain('data//test_beer/logo.png')
    })

    it('should handle empty path', () => {
      const path = getAssetPath('')

      expect(path).toContain('data/')
    })
  })
})

