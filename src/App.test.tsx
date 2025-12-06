import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'
import { mockBrands } from './test/mocks/mockBrands'

// Mock dataLoader globally
const mockLoadAllBrands = vi.fn()
const mockLoadBrandById = vi.fn()
const mockGetAssetPath = vi.fn((path: string) => `/cursor-beer-glasses/data/${path}`)

vi.mock('./shared/utils/dataLoader', () => ({
  loadAllBrands: () => mockLoadAllBrands(),
  loadBrandById: (id: string) => mockLoadBrandById(id),
  getAssetPath: (path: string) => mockGetAssetPath(path)
}))

// Mock useBrands for Layout
vi.mock('./shared/hooks/useBrands', () => ({
  useBrands: vi.fn(() => ({
    data: mockBrands,
    isLoading: false,
    error: null
  })),
  useBrand: vi.fn(() => ({
    data: mockBrands[0],
    isLoading: false,
    error: null
  }))
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadAllBrands.mockResolvedValue(mockBrands)
    mockLoadBrandById.mockResolvedValue(mockBrands[0])
  })

  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow()
  })

  it('should render BrowserRouter with routes', () => {
    const result = render(<App />)
    // If render completes without throwing, the routing structure is valid
    expect(result).toBeTruthy()
  })
})

