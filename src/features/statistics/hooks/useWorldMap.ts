import { useMemo, useEffect, useState } from 'react'
import { geoPath, geoMercator } from 'd3-geo'
import { feature } from 'topojson-client'
import type { CountryStatistic } from '@/shared/types'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { FeatureCollection } from 'geojson'
import { normalizeCountryName } from '../utils/countryAliases'

interface WorldData extends Topology {
    objects: {
        countries: GeometryCollection
    }
}

export function useWorldMap(countryData: CountryStatistic[]) {
    const [worldData, setWorldData] = useState<FeatureCollection | null>(null)

    // Load world topology data from local file
    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL || '/'
        const atlasPath = `${baseUrl}data/world-atlas-countries-110m.json`

        fetch(atlasPath)
            .then(res => res.json())
            .then((data: WorldData) => {
                const countries = feature(data, data.objects.countries) as FeatureCollection
                setWorldData(countries)
            })
            .catch(err => console.error('Error loading world map:', err))
    }, [])

    // Create a map of country names to counts (using normalized names)
    const countryMap = useMemo(() => {
        const map = new Map<string, { count: number; originalName: string }>()
        countryData.forEach(({ country, count }) => {
            const normalized = normalizeCountryName(country)
            map.set(normalized, { count, originalName: country })
        })
        return map
    }, [countryData])

    // Detect unmapped countries (countries in data that don't exist in the world map)
    const unmappedCountries = useMemo(() => {
        if (!worldData) return []

        const mapCountries = new Set(
            worldData.features.map(f => {
                const name = (f.properties?.name as string) || ''
                return name.toLowerCase().trim()
            })
        )

        const unmapped: string[] = []
        countryData.forEach(({ country }) => {
            const normalized = normalizeCountryName(country)
            if (!mapCountries.has(normalized)) {
                unmapped.push(country)
            }
        })

        return [...new Set(unmapped)] // Remove duplicates
    }, [worldData, countryData])

    // Get max count for color scaling
    const maxCount = useMemo(() => {
        return Math.max(...countryData.map(d => d.count), 1)
    }, [countryData])

    // Projection and path generator
    const projection = useMemo(() => {
        return geoMercator()
            .scale(130)
            .translate([400, 280])
    }, [])

    const pathGenerator = useMemo(() => {
        return geoPath().projection(projection)
    }, [projection])

    // Get color based on count
    const getCountryColor = (countryName: string) => {
        const normalized = normalizeCountryName(countryName)
        const data = countryMap.get(normalized)

        if (!data) return '#e2e8f0' // Light gray for no data

        // Calculate color intensity based on count
        const intensity = data.count / maxCount
        // Use a gradient from light blue to dark blue
        const hue = 210 // Blue hue
        const saturation = 70 + (intensity * 30)
        const lightness = 75 - (intensity * 45)

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }

    return {
        worldData,
        countryMap,
        unmappedCountries,
        pathGenerator,
        getCountryColor
    }
}
