import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GlassInfo from './GlassInfo'
import { mockBrand1 } from '../test/mocks/mockBrands'

describe('GlassInfo', () => {
  const glass = mockBrand1.glasses[0]

  it('should render glass name', () => {
    render(<GlassInfo glass={glass} />)
    
    expect(screen.getByText('Test Glass 1')).toBeInTheDocument()
  })

  it('should render purchase location', () => {
    render(<GlassInfo glass={glass} />)
    
    expect(screen.getByText('Barcelona')).toBeInTheDocument()
    expect(screen.getByText('Spain')).toBeInTheDocument()
  })

  it('should render acquisition details', () => {
    render(<GlassInfo glass={glass} />)
    
    expect(screen.getByText('buy')).toBeInTheDocument()
    expect(screen.getByText('Test Store')).toBeInTheDocument()
  })

  it('should render section title', () => {
    render(<GlassInfo glass={glass} />)
    
    expect(screen.getByText('Glass Details')).toBeInTheDocument()
  })

  it('should render all info labels', () => {
    render(<GlassInfo glass={glass} />)
    
    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('Bought in:')).toBeInTheDocument()
    expect(screen.getByText('Country:')).toBeInTheDocument()
    expect(screen.getByText('Acquired:')).toBeInTheDocument()
    expect(screen.getByText('From:')).toBeInTheDocument()
  })

  it('should render Google Maps iframe when map is provided', () => {
    render(<GlassInfo glass={glass} />)
    
    const iframe = screen.getByTitle(`Map of ${glass.bought_city}`)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', glass.map)
  })

  it('should not render map when map URL is missing', () => {
    const glassWithoutMap = { ...glass, map: undefined }
    const { container } = render(<GlassInfo glass={glassWithoutMap} />)
    
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('should have proper CSS classes', () => {
    const { container } = render(<GlassInfo glass={glass} />)
    
    expect(container.querySelector('.glass-info')).toBeInTheDocument()
    expect(container.querySelector('.section-title')).toBeInTheDocument()
    expect(container.querySelector('.info-grid')).toBeInTheDocument()
  })
})

