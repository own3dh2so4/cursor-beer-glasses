import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import UnmappedCountriesWarning from '../UnmappedCountriesWarning'

describe('UnmappedCountriesWarning', () => {
    it('should not render when countries array is empty', () => {
        const { container } = render(<UnmappedCountriesWarning countries={[]} />)

        expect(container.firstChild).toBeNull()
    })

    it('should render warning when countries are provided', () => {
        render(<UnmappedCountriesWarning countries={['Atlantis', 'Narnia']} />)

        expect(screen.getByText(/Countries Not Found on Map/i)).toBeInTheDocument()
    })

    it('should display all unmapped country names', () => {
        const countries = ['Atlantis', 'Narnia', 'Wonderland']
        render(<UnmappedCountriesWarning countries={countries} />)

        countries.forEach(country => {
            expect(screen.getByText(country)).toBeInTheDocument()
        })
    })

    it('should use singular form for single country', () => {
        render(<UnmappedCountriesWarning countries={['Atlantis']} />)

        expect(screen.getByText(/The following country from your collection/i)).toBeInTheDocument()
    })

    it('should use plural form for multiple countries', () => {
        render(<UnmappedCountriesWarning countries={['Atlantis', 'Narnia']} />)

        expect(screen.getByText(/The following countries from your collection/i)).toBeInTheDocument()
    })

    it('should display warning icon', () => {
        render(<UnmappedCountriesWarning countries={['Atlantis']} />)

        const icon = screen.getByLabelText('Warning')
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveTextContent('⚠️')
    })

    it('should display helpful message about adding aliases', () => {
        render(<UnmappedCountriesWarning countries={['Atlantis']} />)

        expect(screen.getByText(/Consider adding aliases in the code if needed/i)).toBeInTheDocument()
    })

    it('should have proper styling classes', () => {
        const { container } = render(<UnmappedCountriesWarning countries={['Atlantis']} />)

        const warningDiv = container.querySelector('.bg-amber-50\\/90')
        expect(warningDiv).toBeInTheDocument()
    })
})
