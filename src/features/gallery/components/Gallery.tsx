import { useState, useEffect, useMemo } from 'react'
import { loadAllBrands } from '../../../shared/utils/dataLoader'
import GalleryCard from './GalleryCard'
import FilterBar from './FilterBar'
import type { Brand, Filters } from '../../../shared/types'

function Gallery() {
  const [allBrands, setAllBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    country: '',
    glassCount: '',
    gotMethod: '',
    boughtCountry: '',
    sort: 'name-asc'
  })

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true)
      const data = await loadAllBrands()
      setAllBrands(data)
      setLoading(false)
    }
    fetchBrands()
  }, [])

  // Apply all filters
  const filteredAndSortedBrands = useMemo(() => {
    let result = [...allBrands]

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(brand => 
        brand.name.toLowerCase().includes(searchLower)
      )
    }

    // Filter by country
    if (filters.country) {
      result = result.filter(brand => brand.from_country === filters.country)
    }

    // Filter by glass count
    if (filters.glassCount === 'single') {
      result = result.filter(brand => brand.glasses.length === 1)
    } else if (filters.glassCount === 'multiple') {
      result = result.filter(brand => brand.glasses.length > 1)
    }

    // Filter by got method
    if (filters.gotMethod) {
      result = result.filter(brand => 
        brand.glasses.some(glass => glass.got === filters.gotMethod)
      )
    }

    // Filter by bought country
    if (filters.boughtCountry) {
      result = result.filter(brand =>
        brand.glasses.some(glass => glass.bought_country === filters.boughtCountry)
      )
    }

    // Sort
    switch (filters.sort) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'country-asc':
        result.sort((a, b) => a.from_country.localeCompare(b.from_country))
        break
      case 'glasses-desc':
        result.sort((a, b) => b.glasses.length - a.glasses.length)
        break
      case 'glasses-asc':
        result.sort((a, b) => a.glasses.length - b.glasses.length)
        break
      default:
        break
    }

    return result
  }, [allBrands, filters])

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({
      search: '',
      country: '',
      glassCount: '',
      gotMethod: '',
      boughtCountry: '',
      sort: 'name-asc'
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="gallery-wrapper">
      <div className="gallery-background" />
      <div className="gallery-overlay" />
      <div className="gallery-container">
        <header className="gallery-header">
          <h1 className="gallery-title">Own3dh2so4 Beer Glasses Collection</h1>
          <p className="gallery-subtitle">
            Showing <strong>{filteredAndSortedBrands.length}</strong> of <strong>{allBrands.length}</strong> brands
          </p>
        </header>
        
        <FilterBar 
          brands={filteredAndSortedBrands}
          allBrands={allBrands}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {filteredAndSortedBrands.length === 0 ? (
          <div className="no-results">
            <p className="no-results-text">😔 No beers match your filters</p>
            <button className="no-results-button" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredAndSortedBrands.map((brand) => (
              <GalleryCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery

