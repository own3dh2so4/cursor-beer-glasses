import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Gallery from '../components/Gallery'
import { mockBrands } from '../../../test/mocks/mockBrands'
import type { Brand } from '../../../shared/types'

vi.mock('../../../shared/utils/dataLoader', () => ({
  loadAllBrands: vi.fn(),
  getAssetPath: (path: string) => `/cursor-beer-glasses/data/${path}`
}))

describe('Gallery', () => {
  let loadAllBrands: Mock

  beforeEach(async () => {
    vi.clearAllMocks()
    const dataLoader = await import('../../../shared/utils/dataLoader')
    loadAllBrands = dataLoader.loadAllBrands as Mock
  })

  const renderGallery = () => {
    return render(
      <BrowserRouter>
        <Gallery />
      </BrowserRouter>
    )
  }

  it('should show loading state initially', () => {
    loadAllBrands.mockImplementation(() => new Promise<Brand[]>(() => {}))
    renderGallery()
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should display gallery title and subtitle', async () => {
    loadAllBrands.mockResolvedValue(mockBrands)
    renderGallery()
    
    await waitFor(() => {
      expect(screen.getByText('Own3dh2so4 Beer Glasses Collection')).toBeInTheDocument()
      expect(screen.getByText((_content, element) => {
        return element?.textContent === 'Showing 2 of 2 brands'
      })).toBeInTheDocument()
    })
  })

  it('should render all brands from data loader', async () => {
    loadAllBrands.mockResolvedValue(mockBrands)
    renderGallery()
    
    await waitFor(() => {
      expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
      expect(screen.getByText('Test Beer 2')).toBeInTheDocument()
    })
  })

  it('should render correct number of gallery cards', async () => {
    loadAllBrands.mockResolvedValue(mockBrands)
    renderGallery()
    
    await waitFor(() => {
      const brandImages = screen.getAllByRole('img')
      expect(brandImages.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('should handle empty brand list', async () => {
    loadAllBrands.mockResolvedValue([])
    renderGallery()
    
    await waitFor(() => {
      expect(screen.getByText((_content, element) => {
        return element?.textContent === 'Showing 0 of 0 brands'
      })).toBeInTheDocument()
    })
  })

  it('should have proper structure with background', async () => {
    loadAllBrands.mockResolvedValue(mockBrands)
    renderGallery()
    
    await waitFor(() => {
      // Check for header title
      expect(screen.getByText('Own3dh2so4 Beer Glasses Collection')).toBeInTheDocument()
      
      // Check for filter title
      expect(screen.getByText('🔍 Filters')).toBeInTheDocument()
      
      // Check that brands are rendered
      expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
      expect(screen.getByText('Test Beer 2')).toBeInTheDocument()
    })
  })
})

