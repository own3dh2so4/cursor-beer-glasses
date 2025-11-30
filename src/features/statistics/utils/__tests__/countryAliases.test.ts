import { describe, it, expect } from 'vitest'
import { normalizeCountryName, COUNTRY_ALIASES, getCountryCode } from '../countryAliases'

describe('countryAliases', () => {
    describe('normalizeCountryName', () => {
        it('should convert to lowercase', () => {
            expect(normalizeCountryName('SPAIN')).toBe('spain')
            expect(normalizeCountryName('Spain')).toBe('spain')
        })

        it('should trim whitespace', () => {
            expect(normalizeCountryName('  Spain  ')).toBe('spain')
            expect(normalizeCountryName('\tSpain\n')).toBe('spain')
        })

        it('should apply USA aliases', () => {
            expect(normalizeCountryName('USA')).toBe('united states of america')
            expect(normalizeCountryName('US')).toBe('united states of america')
        })

        it('should apply UK alias', () => {
            expect(normalizeCountryName('UK')).toBe('united kingdom')
        })

        it('should apply Russia alias', () => {
            expect(normalizeCountryName('Russian Federation')).toBe('russia')
        })

        it('should apply Czech Republic alias', () => {
            expect(normalizeCountryName('Czech Republic')).toBe('czechia')
        })

        it('should apply South Korea alias', () => {
            expect(normalizeCountryName('Republic of Korea')).toBe('south korea')
        })

        it('should apply North Korea alias', () => {
            expect(normalizeCountryName('Dem. Rep. Korea')).toBe('north korea')
        })

        it('should return original name if no alias exists', () => {
            expect(normalizeCountryName('Spain')).toBe('spain')
            expect(normalizeCountryName('Germany')).toBe('germany')
            expect(normalizeCountryName('France')).toBe('france')
        })

        it('should handle empty string', () => {
            expect(normalizeCountryName('')).toBe('')
        })
    })

    describe('COUNTRY_ALIASES', () => {
        it('should have all expected aliases', () => {
            expect(COUNTRY_ALIASES).toHaveProperty('usa')
            expect(COUNTRY_ALIASES).toHaveProperty('uk')
            expect(COUNTRY_ALIASES).toHaveProperty('russian federation')
            expect(COUNTRY_ALIASES).toHaveProperty('czech republic')
            expect(COUNTRY_ALIASES).toHaveProperty('republic of korea')
        })

        it('should map to correct values', () => {
            expect(COUNTRY_ALIASES['usa']).toBe('united states of america')
            expect(COUNTRY_ALIASES['uk']).toBe('united kingdom')
        })
    })

    describe('getCountryCode', () => {
        it('should return correct code for known countries', () => {
            expect(getCountryCode('Spain')).toBe('es')
            expect(getCountryCode('Germany')).toBe('de')
            expect(getCountryCode('United States of America')).toBe('us')
        })

        it('should handle aliases correctly', () => {
            expect(getCountryCode('USA')).toBe('us')
            expect(getCountryCode('UK')).toBe('gb')
            expect(getCountryCode('Czech Republic')).toBe('cz')
        })

        it('should return undefined for unknown countries', () => {
            expect(getCountryCode('Atlantis')).toBeUndefined()
        })
    })
})
