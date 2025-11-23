import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadBrandById, getAssetPath } from '../../../shared/utils/dataLoader'
import useImageBrightness from '../../../shared/hooks/useImageBrightness'
import BreweryInfo from './BreweryInfo'
import GlassCarousel from './GlassCarousel'
import GlassInfo from './GlassInfo'
import type { Brand } from '../../../shared/types'

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
      <div className="flex justify-center items-center min-h-screen text-2xl text-gray-500">
        <div className="animate-pulse-slow">Loading...</div>
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
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/data/background.png')] bg-cover bg-center bg-no-repeat bg-fixed -z-20" />
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-10" />
      <div className="relative max-w-[1400px] mx-auto px-4 py-6 tablet:px-8 tablet:py-8 desktop:px-8 desktop:py-8 min-h-screen z-10">
        <button 
          className="bg-white border-2 border-primary text-primary px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-default mb-4 shadow-card hover:bg-primary hover:text-white hover:-translate-x-1 hover:shadow-card-hover" 
          onClick={() => navigate('/')}
          style={{ backgroundColor, color: textColor }}
        >
          &#8592; Back to Gallery
        </button>
        
        <header className="text-center mb-6 tablet:mb-6">
          <a 
            href={brand.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block transition-default p-4 tablet:p-6 bg-white/95 rounded-xl shadow-card backdrop-blur-sm hover:scale-105 hover:shadow-card-hover"
            style={{ backgroundColor }}
          >
            {brand.name_image && (
              <img 
                src={getAssetPath(brand.name_image)} 
                alt={brand.name}
                className="max-w-full h-auto max-h-20 tablet:max-h-[100px] desktop:max-h-[100px] object-contain"
              />
            )}
          </a>
        </header>

        <div className="flex flex-col gap-4 tablet:gap-5">
          <div className="grid grid-cols-1 tablet:grid-cols-[1.5fr_3.5fr] gap-4 tablet:gap-5">
            <section className="bg-white/98 rounded-xl p-5 tablet:p-5 desktop:p-6 shadow-card backdrop-blur-sm desktop:flex desktop:items-center desktop:justify-center" style={{ backgroundColor, color: textColor }}>
              <GlassCarousel 
                glasses={brand.glasses}
                currentIndex={currentGlassIndex}
                onIndexChange={setCurrentGlassIndex}
              />
            </section>

            <section className="bg-white/98 rounded-xl p-5 tablet:p-5 desktop:p-6 shadow-card backdrop-blur-sm" style={{ backgroundColor, color: textColor }}>
              <GlassInfo glass={currentGlass} textColor={textColor} />
            </section>
          </div>

          <section className="bg-white/98 rounded-xl p-5 tablet:p-5 desktop:p-6 shadow-card backdrop-blur-sm" style={{ backgroundColor, color: textColor }}>
            <BreweryInfo brand={brand} textColor={textColor} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default BrandDetail

