import { useState, useMemo } from 'react'
import { useBrands } from '@/shared/hooks/useBrands'
import GalleryCard from './GalleryCard'
import FilterBar from './FilterBar'
import type { Filters } from '@/shared/types'

function Gallery() {
  const { data: allBrands = [], isLoading, error } = useBrands()
  const [filters, setFilters] = useState<Filters>({
    search: '',
    country: '',
    glassCount: '',
    gotMethod: '',
    boughtCountry: '',
    sort: 'name-asc'
  })

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl text-gray-500">
        <div className="animate-pulse-slow">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl text-red-500">
        Error loading brands
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/data/background.png')] bg-cover bg-center bg-no-repeat bg-fixed -z-20" />
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-10" />
      <div className="relative max-w-[1400px] mx-auto px-4 py-8 tablet:px-8 tablet:py-12 z-10">
        <header className="text-center mb-12 p-8 bg-white/85 backdrop-blur-lg rounded-xl shadow-card">
          <h1 className="text-4xl tablet:text-5xl font-bold text-primary mb-2 drop-shadow-sm">Own3dh2so4 Beer Glasses Collection</h1>
          <p className="text-lg tablet:text-xl text-gray-600">
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
          <div className="text-center py-16 px-8 bg-slate-50/85 backdrop-blur-lg rounded-xl mx-4 my-8 shadow-md-card border border-white/30">
            <p className="text-2xl text-gray-500 mb-6">😔 No beers match your filters</p>
            <button
              className="bg-primary/10 text-primary border border-primary/20 px-8 py-3 rounded-xl text-base font-semibold cursor-pointer trion-default hover:bg-primary/15 hover:border-primary"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] tablet:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] desktop:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] xl-desktop:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] 2xl-desktop:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 tablet:gap-10 2xl-desktop:gap-12 px-4">
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

