import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { TestMemoryRouter } from '@/test/router-helpers'
import { Navbar } from '../Navbar'

// Mock useIsMobile hook
vi.mock('../../hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => false)
}))

describe('Navbar', () => {
  const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')
  const originalAddEventListener = window.addEventListener
  const originalRemoveEventListener = window.removeEventListener
  const originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth')

  beforeEach(() => {
    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Desktop width
    })

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    })

    // Mock scroll event listeners
    const scrollListeners: Array<() => void> = []
    window.addEventListener = vi.fn((event: string, handler: EventListenerOrEventListenerObject) => {
      if (event === 'scroll' && typeof handler === 'function') {
        scrollListeners.push(handler as () => void)
      }
    }) as typeof window.addEventListener
    window.removeEventListener = vi.fn((event: string, handler: EventListenerOrEventListenerObject) => {
      if (event === 'scroll' && typeof handler === 'function') {
        const index = scrollListeners.indexOf(handler as () => void)
        if (index > -1) {
          scrollListeners.splice(index, 1)
        }
      }
    }) as typeof window.removeEventListener

    // Expose scroll listeners for testing
    ;(window as unknown as { _scrollListeners: Array<() => void> })._scrollListeners = scrollListeners
  })

  afterEach(() => {
    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY)
    }
    if (originalInnerWidth) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidth)
    }
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
    vi.clearAllMocks()
  })

  const renderNavbar = (props = {}, initialEntries = ['/']) => {
    return render(
      <TestMemoryRouter initialEntries={initialEntries}>
        <Navbar title="Test Title" {...props} />
      </TestMemoryRouter>
    )
  }

  const triggerScroll = (scrollY: number) => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: scrollY
    })
    const listeners = (window as unknown as { _scrollListeners: Array<() => void> })._scrollListeners
    listeners.forEach(listener => listener())
  }

  it('renders title when not scrolled', () => {
    renderNavbar()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders subtitle when provided and not scrolled', () => {
    renderNavbar({ subtitle: 'Test Subtitle' })
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    renderNavbar()
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument()
  })

  it('renders collapsed title when scrolled', async () => {
    renderNavbar()
    act(() => {
      triggerScroll(100)
    })
    await waitFor(() => {
      expect(screen.getByText('🍺 Beer Glasses')).toBeInTheDocument()
    })
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('renders custom collapsed title when provided', async () => {
    renderNavbar({ collapsedTitle: 'Custom Title' })
    act(() => {
      triggerScroll(100)
    })
    await waitFor(() => {
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })
  })

  it('renders navigation links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /statistics/i })).toBeInTheDocument()
  })

  it('highlights active route for gallery', () => {
    renderNavbar({}, ['/'])
    const galleryLink = screen.getByRole('link', { name: /gallery/i })
    expect(galleryLink).toHaveClass('bg-primary')
  })

  it('highlights active route for statistics', () => {
    renderNavbar({}, ['/stats'])
    const statsLink = screen.getByRole('link', { name: /statistics/i })
    expect(statsLink).toHaveClass('bg-primary')
  })

  it('does not highlight inactive routes', () => {
    renderNavbar({}, ['/'])
    const statsLink = screen.getByRole('link', { name: /statistics/i })
    expect(statsLink).not.toHaveClass('bg-primary')
    expect(statsLink).toHaveClass('text-slate-700')
  })

  it('collapsed title links to home', async () => {
    renderNavbar()
    act(() => {
      triggerScroll(100)
    })
    await waitFor(() => {
      const collapsedLink = screen.getByText('🍺 Beer Glasses').closest('a')
      expect(collapsedLink).toHaveAttribute('href', '/')
    })
  })

  it('gallery link navigates to home', () => {
    renderNavbar()
    const galleryLink = screen.getByRole('link', { name: /gallery/i })
    expect(galleryLink).toHaveAttribute('href', '/')
  })

  it('statistics link navigates to stats', () => {
    renderNavbar()
    const statsLink = screen.getByRole('link', { name: /statistics/i })
    expect(statsLink).toHaveAttribute('href', '/stats')
  })

  it('adds scroll event listener on mount', () => {
    renderNavbar()
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('removes scroll event listener on unmount', () => {
    const { unmount } = renderNavbar()
    unmount()
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('transitions between scrolled and not scrolled states', async () => {
    renderNavbar()

    // Initially not scrolled
    expect(screen.getByText('Test Title')).toBeInTheDocument()

    // Scroll down
    act(() => {
      triggerScroll(100)
    })

    // Should show collapsed title
    await waitFor(() => {
      expect(screen.getByText('🍺 Beer Glasses')).toBeInTheDocument()
    })
  })

  it('renders with ReactNode title', () => {
    render(
      <TestMemoryRouter>
        <Navbar title={<span data-testid="custom-title">Custom Node</span>} />
      </TestMemoryRouter>
    )
    expect(screen.getByTestId('custom-title')).toBeInTheDocument()
  })

  it('renders with ReactNode subtitle', () => {
    render(
      <TestMemoryRouter>
        <Navbar
          title="Test Title"
          subtitle={<span data-testid="custom-subtitle">Custom Subtitle Node</span>}
        />
      </TestMemoryRouter>
    )
    expect(screen.getByTestId('custom-subtitle')).toBeInTheDocument()
  })

  it('shows collapsed version on mobile and tablet', async () => {
    const { useIsMobile } = await import('../../hooks/useIsMobile')
    vi.mocked(useIsMobile).mockReturnValue(true)

    render(
      <TestMemoryRouter>
        <Navbar title="Test Title" collapsedTitle="Mobile Title" />
      </TestMemoryRouter>
    )

    // On mobile/tablet, should show collapsed version immediately
    expect(screen.getByText('Mobile Title')).toBeInTheDocument()
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('shows hamburger menu on mobile and tablet instead of navigation links', async () => {
    const { useIsMobile } = await import('../../hooks/useIsMobile')
    vi.mocked(useIsMobile).mockReturnValue(true)

    render(
      <TestMemoryRouter>
        <Navbar title="Test Title" />
      </TestMemoryRouter>
    )

    // Should show hamburger button
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
    
    // Should not show direct navigation links
    expect(screen.queryByRole('link', { name: /gallery/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /statistics/i })).not.toBeInTheDocument()
  })

  it('shows navigation links on desktop (>= 1024px)', async () => {
    const { useIsMobile } = await import('../../hooks/useIsMobile')
    vi.mocked(useIsMobile).mockReturnValue(false)

    render(
      <TestMemoryRouter>
        <Navbar title="Test Title" />
      </TestMemoryRouter>
    )

    // Should show direct navigation links
    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /statistics/i })).toBeInTheDocument()
    
    // Should not show hamburger button
    expect(screen.queryByRole('button', { name: /toggle menu/i })).not.toBeInTheDocument()
  })
})

