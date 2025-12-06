import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestBrowserRouter } from '@/test/router-helpers'
import Statistics from '@/features/statistics/components/Statistics'

// Mock the hooks
vi.mock('@/shared/hooks/useBrands', () => ({
    useBrands: vi.fn()
}))

vi.mock('@/shared/hooks/useStatistics', () => ({
    useStatistics: vi.fn()
}))

import { useBrands } from '@/shared/hooks/useBrands'
import { useStatistics } from '@/shared/hooks/useStatistics'

describe('Statistics', () => {
    const mockStatistics = {
        totalGlasses: 10,
        totalBrands: 5,
        uniqueCountries: 3,
        countryData: [
            { country: 'Spain', count: 5 },
            { country: 'Belgium', count: 3 },
            { country: 'USA', count: 2 }
        ]
    }

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock fetch for world atlas data
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    type: 'Topology',
                    objects: { countries: { type: 'GeometryCollection', geometries: [] } }
                })
            })
        ) as unknown as typeof fetch

        vi.mocked(useBrands).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            refetch: vi.fn(),
            isError: false,
            isPending: false
        } as unknown as ReturnType<typeof useBrands>)
        vi.mocked(useStatistics).mockReturnValue(mockStatistics)
    })

    it('should render statistics page', () => {
        render(
            <TestBrowserRouter>
                <Statistics />
            </TestBrowserRouter>
        )

        // Navbar is now in Layout, not in Statistics component
        // Check for statistics content instead
        expect(screen.getByText(/🛍️ Where I Bought/i)).toBeInTheDocument()
    })

    it('should display view mode toggle', () => {
        render(
            <TestBrowserRouter>
                <Statistics />
            </TestBrowserRouter>
        )

        expect(screen.getByText(/🛍️ Where I Bought/i)).toBeInTheDocument()
        expect(screen.getByText(/🏭 Brewery Origin/i)).toBeInTheDocument()
    })

    it('should display statistics cards', () => {
        render(
            <TestBrowserRouter>
                <Statistics />
            </TestBrowserRouter>
        )

        expect(screen.getByText('Total Glasses')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should show loading state', () => {
        vi.mocked(useBrands).mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
            refetch: vi.fn(),
            isError: false,
            isPending: true
        } as unknown as ReturnType<typeof useBrands>)

        render(
            <TestBrowserRouter>
                <Statistics />
            </TestBrowserRouter>
        )

        expect(screen.getByText(/Loading statistics/i)).toBeInTheDocument()
    })

    it('should show error state', () => {
        vi.mocked(useBrands).mockReturnValue({
            data: [],
            isLoading: false,
            error: new Error('Test error'),
            refetch: vi.fn(),
            isError: true,
            isPending: false
        } as unknown as ReturnType<typeof useBrands>)

        render(
            <TestBrowserRouter>
                <Statistics />
            </TestBrowserRouter>
        )

        expect(screen.getByText(/Error loading statistics/i)).toBeInTheDocument()
    })
})
