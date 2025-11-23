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
    <div className="filter-bar">
      <div className="filter-header" onClick={toggleFilters}>
        <h2 className="filter-title">🔍 Filters</h2>
        <button 
          className="toggle-button"
          onClick={(e) => {
            e.stopPropagation()
            toggleFilters()
          }}
          title={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      <div className={`filter-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="filter-actions">
          <button 
            className="reset-button" 
            onClick={onReset}
            disabled={!hasActiveFilters}
            title={hasActiveFilters ? "Reset all filters" : "No active filters"}
          >
            ↺ Reset All Filters
          </button>
        </div>

        <div className="filter-grid">
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            Search
          </label>
          <input
            id="search"
            type="text"
            className="filter-input"
            placeholder="Type beer name..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Origin Country */}
        <div className="filter-group">
          <label htmlFor="country" className="filter-label">
            📍 Origin Country
          </label>
          <select
            id="country"
            className="filter-select"
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
        <div className="filter-group">
          <label htmlFor="glassCount" className="filter-label">
            🍺 Glasses Count
          </label>
          <select
            id="glassCount"
            className="filter-select"
            value={filters.glassCount}
            onChange={(e) => handleChange('glassCount', e.target.value as '' | 'single' | 'multiple')}
          >
            <option value="">All</option>
            <option value="single">Single Glass</option>
            <option value="multiple">Multiple Glasses</option>
          </select>
        </div>

        {/* How Got */}
        <div className="filter-group">
          <label htmlFor="gotMethod" className="filter-label">
            🎁 How Acquired
          </label>
          <select
            id="gotMethod"
            className="filter-select"
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
        <div className="filter-group">
          <label htmlFor="boughtCountry" className="filter-label">
            🛍️ Bought In
          </label>
          <select
            id="boughtCountry"
            className="filter-select"
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
        <div className="filter-group">
          <label htmlFor="sort" className="filter-label">
            📊 Sort By
          </label>
          <select
            id="sort"
            className="filter-select"
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

        <div className="filter-stats">
          <span className="stat-badge">
            <strong>{brands.length}</strong> brands
          </span>
          <span className="stat-badge">
            <strong>{totalGlasses}</strong> glasses
          </span>
        </div>
      </div>
    </div>
  )
}

export default FilterBar

