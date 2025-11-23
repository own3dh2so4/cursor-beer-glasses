import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Gallery from './Gallery'
import { mockBrands } from '../test/mocks/mockBrands'
import type { Brand } from '../types'

vi.mock('../utils/dataLoader', () => ({
  loadAllBrands: vi.fn(),
  getAssetPath: (path: string) => `/cursor-beer-glasses/data/${path}`
}))

describe('Gallery', () => {
  let loadAllBrands: Mock

  beforeEach(async () => {
    vi.clearAllMocks()
    const dataLoader = await import('../utils/dataLoader')
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
    const { container } = renderGallery()
    
    await waitFor(() => {
      const cards = container.querySelectorAll('.gallery-card')
      expect(cards).toHaveLength(2)
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
    const { container } = renderGallery()
    
    await waitFor(() => {
      expect(container.querySelector('.gallery-wrapper')).toBeInTheDocument()
      expect(container.querySelector('.gallery-background')).toBeInTheDocument()
      expect(container.querySelector('.gallery-overlay')).toBeInTheDocument()
      expect(container.querySelector('.gallery-container')).toBeInTheDocument()
      expect(container.querySelector('.gallery-header')).toBeInTheDocument()
      expect(container.querySelector('.gallery-grid')).toBeInTheDocument()
    })
  })
})

