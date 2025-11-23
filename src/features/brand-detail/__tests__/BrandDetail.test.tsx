import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BrandDetail from '../components/BrandDetail'
import { mockBrand1, mockBrand2 } from '../../../test/mocks/mockBrands'
import type { Brand } from '../../../shared/types'

const mockNavigate = vi.fn()
let mockParams = { id: 'test_beer_1' }

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as Record<string, unknown>
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams
  }
})

vi.mock('../../../shared/utils/dataLoader', () => ({
  loadBrandById: vi.fn(),
  getAssetPath: (path: string) => `/cursor-beer-glasses/data/${path}`
}))

describe('BrandDetail', () => {
  let loadBrandById: Mock

  beforeEach(async () => {
    vi.clearAllMocks()
    mockParams = { id: 'test_beer_1' }
    const dataLoader = await import('../../../shared/utils/dataLoader')
    loadBrandById = dataLoader.loadBrandById as Mock
  })

  const renderBrandDetail = (brandId = 'test_beer_1') => {
    mockParams = { id: brandId }
    return render(
      <MemoryRouter
        initialEntries={[`/${brandId}`]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <BrandDetail />
      </MemoryRouter>
    )
  }

  it('should show loading state initially', () => {
    loadBrandById.mockImplementation(() => new Promise<Brand | undefined>(() => {}))
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
      const image = screen.getByAltText(mockBrand1.name)
      expect(image).toBeInTheDocument()
      
      // Check that the link exists and has correct attributes
      const link = image.closest('a')
      expect(link).toHaveAttribute('href', mockBrand1.website)
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('should render brewery information section', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('Brewery Information')).toBeInTheDocument()
      expect(screen.getByText(mockBrand1.name)).toBeInTheDocument()
      if (mockBrand1.from_city) {
        expect(screen.getByText(mockBrand1.from_city)).toBeInTheDocument()
      }
    })
  })

  it('should render glass carousel section', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      // Check for glass image
      const glassImage = screen.getByAltText('Test Glass 1')
      expect(glassImage).toBeInTheDocument()
    })
  })

  it('should render glass details section', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      expect(screen.getByText('Glass Details')).toBeInTheDocument()
      const glassName = mockBrand1.glasses[0]?.name
      if (glassName) {
        expect(screen.getByText(glassName)).toBeInTheDocument()
      }
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
    loadBrandById.mockResolvedValue(undefined)
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

  it('should have proper structure with sections', async () => {
    loadBrandById.mockResolvedValue(mockBrand1)
    renderBrandDetail()
    
    await waitFor(() => {
      // Check for back button
      expect(screen.getByText('← Back to Gallery')).toBeInTheDocument()
      
      // Check for brand sections
      expect(screen.getByText('Glass Details')).toBeInTheDocument()
      expect(screen.getByText('Brewery Information')).toBeInTheDocument()
    })
  })
})

