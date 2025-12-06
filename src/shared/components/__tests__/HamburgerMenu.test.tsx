import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TestMemoryRouter } from '@/test/router-helpers'
import { HamburgerMenu } from '../HamburgerMenu'
import userEvent from '@testing-library/user-event'

describe('HamburgerMenu', () => {
  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = ''
    vi.clearAllMocks()
  })

  it('renders hamburger button', () => {
    render(
      <TestMemoryRouter>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toBeInTheDocument()
  })

  it('opens menu when button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(screen.getByText('Gallery')).toBeInTheDocument()
      expect(screen.getByText('Statistics')).toBeInTheDocument()
    })
  })

  it('closes menu when button is clicked again', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    
    // Open menu
    await user.click(button)
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    // Close menu
    await user.click(button)
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    // Click on backdrop
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('closes menu when clicking on a link', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter initialEntries={['/']}>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    const galleryLink = screen.getByRole('menuitem', { name: /gallery/i })
    await user.click(galleryLink)

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('highlights active route', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter initialEntries={['/']}>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(button)

    await waitFor(() => {
      const galleryLink = screen.getByRole('menuitem', { name: /gallery/i })
      expect(galleryLink).toHaveClass('bg-primary', 'text-white')
    })
  })

  it('closes menu when route changes', async () => {
    const user = userEvent.setup()
    
    render(
      <TestMemoryRouter initialEntries={['/']}>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    // Click on stats link to change route
    const statsLink = screen.getByRole('menuitem', { name: /statistics/i })
    await user.click(statsLink)

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('prevents body scroll when menu is open', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  it('restores body scroll when menu is closed', async () => {
    const user = userEvent.setup()
    render(
      <TestMemoryRouter>
        <HamburgerMenu />
      </TestMemoryRouter>
    )

    const button = screen.getByRole('button', { name: /toggle menu/i })
    
    // Open menu
    await user.click(button)
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden')
    })

    // Close menu
    await user.click(button)
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('')
    })
  })
})

