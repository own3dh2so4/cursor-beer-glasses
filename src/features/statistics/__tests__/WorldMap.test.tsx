import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import WorldMap from '../components/WorldMap'

// Define mock function before vi.mock calls (hoisting requirement)
const createMockFeature = () => ({
    type: 'FeatureCollection',
    features: [
        { type: 'Feature', properties: { name: 'United Kingdom' }, geometry: {} },
        { type: 'Feature', properties: { name: 'United States of America' }, geometry: {} },
        { type: 'Feature', properties: { name: 'Spain' }, geometry: {} }
    ]
})

// Mock d3-geo
vi.mock('d3-geo', () => ({
    geoPath: vi.fn(() => {
        const pathFn = vi.fn(() => 'M 0 0 L 10 0 L 10 10 L 0 10 Z')
        Object.assign(pathFn, {
            projection: vi.fn().mockReturnThis()
        })
        return pathFn
    }),
    geoMercator: vi.fn(() => ({
        scale: vi.fn().mockReturnThis(),
        translate: vi.fn().mockReturnThis()
    }))
}))

// Mock topojson-client
vi.mock('topojson-client', () => ({
    feature: vi.fn(() => createMockFeature())
}))

import { feature as mockFeatureImport } from 'topojson-client'
const mockFeature = mockFeatureImport as ReturnType<typeof vi.fn>

describe('WorldMap Integration', () => {
    const mockCountryData = [
        { country: 'UK', count: 5 },
        { country: 'USA', count: 10 },
        { country: 'Spain', count: 3 }
    ]

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock fetch for world atlas data
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    type: 'Topology',
                    objects: { countries: {} }
                })
            } as unknown as Response)
        )
    })

    it('should render map and handle country aliases correctly', async () => {
        render(
            <BrowserRouter>
                <WorldMap countryData={mockCountryData} viewMode="purchase" />
            </BrowserRouter>
        )

        expect(screen.getByText(/Loading map.../i)).toBeInTheDocument()

        await waitFor(() => {
            expect(mockFeature).toHaveBeenCalled()
        })

        const ukPath = await screen.findByRole('button', { name: /United Kingdom: 5 glasses/i })
        expect(ukPath).toBeInTheDocument()

        const usaPath = screen.getByRole('button', { name: /United States of America: 10 glasses/i })
        expect(usaPath).toBeInTheDocument()

        const spainPath = screen.getByRole('button', { name: /Spain: 3 glasses/i })
        expect(spainPath).toBeInTheDocument()
    })

    it('should show tooltip on hover', async () => {
        render(
            <BrowserRouter>
                <WorldMap countryData={mockCountryData} viewMode="purchase" />
            </BrowserRouter>
        )

        const ukPath = await screen.findByRole('button', { name: /United Kingdom: 5 glasses/i })

        const container = ukPath.closest('.relative') as HTMLElement
        if (container) {
            vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
                left: 0,
                top: 0,
                width: 800,
                height: 500,
                x: 0,
                y: 0,
                bottom: 500,
                right: 800,
                toJSON: () => { }
            })
        }

        fireEvent.mouseEnter(ukPath, { clientX: 100, clientY: 100 })

        expect(screen.getByText('UK')).toBeInTheDocument()
        expect(screen.getByText(/5 glasses/i)).toBeInTheDocument()
    })

    it('should use zoom buttons', async () => {
        render(
            <BrowserRouter>
                <WorldMap countryData={mockCountryData} viewMode="purchase" />
            </BrowserRouter>
        )

        await screen.findByRole('button', { name: /United Kingdom: 5 glasses/i })

        const zoomInBtn = screen.getByLabelText('Zoom in')
        const g = document.querySelector('svg g')

        fireEvent.click(zoomInBtn)

        await waitFor(() => {
            expect(g?.getAttribute('transform')).toContain('scale(1.2')
        })
    })

    it('should NOT show warning when all countries are mapped', async () => {
        render(
            <BrowserRouter>
                <WorldMap countryData={mockCountryData} viewMode="purchase" />
            </BrowserRouter>
        )

        await screen.findByRole('button', { name: /United Kingdom: 5 glasses/i })

        expect(screen.queryByText(/Countries Not Found on Map/i)).not.toBeInTheDocument()
    })

    it('should show warning when unmapped countries exist', async () => {
        const dataWithUnmapped = [
            { country: 'UK', count: 5 },
            { country: 'Atlantis', count: 10 },
            { country: 'Narnia', count: 3 }
        ]

        render(
            <BrowserRouter>
                <WorldMap countryData={dataWithUnmapped} viewMode="purchase" />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(mockFeature).toHaveBeenCalled()
        })

        expect(screen.getByText(/Countries Not Found on Map/i)).toBeInTheDocument()
        expect(screen.getByText('Atlantis')).toBeInTheDocument()
        expect(screen.getByText('Narnia')).toBeInTheDocument()
    })

    it('should display correct warning message for single unmapped country', async () => {
        const dataWithOneUnmapped = [
            { country: 'UK', count: 5 },
            { country: 'Wonderland', count: 10 }
        ]

        render(
            <BrowserRouter>
                <WorldMap countryData={dataWithOneUnmapped} viewMode="purchase" />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(mockFeature).toHaveBeenCalled()
        })

        expect(screen.getByText(/The following country from your collection/i)).toBeInTheDocument()
        expect(screen.getByText('Wonderland')).toBeInTheDocument()
    })
})
