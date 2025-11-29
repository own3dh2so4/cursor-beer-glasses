import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Gallery from '@/features/gallery/components/Gallery'
import { mockBrands } from '@/test/mocks/mockBrands'

// Mock useBrands hook
const mockUseBrands = vi.fn()
vi.mock('@/shared/hooks/useBrands', () => ({
  useBrands: () => mockUseBrands()
}))

vi.mock('@/shared/utils/dataLoader', () => ({
  getAssetPath: (path: string) => `/cursor-beer-glasses/data/${path}`
}))

describe('Gallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBrands.mockReturnValue({
      data: mockBrands,
      isLoading: false,
      error: null
    })
  })

  const renderGallery = () => {
    render(
      <BrowserRouter>
        <Gallery />
      </BrowserRouter>
    )
  }

  it('renders loading state initially', () => {
    mockUseBrands.mockReturnValue({
      data: [],
      isLoading: true,
      error: null
    })
    renderGallery()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders brands when loaded', () => {
    renderGallery()
    expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
    expect(screen.getByText('Test Beer 2')).toBeInTheDocument()
  })

  it('filters brands by search', async () => {
    const user = userEvent.setup()
    renderGallery()

    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'Test Beer 1')

    expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Beer 2')).not.toBeInTheDocument()
  })

  it('filters brands by country', () => {
    renderGallery()

    const countrySelect = screen.getByRole('combobox', { name: /origin country/i })
    fireEvent.change(countrySelect, { target: { value: 'Spain' } })

    expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Beer 2')).not.toBeInTheDocument()
  })

  it('filters brands by glass count', () => {
    renderGallery()

    const glassCountSelect = screen.getByRole('combobox', { name: /glasses count/i })
    fireEvent.change(glassCountSelect, { target: { value: 'single' } })

    expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Beer 2')).not.toBeInTheDocument()
  })
})
