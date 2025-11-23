import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GlassInfo from '../components/GlassInfo'
import { mockBrand1 } from '../../../test/mocks/mockBrands'
import type { Glass } from '../../../shared/types'

describe('GlassInfo', () => {
  const glass = mockBrand1.glasses[0] as Glass
  const defaultTextColor = '#1a202c'

  it('should render glass name', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Test Glass 1')).toBeInTheDocument()
  })

  it('should render purchase location', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Barcelona')).toBeInTheDocument()
    expect(screen.getByText('Spain')).toBeInTheDocument()
  })

  it('should render acquisition details', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    expect(screen.getByText('buy')).toBeInTheDocument()
    expect(screen.getByText('Test Store')).toBeInTheDocument()
  })

  it('should render section title', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Glass Details')).toBeInTheDocument()
  })

  it('should render all info labels', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('Bought in:')).toBeInTheDocument()
    expect(screen.getByText('Country:')).toBeInTheDocument()
    expect(screen.getByText('Acquired:')).toBeInTheDocument()
    expect(screen.getByText('From:')).toBeInTheDocument()
  })

  it('should render Google Maps iframe when map is provided', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    const iframe = screen.getByTitle(`Map of ${glass.bought_city ?? 'location'}`)
    expect(iframe).toBeInTheDocument()
    if (glass.map) {
      expect(iframe).toHaveAttribute('src', glass.map)
    }
  })

  it('should not render map when map URL is missing', () => {
    const glassWithoutMap: Glass = {
      id: glass.id,
      photo: glass.photo,
      got: glass.got,
      name: glass.name,
      bought_city: glass.bought_city,
      bought_country: glass.bought_country,
      got_from: glass.got_from,
      map: undefined
    }
    const { container } = render(<GlassInfo glass={glassWithoutMap} textColor={defaultTextColor} />)
    
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('should have proper structure', () => {
    render(<GlassInfo glass={glass} textColor={defaultTextColor} />)
    
    // Check for section title
    expect(screen.getByText('Glass Details')).toBeInTheDocument()
    
    // Check for all glass information
    expect(screen.getByText(glass.name)).toBeInTheDocument()
    expect(screen.getByText(glass.bought_city)).toBeInTheDocument()
    expect(screen.getByText(glass.bought_country || '')).toBeInTheDocument()
  })
})

