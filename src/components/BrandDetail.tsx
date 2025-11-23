import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadBrandById, getAssetPath } from '../utils/dataLoader'
import useImageBrightness from '../hooks/useImageBrightness'
import BreweryInfo from './BreweryInfo'
import GlassCarousel from './GlassCarousel'
import GlassInfo from './GlassInfo'
import type { Brand } from '../types'

function BrandDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentGlassIndex, setCurrentGlassIndex] = useState<number>(0)
  
  // Analyze image brightness to determine background and text colors
  const imageUrl = brand?.name_image ? getAssetPath(brand.name_image) : ''
  const { backgroundColor, textColor } = useImageBrightness(imageUrl)

  useEffect(() => {
    async function fetchBrand() {
      if (!id) {
        navigate('/')
        return
      }

      setLoading(true)
      const data = await loadBrandById(id)
      
      if (!data) {
        // Brand not found, redirect to gallery
        navigate('/')
        return
      }
      
      setBrand(data)
      setCurrentGlassIndex(0)
      setLoading(false)
    }
    fetchBrand()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (!brand) {
    return null
  }

  const currentGlass = brand.glasses[currentGlassIndex]

  if (!currentGlass) {
    return null
  }

  return (
    <div className="brand-detail-wrapper">
      <div className="brand-detail-background" />
      <div className="brand-detail-overlay" />
      <div className="brand-detail">
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          style={{ backgroundColor, color: textColor }}
        >
          &#8592; Back to Gallery
        </button>
        
        <header className="brand-header">
          <a 
            href={brand.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="brand-name-link"
            style={{ backgroundColor }}
          >
            {brand.name_image && (
              <img 
                src={getAssetPath(brand.name_image)} 
                alt={brand.name}
                className="brand-name-image"
              />
            )}
          </a>
        </header>

        <div className="brand-content">
          <div className="glass-sections">
            <section className="brand-section glass-photo-section" style={{ backgroundColor, color: textColor }}>
              <GlassCarousel 
                glasses={brand.glasses}
                currentIndex={currentGlassIndex}
                onIndexChange={setCurrentGlassIndex}
              />
            </section>

            <section className="brand-section glass-details-section" style={{ backgroundColor, color: textColor }}>
              <GlassInfo glass={currentGlass} textColor={textColor} />
            </section>
          </div>

          <section className="brand-section" style={{ backgroundColor, color: textColor }}>
            <BreweryInfo brand={brand} textColor={textColor} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default BrandDetail

