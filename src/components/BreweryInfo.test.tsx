import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BreweryInfo from './BreweryInfo'
import { mockBrand1 } from '../test/mocks/mockBrands'

describe('BreweryInfo', () => {
  const defaultTextColor = '#1a202c'

  it('should render brewery name', () => {
    render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Test Beer 1')).toBeInTheDocument()
  })

  it('should render brewery location', () => {
    render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Madrid')).toBeInTheDocument()
    expect(screen.getByText('Spain')).toBeInTheDocument()
  })

  it('should render brewery website link', () => {
    render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    const link = screen.getByText('https://testbeer1.com')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://testbeer1.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render section title', () => {
    render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Brewery Information')).toBeInTheDocument()
  })

  it('should render all info labels', () => {
    render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('City:')).toBeInTheDocument()
    expect(screen.getByText('Country:')).toBeInTheDocument()
    expect(screen.getByText('Website:')).toBeInTheDocument()
  })

  it('should render Google Maps iframe when map is provided', () => {
    render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    const iframe = screen.getByTitle(`Map of ${mockBrand1.name}`)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', mockBrand1.map)
  })

  it('should not render map when map URL is missing', () => {
    const brandWithoutMap = { ...mockBrand1, map: undefined }
      const { container } = render(<BreweryInfo brand={brandWithoutMap} textColor={defaultTextColor} />)
    
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('should have proper CSS classes', () => {
      const { container } = render(<BreweryInfo brand={mockBrand1} textColor={defaultTextColor} />)
    
    expect(container.querySelector('.brewery-info')).toBeInTheDocument()
    expect(container.querySelector('.section-title')).toBeInTheDocument()
    expect(container.querySelector('.info-grid')).toBeInTheDocument()
    expect(container.querySelector('.map-container')).toBeInTheDocument()
  })
})

