import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestMemoryRouter } from '@/test/router-helpers'
import userEvent from '@testing-library/user-event'
import BrandDetail from '@/features/brand-detail/components/BrandDetail'
import { mockBrand1, mockBrand2 } from '@/test/mocks/mockBrands'

const mockNavigate = vi.fn()
let mockParams = { id: 'test_beer_1' }

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams
  }
})

// Mock useBrand hook
const mockUseBrand = vi.fn()
vi.mock('@/shared/hooks/useBrands', () => ({
  useBrand: () => mockUseBrand()
}))

vi.mock('@/shared/utils/dataLoader', () => ({
  getAssetPath: (path: string) => `/cursor-beer-glasses/data/${path}`
}))

describe('BrandDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockParams = { id: 'test_beer_1' }
    mockUseBrand.mockReturnValue({
      data: mockBrand1,
      isLoading: false,
      error: null
    })
  })

  const renderBrandDetail = (brandId = 'test_beer_1') => {
    mockParams = { id: brandId }
    return render(
      <TestMemoryRouter initialEntries={[`/${brandId}`]}>
        <BrandDetail />
      </TestMemoryRouter>
    )
  }

  it('renders loading state initially', () => {
    mockUseBrand.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })
    renderBrandDetail()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders brand details when loaded', () => {
    renderBrandDetail()
    expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
    expect(screen.getAllByText('Spain')[0]).toBeInTheDocument()
  })

  it('renders error state when brand not found', () => {
    mockUseBrand.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found')
    })
    renderBrandDetail('non_existent')
    expect(screen.getByText(/brand not found/i)).toBeInTheDocument()
  })

  it('navigates back to gallery', async () => {
    const user = userEvent.setup()
    renderBrandDetail()

    const backButton = screen.getByRole('button', { name: /back to gallery/i })
    await user.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should render brand name image as clickable link', async () => {
    renderBrandDetail()

    const image = screen.getByAltText(mockBrand1.name)
    expect(image).toBeInTheDocument()

    // Check that the link exists and has correct attributes
    const link = image.closest('a')
    expect(link).toHaveAttribute('href', mockBrand1.website)
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should render brewery information section', () => {
    renderBrandDetail()

    expect(screen.getByText('Brewery Information')).toBeInTheDocument()
    expect(screen.getByText(mockBrand1.name)).toBeInTheDocument()
    if (mockBrand1.from_city) {
      expect(screen.getByText(mockBrand1.from_city)).toBeInTheDocument()
    }
  })

  it('should render glass carousel section', () => {
    renderBrandDetail()

    // Check for glass image
    const glassImage = screen.getByAltText('Test Glass 1')
    expect(glassImage).toBeInTheDocument()
  })

  it('should render glass details section', () => {
    renderBrandDetail()

    expect(screen.getByText('Glass Details')).toBeInTheDocument()
    const glassName = mockBrand1.glasses[0]?.name
    if (glassName) {
      expect(screen.getByText(glassName)).toBeInTheDocument()
    }
  })

  it('should update glass info when carousel changes', async () => {
    mockUseBrand.mockReturnValue({
      data: mockBrand2,
      isLoading: false,
      error: null
    })

    const user = userEvent.setup()
    renderBrandDetail('test_beer_2')

    expect(screen.getByText('Test Glass 2A')).toBeInTheDocument()

    // Click next button to change glass
    const nextButton = screen.getByLabelText('Next glass')
    await user.click(nextButton)

    // Should now show second glass
    expect(screen.getByText('Test Glass 2B')).toBeInTheDocument()
  })

  it('should have proper structure with sections', () => {
    renderBrandDetail()

    // Check for back button
    expect(screen.getByText('← Back to Gallery')).toBeInTheDocument()

    // Check for brand sections
    expect(screen.getByText('Glass Details')).toBeInTheDocument()
    expect(screen.getByText('Brewery Information')).toBeInTheDocument()
  })
})

