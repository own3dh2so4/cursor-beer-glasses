import { useNavigate } from 'react-router-dom'
import type { StatisticsViewMode, CountryStatistic } from '@/shared/types'
import { getCountryFlag } from '../utils/countryAliases'

interface TopCountriesListProps {
    countryData: CountryStatistic[]
    viewMode: StatisticsViewMode
    maxItems?: number
}

export function TopCountriesList({ countryData, viewMode, maxItems = 12 }: TopCountriesListProps) {
    const navigate = useNavigate()

    const handleCountryClick = (country: string) => {
        const param = viewMode === 'purchase' ? 'boughtCountry' : 'country'
        navigate(`/?${param}=${encodeURIComponent(country)}`)
    }

    const displayCountries = countryData.slice(0, maxItems)

    return (
        <div className="bg-white/85 backdrop-blur-lg rounded-xl p-6 shadow-card">
            <h3 className="text-xl tablet:text-2xl font-bold text-primary mb-4 drop-shadow-sm">
                🏆 Top Countries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayCountries.map(({ country, count }, index) => {
                    const rank = index + 1
                    const flagEmoji = getCountryFlag(country)

                    let rankDisplay
                    if (rank === 1) {
                        rankDisplay = (
                            <span className="text-2xl" role="img" aria-label="Gold Medal">
                                🥇
                            </span>
                        )
                    } else if (rank === 2) {
                        rankDisplay = (
                            <span className="text-2xl" role="img" aria-label="Silver Medal">
                                🥈
                            </span>
                        )
                    } else if (rank === 3) {
                        rankDisplay = (
                            <span className="text-2xl" role="img" aria-label="Bronze Medal">
                                🥉
                            </span>
                        )
                    } else {
                        rankDisplay = (
                            <span className="text-gray-400 font-mono font-bold w-8 text-center">
                                #{rank}
                            </span>
                        )
                    }

                    return (
                        <button
                            key={country}
                            onClick={() => handleCountryClick(country)}
                            className="flex justify-between items-center p-3 bg-slate-50/60 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 group text-left w-full"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8">
                                    {rankDisplay}
                                </div>
                                {flagEmoji && (
                                    <span className="text-2xl" role="img" aria-label={`${country} flag`}>
                                        {flagEmoji}
                                    </span>
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
    )
}

