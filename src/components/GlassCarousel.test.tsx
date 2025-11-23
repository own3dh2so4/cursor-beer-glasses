import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GlassCarousel from './GlassCarousel'
import { mockBrand2 } from '../test/mocks/mockBrands'

describe('GlassCarousel', () => {
  const glasses = mockBrand2.glasses
  const mockOnIndexChange = vi.fn()

  const renderCarousel = (currentIndex = 0) => {
    return render(
      <GlassCarousel
        glasses={glasses}
        currentIndex={currentIndex}
        onIndexChange={mockOnIndexChange}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render carousel with glass image', () => {
    const { container } = renderCarousel()
    
    const carousel = container.querySelector('.glass-carousel')
    expect(carousel).toBeInTheDocument()
    
    const image = container.querySelector('.carousel-image')
    expect(image).toBeInTheDocument()
  })

  it('should render current glass image', () => {
    renderCarousel(0)
    
    const image = screen.getByAltText('Test Glass 2A')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('test_beer_2/glass_0.jpg'))
  })

  it('should render navigation buttons when multiple glasses', () => {
    renderCarousel()
    
    const prevButton = screen.getByLabelText('Previous glass')
    const nextButton = screen.getByLabelText('Next glass')
    
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('should not render navigation buttons for single glass', () => {
    const singleGlass = glasses[0] ? [glasses[0]] : []
    render(
      <GlassCarousel
        glasses={singleGlass}
        currentIndex={0}
        onIndexChange={mockOnIndexChange}
      />
    )
    
    expect(screen.queryByLabelText('Previous glass')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next glass')).not.toBeInTheDocument()
  })

  it('should call onIndexChange with next index when next button clicked', async () => {
    const user = userEvent.setup()
    renderCarousel(0)
    
    const nextButton = screen.getByLabelText('Next glass')
    await user.click(nextButton)
    
    expect(mockOnIndexChange).toHaveBeenCalledWith(1)
  })

  it('should call onIndexChange with previous index when prev button clicked', async () => {
    const user = userEvent.setup()
    renderCarousel(1)
    
    const prevButton = screen.getByLabelText('Previous glass')
    await user.click(prevButton)
    
    expect(mockOnIndexChange).toHaveBeenCalledWith(0)
  })

  it('should wrap to last glass when clicking prev on first glass', async () => {
    const user = userEvent.setup()
    renderCarousel(0)
    
    const prevButton = screen.getByLabelText('Previous glass')
    await user.click(prevButton)
    
    expect(mockOnIndexChange).toHaveBeenCalledWith(1)
  })

  it('should wrap to first glass when clicking next on last glass', async () => {
    const user = userEvent.setup()
    renderCarousel(1)
    
    const nextButton = screen.getByLabelText('Next glass')
    await user.click(nextButton)
    
    expect(mockOnIndexChange).toHaveBeenCalledWith(0)
  })

  it('should render indicators for multiple glasses', () => {
    const { container } = renderCarousel()
    
    const indicators = container.querySelectorAll('.carousel-indicator')
    expect(indicators).toHaveLength(2)
  })

  it('should mark current indicator as active', () => {
    const { container } = renderCarousel(1)
    
    const indicators = container.querySelectorAll('.carousel-indicator')
    expect(indicators[1]).toHaveClass('active')
  })

  it('should call onIndexChange when clicking indicator', async () => {
    const user = userEvent.setup()
    const { container } = renderCarousel(0)
    
    const indicators = container.querySelectorAll('.carousel-indicator')
    const secondIndicator = indicators[1]
    if (secondIndicator) {
      await user.click(secondIndicator)
      expect(mockOnIndexChange).toHaveBeenCalledWith(1)
    }
  })

  it('should not render indicators for single glass', () => {
    const singleGlass = glasses[0] ? [glasses[0]] : []
    const { container } = render(
      <GlassCarousel
        glasses={singleGlass}
        currentIndex={0}
        onIndexChange={mockOnIndexChange}
      />
    )
    
    expect(container.querySelector('.carousel-indicators')).not.toBeInTheDocument()
  })

  it('should have proper CSS classes', () => {
    const { container } = renderCarousel()
    
    expect(container.querySelector('.glass-carousel')).toBeInTheDocument()
    expect(container.querySelector('.carousel-container')).toBeInTheDocument()
    expect(container.querySelector('.carousel-image-container')).toBeInTheDocument()
    expect(container.querySelector('.carousel-image')).toBeInTheDocument()
  })
})

