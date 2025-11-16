import { useState, useEffect } from 'react'
import { loadAllBrands } from '../utils/dataLoader'
import GalleryCard from './GalleryCard'

function Gallery() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true)
      const data = await loadAllBrands()
      setBrands(data)
      setLoading(false)
    }
    fetchBrands()
  }, [])

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
          <p className="gallery-subtitle">{brands.length} unique glasses from around the world</p>
        </header>
        {/* Future: Add filters, search, or sorting controls here */}
        <div className="gallery-grid">
          {brands.map((brand) => (
            <GalleryCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gallery

