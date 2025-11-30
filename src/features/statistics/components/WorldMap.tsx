import { useNavigate } from 'react-router-dom'
import type { StatisticsViewMode, CountryStatistic } from '@/shared/types'
import type { Feature, Geometry } from 'geojson'
import { useWorldMap } from '../hooks/useWorldMap'
import { useMapInteractions } from '../hooks/useMapInteractions'
import { normalizeCountryName } from '../utils/countryAliases'
import MapControls from './MapControls'
import UnmappedCountriesWarning from './UnmappedCountriesWarning'

interface WorldMapProps {
    countryData: CountryStatistic[]
    viewMode: StatisticsViewMode
}

function WorldMap({ countryData, viewMode }: WorldMapProps) {
    const navigate = useNavigate()

    // Load map data and geography
    const { worldData, countryMap, unmappedCountries, pathGenerator, getCountryColor } = useWorldMap(countryData)

    // Handle interactions (zoom, pan, tooltip)
    const {
        hoveredCountry,
        tooltip,
        zoom,
        pan,
        isPanning,
        containerRef,
        handleMouseEnter,
        handleMouseMove,
        handleMouseLeave,
        handleMouseDown,
        handleMapMouseMove,
        handleMouseUp,
        handleZoomIn,
        handleZoomOut,
        handleResetView
    } = useMapInteractions(countryMap)

    // Handle country click
    const handleCountryClick = (countryName: string) => {
        const normalized = normalizeCountryName(countryName)
        const data = countryMap.get(normalized)

        if (!data) return // Don't navigate if no data

        // Navigate to gallery with appropriate filter using original country name
        const param = viewMode === 'purchase' ? 'boughtCountry' : 'country'
        navigate(`/?${param}=${encodeURIComponent(data.originalName)}`)
    }

    if (!worldData) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-white/60 backdrop-blur-sm rounded-xl shadow-card">
                <p className="text-gray-600 animate-pulse-slow">Loading map...</p>
            </div>
        )
    }

    return (
        <div className="relative" ref={containerRef}>
            {/* Zoom controls */}
            <MapControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleResetView}
            />

            <svg
                viewBox="0 0 800 500"
                className="w-full h-auto bg-white/60 backdrop-blur-sm rounded-xl shadow-card"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMapMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                    {worldData.features.map((feature, index) => {
                        const countryName = (feature.properties?.name as string) || ''
                        const normalized = normalizeCountryName(countryName)
                        const hasData = countryMap.has(normalized)

                        return (
                            <path
                                key={`country-${index}`}
                                d={pathGenerator(feature as Feature<Geometry>) || ''}
                                fill={getCountryColor(countryName)}
                                stroke="#ffffff"
                                strokeWidth={0.5 / zoom}
                                className={`transition-all duration-200 ${hasData ? 'cursor-pointer hover:opacity-80' : ''
                                    } ${hoveredCountry === countryName ? 'opacity-80' : ''}`}
                                onMouseEnter={(e) => handleMouseEnter(e, countryName)}
                                onMouseMove={(e) => handleMouseMove(e)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => hasData && handleCountryClick(countryName)}
                                role={hasData ? 'button' : undefined}
                                tabIndex={hasData ? 0 : undefined}
                                aria-label={hasData ? `${countryName}: ${countryMap.get(normalized)?.count} glasses` : undefined}
                                onKeyDown={(e) => {
                                    if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault()
                                        handleCountryClick(countryName)
                                    }
                                }}
                            />
                        )
                    })}
                </g>
            </svg>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="absolute pointer-events-none bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50"
                    style={{
                        left: tooltip.x + 15,
                        top: tooltip.y + 10
                    }}
                >
                    <p className="font-semibold whitespace-nowrap">{tooltip.country}</p>
                    <p className="text-xs whitespace-nowrap">{tooltip.count} {tooltip.count === 1 ? 'glass' : 'glasses'}</p>
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Less</span>
                <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="w-8 h-4 rounded shadow-sm-card"
                            style={{
                                background: `hsl(210, ${70 + i * 7.5}%, ${75 - i * 11.25}%)`
                            }}
                        />
                    ))}
                </div>
                <span>More</span>
            </div>

            {/* Instructions */}
            <div className="mt-2 text-center text-xs text-gray-500">
                Use +/− buttons to zoom • Drag to pan • Click country to filter
            </div>

            {/* Unmapped Countries Warning */}
            <UnmappedCountriesWarning countries={unmappedCountries} />
        </div>
    )
}

export default WorldMap
