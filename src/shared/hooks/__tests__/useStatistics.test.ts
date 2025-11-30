import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useStatistics } from '@/shared/hooks/useStatistics'
import { mockBrand1, mockBrand2 } from '@/test/mocks/mockBrands'

describe('useStatistics', () => {
    const mockBrands = [mockBrand1, mockBrand2]

    describe('purchase mode', () => {
        it('should calculate statistics for purchase mode', () => {
            const { result } = renderHook(() => useStatistics(mockBrands, 'purchase'))

            expect(result.current.totalGlasses).toBeGreaterThan(0)
            expect(result.current.totalBrands).toBe(2)
            expect(result.current.uniqueCountries).toBeGreaterThan(0)
            expect(result.current.countryData).toBeInstanceOf(Array)
        })

        it('should count glasses by bought_country', () => {
            const { result } = renderHook(() => useStatistics(mockBrands, 'purchase'))

            // All glasses should be counted
            const totalInCountries = result.current.countryData.reduce((sum, c) => sum + c.count, 0)
            expect(totalInCountries).toBe(result.current.totalGlasses)
        })

        it('should sort countries by count descending', () => {
            const { result } = renderHook(() => useStatistics(mockBrands, 'purchase'))

            for (let i = 0; i < result.current.countryData.length - 1; i++) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                expect(result.current.countryData[i]!.count).toBeGreaterThanOrEqual(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    result.current.countryData[i + 1]!.count
                )
            }
        })
    })

    describe('origin mode', () => {
        it('should calculate statistics for origin mode', () => {
            const { result } = renderHook(() => useStatistics(mockBrands, 'origin'))

            expect(result.current.totalGlasses).toBeGreaterThan(0)
            expect(result.current.totalBrands).toBe(2)
            expect(result.current.uniqueCountries).toBeGreaterThan(0)
            expect(result.current.countryData).toBeInstanceOf(Array)
        })

        it('should count glasses by from_country', () => {
            const { result } = renderHook(() => useStatistics(mockBrands, 'origin'))

            expect(result.current.totalGlasses).toBe(3)
            expect(result.current.totalBrands).toBe(2)
            expect(result.current.countryData).toHaveLength(2)

            // Ireland has 2 glasses, Spain has 1 glass
            expect(result.current.countryData[0]?.country).toBe('Ireland')
            expect(result.current.countryData[0]?.count).toBe(2)
            expect(result.current.countryData[1]?.country).toBe('Spain')
            expect(result.current.countryData[1]?.count).toBe(1)

            // All glasses should be counted
            const totalInCountries = result.current.countryData.reduce((sum, c) => sum + c.count, 0)
            expect(totalInCountries).toBe(result.current.totalGlasses)
        })
    })

    describe('edge cases', () => {
        it('should handle empty brands array', () => {
            const { result } = renderHook(() => useStatistics([], 'purchase'))

            expect(result.current.totalGlasses).toBe(0)
            expect(result.current.totalBrands).toBe(0)
            expect(result.current.uniqueCountries).toBe(0)
            expect(result.current.countryData).toEqual([])
        })
    })
})
