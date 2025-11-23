import { useMemo, useState } from 'react'
import type { Brand, Filters, FilterOptions } from '../../../shared/types'

interface FilterBarProps {
  brands: Brand[]
  allBrands: Brand[]
  filters: Filters
  onFilterChange: (filters: Filters) => void
  onReset: () => void
}

function FilterBar({ brands, allBrands, filters, onFilterChange, onReset }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  
  // Map countries to flag emojis
  const countryFlags = useMemo<Record<string, string>>(() => ({
    // Current countries in collection
    'Belgium': '🇧🇪',
    'Czech Republic': '🇨🇿',
    'Germany': '🇩🇪',
    'Greece': '🇬🇷',
    'Hungary': '🇭🇺',
    'Ireland': '🇮🇪',
    'Italy': '🇮🇹',
    'Luxembourg': '🇱🇺',
    'Netherlands': '🇳🇱',
    'Poland': '🇵🇱',
    'Portugal': '🇵🇹',
    'Russia': '🇷🇺',
    'South Korea': '🇰🇷',
    'Spain': '🇪🇸',
    'UK': '🇬🇧',
    'USA': '🇺🇸',
    // Additional countries (for future use)
    'Austria': '🇦🇹',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷',
    'Canada': '🇨🇦',
    'China': '🇨🇳',
    'Denmark': '🇩🇰',
    'Estonia': '🇪🇪',
    'Finland': '🇫🇮',
    'France': '🇫🇷',
    'Iceland': '🇮🇸',
    'Japan': '🇯🇵',
    'Latvia': '🇱🇻',
    'Lithuania': '🇱🇹',
    'Mexico': '🇲🇽',
    'New Zealand': '🇳🇿',
    'Norway': '🇳🇴',
    'Romania': '🇷🇴',
    'Slovakia': '🇸🇰',
    'Slovenia': '🇸🇮',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'Thailand': '🇹🇭',
    'Turkey': '🇹🇷',
    'Ukraine': '🇺🇦'
  }), [])

  // Calculate available options based on current filters
  // This ensures only options with results are shown
  const filterOptions = useMemo<FilterOptions>(() => {
    // For country filter - apply all except country
    let brandsForCountry = [...allBrands]
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      brandsForCountry = brandsForCountry.filter(b => b.name.toLowerCase().includes(searchLower))
    }
    if (filters.glassCount === 'single') {
      brandsForCountry = brandsForCountry.filter(b => b.glasses.length === 1)
    } else if (filters.glassCount === 'multiple') {
      brandsForCountry = brandsForCountry.filter(b => b.glasses.length > 1)
    }
    if (filters.gotMethod) {
      brandsForCountry = brandsForCountry.filter(b => 
        b.glasses.some(g => g.got === filters.gotMethod)
      )
    }
    if (filters.boughtCountry) {
      brandsForCountry = brandsForCountry.filter(b =>
        b.glasses.some(g => g.bought_country === filters.boughtCountry)
      )
    }

    // For gotMethod - apply all except gotMethod
    let brandsForGotMethod = [...allBrands]
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      brandsForGotMethod = brandsForGotMethod.filter(b => b.name.toLowerCase().includes(searchLower))
    }
    if (filters.country) {
      brandsForGotMethod = brandsForGotMethod.filter(b => b.from_country === filters.country)
    }
    if (filters.glassCount === 'single') {
      brandsForGotMethod = brandsForGotMethod.filter(b => b.glasses.length === 1)
    } else if (filters.glassCount === 'multiple') {
      brandsForGotMethod = brandsForGotMethod.filter(b => b.glasses.length > 1)
    }
    if (filters.boughtCountry) {
      brandsForGotMethod = brandsForGotMethod.filter(b =>
        b.glasses.some(g => g.bought_country === filters.boughtCountry)
      )
    }

    // For boughtCountry - apply all except boughtCountry
    let brandsForBoughtCountry = [...allBrands]
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      brandsForBoughtCountry = brandsForBoughtCountry.filter(b => b.name.toLowerCase().includes(searchLower))
    }
    if (filters.country) {
      brandsForBoughtCountry = brandsForBoughtCountry.filter(b => b.from_country === filters.country)
    }
    if (filters.glassCount === 'single') {
      brandsForBoughtCountry = brandsForBoughtCountry.filter(b => b.glasses.length === 1)
    } else if (filters.glassCount === 'multiple') {
      brandsForBoughtCountry = brandsForBoughtCountry.filter(b => b.glasses.length > 1)
    }
    if (filters.gotMethod) {
      brandsForBoughtCountry = brandsForBoughtCountry.filter(b => 
        b.glasses.some(g => g.got === filters.gotMethod)
      )
    }

    const countries = [...new Set(brandsForCountry.map(b => b.from_country))].sort()
    
    const gotMethods = [...new Set(
      brandsForGotMethod.flatMap(b => b.glasses.map(g => g.got))
    )].filter(Boolean).sort()

    const boughtCountries = [...new Set(
      brandsForBoughtCountry.flatMap(b => b.glasses.map(g => g.bought_country).filter((c): c is string => Boolean(c)))
    )].sort()
    
    return { countries, gotMethods, boughtCountries }
  }, [allBrands, filters])

  const handleChange = (field: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const totalGlasses = brands.reduce((sum, b) => sum + b.glasses.length, 0)

  const toggleFilters = () => {
    setIsExpanded(!isExpanded)
  }

  // Check if any filter is active
  const hasActiveFilters = 
    filters.search !== '' ||
    filters.country !== '' ||
    filters.glassCount !== '' ||
    filters.gotMethod !== '' ||
    filters.boughtCountry !== '' ||
    filters.sort !== 'name-asc'

  return (
    <div className="bg-slate-50/85 backdrop-blur-xl rounded-xl p-5 tablet:p-8 desktop:p-10 mx-4 mb-8 shadow-md-card border border-white/30">
      <div 
        className="flex justify-between items-center cursor-pointer select-none p-3 rounded-lg transition-default hover:bg-white/40"
        onClick={toggleFilters}
      >
        <h2 className="text-xl font-semibold text-primary m-0 flex-1">🔍 Filters</h2>
        <button 
          className="bg-transparent text-primary border-2 border-primary/20 w-9 h-9 rounded-lg text-sm font-bold cursor-pointer transition-default flex items-center justify-center hover:bg-primary/10 hover:border-primary"
          onClick={(e) => {
            e.stopPropagation()
            toggleFilters()
          }}
          title={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
        <div className="flex justify-end mb-4 pb-4 border-b border-primary/10">
          <button 
            className="bg-accent text-white border-none px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-sm-card hover:bg-accent-dark hover:shadow-lg-card disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:shadow-none" 
            onClick={onReset}
            disabled={!hasActiveFilters}
            title={hasActiveFilters ? "Reset all filters" : "No active filters"}
          >
            ↺ Reset All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 tablet:gap-5 desktop:gap-6 mb-6">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-semibold text-primary block uppercase tracking-wide">
            Search
          </label>
          <input
            id="search"
            type="text"
            className="w-full px-3 py-3 border border-primary/15 rounded-lg text-base font-[inherit] bg-white/80 text-slate-800 transition-default focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.05)] placeholder:text-gray-500 placeholder:opacity-70"
            placeholder="Type beer name..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Origin Country */}
        <div className="flex flex-col gap-2">
          <label htmlFor="country" className="text-sm font-semibold text-primary block uppercase tracking-wide">
            📍 Origin Country
          </label>
          <select
            id="country"
            className="w-full px-3 py-3 border border-primary/15 rounded-lg text-base font-[inherit] bg-white/80 text-slate-800 transition-default focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.05)]"
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
          >
            <option value="">All Countries</option>
            {filterOptions.countries.map(country => (
              <option key={country} value={country}>
                {countryFlags[country] || '🌍'} {country}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Glasses */}
        <div className="flex flex-col gap-2">
          <label htmlFor="glassCount" className="text-sm font-semibold text-primary block uppercase tracking-wide">
            🍺 Glasses Count
          </label>
          <select
            id="glassCount"
            className="w-full px-3 py-3 border border-primary/15 rounded-lg text-base font-[inherit] bg-white/80 text-slate-800 transition-default focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.05)]"
            value={filters.glassCount}
            onChange={(e) => handleChange('glassCount', e.target.value as '' | 'single' | 'multiple')}
          >
            <option value="">All</option>
            <option value="single">Single Glass</option>
            <option value="multiple">Multiple Glasses</option>
          </select>
        </div>

        {/* How Got */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gotMethod" className="text-sm font-semibold text-primary block uppercase tracking-wide">
            🎁 How Acquired
          </label>
          <select
            id="gotMethod"
            className="w-full px-3 py-3 border border-primary/15 rounded-lg text-base font-[inherit] bg-white/80 text-slate-800 transition-default focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.05)]"
            value={filters.gotMethod}
            onChange={(e) => handleChange('gotMethod', e.target.value)}
          >
            <option value="">All Methods</option>
            {filterOptions.gotMethods.includes('buy') && <option value="buy">Bought</option>}
            {filterOptions.gotMethods.includes('present') && <option value="present">Gift</option>}
            {filterOptions.gotMethods.includes('steal') && <option value="steal">Stolen 😏</option>}
          </select>
        </div>

        {/* Bought Country */}
        <div className="flex flex-col gap-2">
          <label htmlFor="boughtCountry" className="text-sm font-semibold text-primary block uppercase tracking-wide">
            🛍️ Bought In
          </label>
          <select
            id="boughtCountry"
            className="w-full px-3 py-3 border border-primary/15 rounded-lg text-base font-[inherit] bg-white/80 text-slate-800 transition-default focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.05)]"
            value={filters.boughtCountry}
            onChange={(e) => handleChange('boughtCountry', e.target.value)}
          >
            <option value="">All Locations</option>
            {filterOptions.boughtCountries.map(country => (
              <option key={country} value={country}>
                {countryFlags[country] || '🌍'} {country}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sort" className="text-sm font-semibold text-primary block uppercase tracking-wide">
            📊 Sort By
          </label>
          <select
            id="sort"
            className="w-full px-3 py-3 border border-primary/15 rounded-lg text-base font-[inherit] bg-white/80 text-slate-800 transition-default focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.05)]"
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value as Filters['sort'])}
          >
            <option value="name-asc">A → Z (Name)</option>
            <option value="name-desc">Z → A (Name)</option>
            <option value="country-asc">Country (A → Z)</option>
            <option value="glasses-desc">Most Glasses</option>
            <option value="glasses-asc">Fewest Glasses</option>
          </select>
        </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap pt-4 border-t-2 border-primary/10">
          <span className="bg-white/60 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/15 backdrop-blur-sm">
            <strong className="font-bold text-[1.05rem] text-accent">{brands.length}</strong> brands
          </span>
          <span className="bg-white/60 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/15 backdrop-blur-sm">
            <strong className="font-bold text-[1.05rem] text-accent">{totalGlasses}</strong> glasses
          </span>
        </div>
      </div>
    </div>
  )
}

export default FilterBar

