import { describe, it, expect } from 'vitest'
import { getCountryFlagEmoji, getCountryFlag, COUNTRY_CODES } from '../countryAliases'

describe('Flag Emoji Functions', () => {
    describe('getCountryFlagEmoji', () => {
        it('converts valid ISO codes to flag emojis', () => {
            expect(getCountryFlagEmoji('es')).toBe('🇪🇸')
            expect(getCountryFlagEmoji('us')).toBe('🇺🇸')
            expect(getCountryFlagEmoji('gb')).toBe('🇬🇧')
            expect(getCountryFlagEmoji('de')).toBe('🇩🇪')
            expect(getCountryFlagEmoji('fr')).toBe('🇫🇷')
            expect(getCountryFlagEmoji('it')).toBe('🇮🇹')
        })

        it('handles lowercase codes', () => {
            expect(getCountryFlagEmoji('es')).toBe('🇪🇸')
            expect(getCountryFlagEmoji('ES')).toBe('🇪🇸')
            expect(getCountryFlagEmoji('Es')).toBe('🇪🇸')
        })

        it('returns empty string for invalid codes', () => {
            expect(getCountryFlagEmoji('')).toBe('')
            expect(getCountryFlagEmoji('a')).toBe('')
            expect(getCountryFlagEmoji('abc')).toBe('')
            expect(getCountryFlagEmoji('12')).toBe('')
        })

        it('returns empty string for undefined', () => {
            expect(getCountryFlagEmoji(undefined)).toBe('')
        })

        it('handles all countries in COUNTRY_CODES', () => {
            const testCodes = [
                'be', 'nl', 'ie', 'jp', 'cn', 'au', 'ca', 'mx', 'br', 'ar',
                'pt', 'at', 'ch', 'se', 'no', 'dk', 'fi', 'pl', 'gr', 'tr',
                'in', 'th', 'vn', 'sg', 'my', 'id', 'ph', 'nz', 'za', 'eg',
                'ma', 'ke', 'cl', 'co', 'pe', 've', 'hu', 'ro', 'bg', 'hr',
                'rs', 'si', 'sk', 'ua', 'by', 'ee', 'lv', 'lt', 'is', 'ru',
                'cz', 'kr', 'kp', 'ae'
            ]

            testCodes.forEach(code => {
                const emoji = getCountryFlagEmoji(code)
                expect(emoji).toBeTruthy()
                expect(emoji.length).toBeGreaterThan(0)
            })
        })
    })

    describe('getCountryFlag', () => {
        it('gets flag emoji from country name', () => {
            expect(getCountryFlag('Spain')).toBe('🇪🇸')
            expect(getCountryFlag('United States of America')).toBe('🇺🇸')
            expect(getCountryFlag('United Kingdom')).toBe('🇬🇧')
            expect(getCountryFlag('Germany')).toBe('🇩🇪')
            expect(getCountryFlag('France')).toBe('🇫🇷')
        })

        it('handles country aliases', () => {
            expect(getCountryFlag('USA')).toBe('🇺🇸')
            expect(getCountryFlag('UK')).toBe('🇬🇧')
            expect(getCountryFlag('Czech Republic')).toBe('🇨🇿')
        })

        it('gets flag emoji for Luxembourg', () => {
            expect(getCountryFlag('Luxembourg')).toBe('🇱🇺')
            expect(getCountryFlagEmoji('lu')).toBe('🇱🇺')
        })

        it('returns empty string for unknown countries', () => {
            expect(getCountryFlag('Atlantis')).toBe('')
            expect(getCountryFlag('Unknown Country')).toBe('')
        })

        it('handles case insensitive country names', () => {
            expect(getCountryFlag('SPAIN')).toBe('🇪🇸')
            expect(getCountryFlag('spain')).toBe('🇪🇸')
            expect(getCountryFlag('Spain')).toBe('🇪🇸')
        })

        it('handles countries with special characters', () => {
            // Test that normalization works
            expect(getCountryFlag('  Spain  ')).toBe('🇪🇸')
        })

        it('all countries in COUNTRY_CODES have flag emojis', () => {
            const countriesWithoutFlags: string[] = []
            
            Object.entries(COUNTRY_CODES).forEach(([countryName, code]) => {
                // Skip special cases (Scotland, Wales, England) as they have non-standard codes
                if (code.includes('-')) {
                    return
                }
                
                const flag = getCountryFlag(countryName)
                if (!flag) {
                    countriesWithoutFlags.push(`${countryName} (${code})`)
                }
            })
            
            expect(countriesWithoutFlags).toEqual([])
        })
    })
})

