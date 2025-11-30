import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestMemoryRouter } from '@/test/router-helpers'
import { TopCountriesList } from '../TopCountriesList'
import type { CountryStatistic } from '@/shared/types'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

describe('TopCountriesList', () => {
    const mockCountryData: CountryStatistic[] = [
        { country: 'Spain', count: 10 },
        { country: 'Germany', count: 8 },
        { country: 'Belgium', count: 5 },
        { country: 'France', count: 3 },
        { country: 'Italy', count: 2 }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    const renderComponent = (props = {}) => {
        const defaultProps = {
            countryData: mockCountryData,
            viewMode: 'purchase' as const,
            ...props
        }
        return render(
            <TestMemoryRouter>
                <TopCountriesList {...defaultProps} />
            </TestMemoryRouter>
        )
    }

    it('renders the title', () => {
        renderComponent()
        expect(screen.getByText('🏆 Top Countries')).toBeInTheDocument()
    })

    it('renders all countries when data is provided', () => {
        renderComponent()
        expect(screen.getByText('Spain')).toBeInTheDocument()
        expect(screen.getByText('Germany')).toBeInTheDocument()
        expect(screen.getByText('Belgium')).toBeInTheDocument()
        expect(screen.getByText('France')).toBeInTheDocument()
        expect(screen.getByText('Italy')).toBeInTheDocument()
    })

    it('displays correct counts for each country', () => {
        renderComponent()
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('8')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('displays medal emojis for top 3 countries', () => {
        renderComponent()
        expect(screen.getByLabelText('Gold Medal')).toBeInTheDocument()
        expect(screen.getByLabelText('Silver Medal')).toBeInTheDocument()
        expect(screen.getByLabelText('Bronze Medal')).toBeInTheDocument()
    })

    it('displays rank numbers for countries after top 3', () => {
        renderComponent()
        expect(screen.getByText('#4')).toBeInTheDocument()
        expect(screen.getByText('#5')).toBeInTheDocument()
    })

    it('displays flag emojis for countries', () => {
        renderComponent()
        // Check that flag emojis are rendered (they should have aria-label with "flag")
        const flagElements = screen.getAllByLabelText(/flag$/i)
        expect(flagElements.length).toBeGreaterThan(0)
    })

    it('navigates with boughtCountry param when viewMode is purchase', async () => {
        const user = userEvent.setup()
        renderComponent({ viewMode: 'purchase' })

        const spainButton = screen.getByText('Spain').closest('button')
        expect(spainButton).toBeInTheDocument()

        if (spainButton) {
            await user.click(spainButton)
        }

        expect(mockNavigate).toHaveBeenCalledWith('/?boughtCountry=Spain')
    })

    it('navigates with country param when viewMode is origin', async () => {
        const user = userEvent.setup()
        renderComponent({ viewMode: 'origin' })

        const spainButton = screen.getByText('Spain').closest('button')
        expect(spainButton).toBeInTheDocument()

        if (spainButton) {
            await user.click(spainButton)
        }

        expect(mockNavigate).toHaveBeenCalledWith('/?country=Spain')
    })

    it('limits displayed countries to maxItems', () => {
        renderComponent({ maxItems: 3 })
        expect(screen.getByText('Spain')).toBeInTheDocument()
        expect(screen.getByText('Germany')).toBeInTheDocument()
        expect(screen.getByText('Belgium')).toBeInTheDocument()
        expect(screen.queryByText('France')).not.toBeInTheDocument()
        expect(screen.queryByText('Italy')).not.toBeInTheDocument()
    })

    it('handles empty country data', () => {
        renderComponent({ countryData: [] })
        expect(screen.getByText('🏆 Top Countries')).toBeInTheDocument()
        expect(screen.queryByText('Spain')).not.toBeInTheDocument()
    })

    it('handles countries without flag emojis gracefully', () => {
        const dataWithUnknownCountry: CountryStatistic[] = [
            { country: 'Unknown Country', count: 1 }
        ]
        renderComponent({ countryData: dataWithUnknownCountry })
        expect(screen.getByText('Unknown Country')).toBeInTheDocument()
        expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('renders countries in correct order', () => {
        renderComponent()
        const buttons = screen.getAllByRole('button')
        // First button should be Spain (rank 1)
        expect(buttons[0]).toHaveTextContent('Spain')
        // Second button should be Germany (rank 2)
        expect(buttons[1]).toHaveTextContent('Germany')
    })

    it('applies correct styling classes', () => {
        renderComponent()
        const container = screen.getByText('🏆 Top Countries').closest('div')
        expect(container).toHaveClass('bg-white/85', 'backdrop-blur-lg', 'rounded-xl', 'p-6', 'shadow-card')
    })

    it('handles special characters in country names', () => {
        const dataWithSpecialChars: CountryStatistic[] = [
            { country: "Côte d'Ivoire", count: 1 }
        ]
        renderComponent({ countryData: dataWithSpecialChars })
        expect(screen.getByText("Côte d'Ivoire")).toBeInTheDocument()
    })
})

