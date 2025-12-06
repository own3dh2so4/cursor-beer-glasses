import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestMemoryRouter } from '@/test/router-helpers'
import { Layout } from '../Layout'

// Mock useBrands
vi.mock('../../hooks/useBrands', () => ({
  useBrands: vi.fn(() => ({
    data: [
      { id: '1', name: 'Brand 1' },
      { id: '2', name: 'Brand 2' }
    ],
    isLoading: false,
    error: null
  }))
}))

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children', () => {
    render(
      <TestMemoryRouter>
        <Layout>
          <div data-testid="child">Child Content</div>
        </Layout>
      </TestMemoryRouter>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders Navbar with gallery title on home route', () => {
    render(
      <TestMemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </TestMemoryRouter>
    )
    expect(screen.getByText('Own3dh2so4 Beer Glasses Collection')).toBeInTheDocument()
  })

  it('renders Navbar with statistics title on stats route', () => {
    render(
      <TestMemoryRouter initialEntries={['/stats']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </TestMemoryRouter>
    )
    expect(screen.getByText('📊 Own3dh2so4 Beer Glass Statistics')).toBeInTheDocument()
  })

  it('renders Navbar with gallery title on brand detail route', () => {
    render(
      <TestMemoryRouter initialEntries={['/brand-id']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </TestMemoryRouter>
    )
    expect(screen.getByText('Own3dh2so4 Beer Glasses Collection')).toBeInTheDocument()
  })

  it('shows brand count in subtitle on gallery route', () => {
    render(
      <TestMemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </TestMemoryRouter>
    )
    // The subtitle contains "brands in collection" text
    expect(screen.getByText(/brands in collection/)).toBeInTheDocument()
  })
})

