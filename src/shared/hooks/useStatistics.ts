import { useMemo } from 'react'
import type { Brand, Statistics, StatisticsViewMode, CountryStatistic } from '@/shared/types'

/**
 * Custom hook to calculate statistics from brand data
 * Supports two view modes: purchase (where glasses were bought) and origin (brewery location)
 */
export const useStatistics = (
    brands: Brand[],
    viewMode: StatisticsViewMode
): Statistics => {
    return useMemo(() => {
        if (!brands || brands.length === 0) {
            return {
                totalGlasses: 0,
                totalBrands: 0,
                uniqueCountries: 0,
                countryData: []
            }
        }

        const countryMap = new Map<string, number>()

        if (viewMode === 'purchase') {
            // Count glasses by purchase country
            brands.forEach(brand => {
                brand.glasses.forEach(glass => {
                    if (glass.bought_country) {
                        const count = countryMap.get(glass.bought_country) || 0
                        countryMap.set(glass.bought_country, count + 1)
                    }
                })
            })
        } else {
            // Count brands/glasses by brewery origin country
            brands.forEach(brand => {
                if (brand.from_country) {
                    const glassCount = brand.glasses.length
                    const count = countryMap.get(brand.from_country) || 0
                    countryMap.set(brand.from_country, count + glassCount)
                }
            })
        }

        // Convert map to array and sort by count descending
        const countryData: CountryStatistic[] = Array.from(countryMap.entries())
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)

        // Calculate totals
        const totalGlasses = brands.reduce((sum, brand) => sum + brand.glasses.length, 0)
        const totalBrands = brands.length
        const uniqueCountries = countryMap.size

        return {
            totalGlasses,
            totalBrands,
            uniqueCountries,
            countryData
        }
    }, [brands, viewMode])
}
