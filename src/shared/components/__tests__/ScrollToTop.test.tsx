import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ScrollToTop } from '../ScrollToTop'

describe('ScrollToTop', () => {
  const originalScrollTo = window.scrollTo

  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    window.scrollTo = originalScrollTo
  })

  it('scrolls to top on mount', () => {
    render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    )
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('scrolls to top when pathname changes', async () => {
    const NavigationTest = () => {
      const navigate = useNavigate()
      return (
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/stats" element={<div>Stats</div>} />
          </Routes>
          <button onClick={() => navigate('/stats')}>Go to Stats</button>
        </>
      )
    }

    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <NavigationTest />
      </MemoryRouter>
    )

    // Clear the initial mount call
    vi.clearAllMocks()

    // Navigate to a different route
    const button = getByText('Go to Stats')
    act(() => {
      button.click()
    })

    // Wait for navigation and scroll
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    // Should scroll when pathname changes
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('returns null', () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })

  it('scrolls on initial render for different routes', () => {
    // Test with home route
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    )
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    unmount()

    // Clear and test with stats route
    vi.clearAllMocks()
    render(
      <MemoryRouter initialEntries={['/stats']}>
        <ScrollToTop />
      </MemoryRouter>
    )
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})

