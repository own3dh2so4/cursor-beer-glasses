import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrands } from '@/shared/hooks/useBrands'
import { useStatistics } from '@/shared/hooks/useStatistics'
import { getCountryCode } from '../utils/countryAliases'
import StatsCard from './StatsCard'
import ViewModeToggle from './ViewModeToggle'
import WorldMap from './WorldMap'
import type { StatisticsViewMode } from '@/shared/types'

function Statistics() {
    const navigate = useNavigate()
    const [viewMode, setViewMode] = useState<StatisticsViewMode>('purchase')
    const { data: brands = [], isLoading, error } = useBrands()
    const statistics = useStatistics(brands, viewMode)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-2xl text-gray-500">
                <div className="animate-pulse-slow">Loading statistics...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-2xl text-red-500">
                Error loading statistics
            </div>
        )
    }

    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div className="fixed top-0 left-0 w-full h-full bg-[url('/data/background.png')] bg-cover bg-center bg-no-repeat bg-fixed -z-20" />
            <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-10" />

            <div className="relative max-w-[1400px] mx-auto px-4 py-8 tablet:px-8 tablet:py-12 z-10">
                {/* Header */}
                <header className="text-center mb-12 p-8 bg-white/85 backdrop-blur-lg rounded-xl shadow-card">
                    <h1 className="text-4xl tablet:text-5xl font-bold text-primary mb-2 drop-shadow-sm">
                        📊 Collection Statistics
                    </h1>
                    <p className="text-lg tablet:text-xl text-gray-600">
                        Explore your beer glass collection through interactive visualizations
                    </p>
                </header>

                {/* View Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <ViewModeToggle currentMode={viewMode} onModeChange={setViewMode} />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Total Glasses"
                        value={statistics.totalGlasses}
                        icon="🍺"
                        description="In your collection"
                    />
                    <StatsCard
                        title={viewMode === 'purchase' ? 'Countries Visited' : 'Brewery Countries'}
                        value={statistics.uniqueCountries}
                        icon="🌍"
                        description={viewMode === 'purchase' ? 'Where you bought glasses' : 'Origin of breweries'}
                    />
                    <StatsCard
                        title="Beer Brands"
                        value={statistics.totalBrands}
                        icon="🏭"
                        description="Different breweries"
                    />
                </div>

                {/* World Map */}
                <div className="mb-8 p-6 bg-white/85 backdrop-blur-lg rounded-xl shadow-card">
                    <h2 className="text-2xl tablet:text-3xl font-bold text-primary mb-2 text-center drop-shadow-sm">
                        {viewMode === 'purchase' ? '🗺️ Where I Bought My Glasses' : '🏭 Brewery Origins'}
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Click on a country to filter the gallery
                    </p>
                    <WorldMap countryData={statistics.countryData} viewMode={viewMode} />
                </div>

                {/* Top Countries List */}
                <div className="bg-white/85 backdrop-blur-lg rounded-xl p-6 shadow-card">
                    <h3 className="text-xl tablet:text-2xl font-bold text-primary mb-4 drop-shadow-sm">
                        Top Countries
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statistics.countryData.slice(0, 12).map(({ country, count }) => {
                            const code = getCountryCode(country)
                            return (
                                <button
                                    key={country}
                                    onClick={() => {
                                        const param = viewMode === 'purchase' ? 'boughtCountry' : 'country'
                                        navigate(`/?${param}=${encodeURIComponent(country)}`)
                                    }}
                                    className="flex justify-between items-center p-3 bg-slate-50/60 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 group text-left w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        {code && (
                                            <img
                                                src={`https://flagcdn.com/w40/${code}.png`}
                                                srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                                                width="24"
                                                alt=""
                                                className="rounded-sm shadow-sm"
                                            />
                                        )}
                                        <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">
                                            {country}
                                        </span>
                                    </div>
                                    <span className="text-primary font-bold bg-white/50 px-2 py-0.5 rounded-md group-hover:bg-primary/10 transition-colors">
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics
