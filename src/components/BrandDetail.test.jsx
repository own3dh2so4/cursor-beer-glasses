import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BrandDetail from './BrandDetail'
import { mockBrand1, mockBrand2 } from '../test/mocks/mockBrands'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock('../utils/dataLoader', () => ({
  loadBrandById: vi.fn(),
  getAssetPath: (path) => `/cursor-beer-glasses/data/${path}`
}))

describe('BrandDetail', () => {
  let loadBrandById

  beforeEach(async () => {
    vi.clearAllMocks()
    const dataLoader = await import('../utils/dataLoader')
    loadBrandById = dataLoader.loadBrandById
  })

  const renderBrandDetail = (brandId = 'test_beer_1') => {
    return render(
      <MemoryRouter initialEntries={[`/${brandId}`]}>
        <BrandDetail />
      </MemoryRouter>
    )
  }

  it('should show loading state initially', () => {
    loadBrandById.mockImplementation(() => new Promise(() => {}))
    renderBrandDetail()
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render back button', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('← Back to Gallery')).toBeInTheDocument()
    })
  })

  it('should navigate to gallery when back button clicked', async () => {
    const user = userEvent.setup()
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('← Back to Gallery')).toBeInTheDocument()
    })
    
    const backButton = screen.getByText('← Back to Gallery')
    await user.click(backButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should render brand name image as clickable link', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', mockBrand1.website)
      expect(link).toHaveAttribute('target', '_blank')
      
      const image = screen.getByAltText(mockBrand1.name)
      expect(image).toBeInTheDocument()
    })
  })

  it('should render brewery information section', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('Brewery Information')).toBeInTheDocument()
      expect(screen.getByText(mockBrand1.name)).toBeInTheDocument()
      expect(screen.getByText(mockBrand1.from_city)).toBeInTheDocument()
    })
  })

  it('should render glass carousel section', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('Glass Photo')).toBeInTheDocument()
    })
  })

  it('should render glass details section', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('Glass Details')).toBeInTheDocument()
      expect(screen.getByText(mockBrand1.glasses[0].name)).toBeInTheDocument()
    })
  })

  it('should update glass info when carousel changes', async () => {
    const user = userEvent.setup()
    loadBrandById.mockResolvedValue(mockBrand2)
    renderBrandDetail('test_beer_2')
    
    await waitFor(() => {
      expect(screen.getByText('Test Glass 2A')).toBeInTheDocument()
    })
    
    // Click next button to change glass
    const nextButton = screen.getByLabelText('Next glass')
    await user.click(nextButton)
    
    // Should now show second glass
    await waitFor(() => {
      expect(screen.getByText('Test Glass 2B')).toBeInTheDocument()
    })
  })

  it('should redirect to gallery when brand not found', async () => {
    loadBrandById.mockResolvedValue(null)
    renderBrandDetail('non_existent')
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('should load correct brand based on URL param', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail('test_beer_1')
    
    await waitFor(() => {
      expect(loadBrandById).toHaveBeenCalledWith('test_beer_1')
    })
  })

  it('should have proper CSS structure with background', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    const { container } = renderBrandDetail()
    
    await waitFor(() => {
      expect(container.querySelector('.brand-detail-wrapper')).toBeInTheDocument()
      expect(container.querySelector('.brand-detail-background')).toBeInTheDocument()
      expect(container.querySelector('.brand-detail-overlay')).toBeInTheDocument()
      expect(container.querySelector('.brand-detail')).toBeInTheDocument()
      expect(container.querySelector('.brand-header')).toBeInTheDocument()
      expect(container.querySelector('.brand-content')).toBeInTheDocument()
      expect(container.querySelector('.glass-sections')).toBeInTheDocument()
    })
  })
})

