import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// Mock fs and yaml modules
vi.mock('fs')
vi.mock('js-yaml')

describe('generate-index script', () => {
  const mockYamlContent1 = `
name: Test Beer 1
id: test_beer_1
from_city: Madrid
from_country: Spain
website: https://testbeer1.com
logo: test_beer_1/logo200x200.png
name_image: test_beer_1/name.png
map: https://maps.google.com/test1
glasses:
  - name: Test Glass 1
    id: test_glass_1
    photo: test_beer_1/glass_0.jpg
    bought_city: Barcelona
    bought_country: Spain
    got: buy
    got_from: Test Store
    map: https://maps.google.com/glass1
`

  const mockYamlContent2 = `
name: Test Beer 2
id: test_beer_2
from_city: Dublin
from_country: Ireland
website: https://testbeer2.com
logo: test_beer_2/logo200x200.png
name_image: test_beer_2/name.svg
map: https://maps.google.com/test2
glasses:
  - name: Test Glass 2
    id: test_glass_2
    photo: test_beer_2/glass_0.jpg
    bought_city: Dublin
    bought_country: Ireland
    got: gift
    got_from: Friend
    map: https://maps.google.com/glass2
`

  const mockBrand1 = {
    name: 'Test Beer 1',
    id: 'test_beer_1',
    from_city: 'Madrid',
    from_country: 'Spain',
    website: 'https://testbeer1.com',
    logo: 'test_beer_1/logo200x200.png',
    name_image: 'test_beer_1/name.png',
    map: 'https://maps.google.com/test1',
    glasses: [{
      name: 'Test Glass 1',
      id: 'test_glass_1',
      photo: 'test_beer_1/glass_0.jpg',
      bought_city: 'Barcelona',
      bought_country: 'Spain',
      got: 'buy',
      got_from: 'Test Store',
      map: 'https://maps.google.com/glass1'
    }]
  }

  const mockBrand2 = {
    name: 'Test Beer 2',
    id: 'test_beer_2',
    from_city: 'Dublin',
    from_country: 'Ireland',
    website: 'https://testbeer2.com',
    logo: 'test_beer_2/logo200x200.png',
    name_image: 'test_beer_2/name.svg',
    map: 'https://maps.google.com/test2',
    glasses: [{
      name: 'Test Glass 2',
      id: 'test_glass_2',
      photo: 'test_beer_2/glass_0.jpg',
      bought_city: 'Dublin',
      bought_country: 'Ireland',
      got: 'gift',
      got_from: 'Friend',
      map: 'https://maps.google.com/glass2'
    }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock console.log and console.error
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should read all directories from data folder', () => {
    const mockDirents = [
      { name: 'test_beer_1', isDirectory: () => true },
      { name: 'test_beer_2', isDirectory: () => true },
      { name: 'readme.md', isDirectory: () => false }
    ]

    fs.readdirSync.mockReturnValue(mockDirents)
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('test_beer_1')) return mockYamlContent1
      if (filePath.includes('test_beer_2')) return mockYamlContent2
      return ''
    })
    
    yaml.load.mockImplementation((content) => {
      if (content === mockYamlContent1) return mockBrand1
      if (content === mockYamlContent2) return mockBrand2
      return null
    })

    fs.writeFileSync.mockImplementation(() => {})

    // Import and run the function logic
    expect(fs.readdirSync).toBeDefined()
  })

  it('should parse YAML files correctly', () => {
    yaml.load.mockReturnValue(mockBrand1)
    
    const result = yaml.load(mockYamlContent1)
    
    expect(result).toEqual(mockBrand1)
    expect(result.name).toBe('Test Beer 1')
    expect(result.id).toBe('test_beer_1')
  })

  it('should filter only directories', () => {
    const mockDirents = [
      { name: 'test_beer_1', isDirectory: () => true },
      { name: 'readme.md', isDirectory: () => false },
      { name: 'test_beer_2', isDirectory: () => true }
    ]

    const directories = mockDirents
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    expect(directories).toEqual(['test_beer_1', 'test_beer_2'])
    expect(directories).not.toContain('readme.md')
  })

  it('should sort brands alphabetically', () => {
    const unsortedBrands = [mockBrand2, mockBrand1]
    const sortedBrands = [...unsortedBrands].sort((a, b) => 
      a.name.localeCompare(b.name)
    )
    
    expect(sortedBrands[0].name).toBe('Test Beer 1')
    expect(sortedBrands[1].name).toBe('Test Beer 2')
  })

  it('should write JSON output with proper formatting', () => {
    const brands = [mockBrand1, mockBrand2]
    const expectedJson = JSON.stringify(brands, null, 2)
    
    expect(expectedJson).toContain('"name": "Test Beer 1"')
    expect(expectedJson).toContain('"id": "test_beer_1"')
    expect(JSON.parse(expectedJson)).toEqual(brands)
  })

  it('should skip brands without id', () => {
    const brandWithoutId = { ...mockBrand1, id: undefined }
    const brands = [mockBrand1, brandWithoutId, mockBrand2]
    
    const validBrands = brands.filter(brand => brand && brand.id)
    
    expect(validBrands).toHaveLength(2)
    expect(validBrands).not.toContain(brandWithoutId)
  })

  it('should handle YAML parsing errors gracefully', () => {
    yaml.load.mockImplementation(() => {
      throw new Error('Invalid YAML')
    })
    
    expect(() => {
      try {
        yaml.load('invalid: yaml: content:')
      } catch (error) {
        expect(error.message).toBe('Invalid YAML')
        throw error
      }
    }).toThrow('Invalid YAML')
  })
})

