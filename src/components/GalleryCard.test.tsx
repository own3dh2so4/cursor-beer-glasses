import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import GalleryCard from './GalleryCard'
import { mockBrand1 } from '../test/mocks/mockBrands'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('GalleryCard', () => {
  const renderGalleryCard = (brand = mockBrand1) => {
    return render(
      <BrowserRouter>
        <GalleryCard brand={brand} />
      </BrowserRouter>
    )
  }

  it('should render brand logo', () => {
    renderGalleryCard()
    
    const logo = screen.getByAltText('Test Beer 1')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', expect.stringContaining('test_beer_1/logo200x200.png'))
  })

  it('should show brand name on hover', () => {
    renderGalleryCard()
    
    const brandName = screen.getByText('Test Beer 1')
    expect(brandName).toBeInTheDocument()
    expect(brandName).toHaveClass('gallery-card-name')
  })

  it('should navigate to brand detail page on click', async () => {
    const user = userEvent.setup()
    const { container } = renderGalleryCard()
    
    const card = container.querySelector('.gallery-card')
    if (card) {
      await user.click(card)
    }
    
    expect(mockNavigate).toHaveBeenCalledWith('/test_beer_1')
  })

  it('should have proper CSS classes', () => {
    const { container } = renderGalleryCard()
    
    expect(container.querySelector('.gallery-card')).toBeInTheDocument()
    expect(container.querySelector('.gallery-card-image-container')).toBeInTheDocument()
    expect(container.querySelector('.gallery-card-image')).toBeInTheDocument()
    expect(container.querySelector('.gallery-card-overlay')).toBeInTheDocument()
  })
})

