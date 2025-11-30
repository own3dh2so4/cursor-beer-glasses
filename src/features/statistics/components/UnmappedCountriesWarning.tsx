interface UnmappedCountriesWarningProps {
    countries: string[]
}

function UnmappedCountriesWarning({ countries }: UnmappedCountriesWarningProps) {
    if (countries.length === 0) return null

    return (
        <div className="mt-4 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-lg p-4 shadow-card">
            <div className="flex items-start gap-2">
                <span className="text-amber-600 text-lg" role="img" aria-label="Warning">⚠️</span>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-800 mb-1">
                        Countries Not Found on Map
                    </h3>
                    <p className="text-xs text-amber-700 mb-2">
                        The following {countries.length === 1 ? 'country' : 'countries'} from your collection could not be matched to the world map:
                    </p>
                    <ul className="text-xs text-amber-800 list-disc list-inside space-y-1">
                        {countries.map(country => (
                            <li key={country} className="font-medium">{country}</li>
                        ))}
                    </ul>
                    <p className="text-xs text-amber-600 mt-2 italic">
                        These countries won't appear on the map. Consider adding aliases in the code if needed.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UnmappedCountriesWarning
