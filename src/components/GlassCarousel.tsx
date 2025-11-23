import { getAssetPath } from '../utils/dataLoader'
import type { Glass } from '../types'

interface GlassCarouselProps {
  glasses: Glass[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

function GlassCarousel({ glasses, currentIndex, onIndexChange }: GlassCarouselProps) {
  const handlePrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : glasses.length - 1)
  }

  const handleNext = () => {
    onIndexChange(currentIndex < glasses.length - 1 ? currentIndex + 1 : 0)
  }

  const currentGlass = glasses[currentIndex]

  if (!currentGlass) {
    return null
  }

  return (
    <div className="glass-carousel">
      <div className="carousel-container">
        {glasses.length > 1 && (
          <button 
            className="carousel-button carousel-button-left" 
            onClick={handlePrevious}
            aria-label="Previous glass"
          >
            &#8249;
          </button>
        )}
        
        <div className="carousel-image-container">
          <img 
            src={getAssetPath(currentGlass.photo || '')} 
            alt={currentGlass.name}
            className="carousel-image"
          />
        </div>
        
        {glasses.length > 1 && (
          <button 
            className="carousel-button carousel-button-right" 
            onClick={handleNext}
            aria-label="Next glass"
          >
            &#8250;
          </button>
        )}
      </div>
      
      {glasses.length > 1 && (
        <div className="carousel-indicators">
          {glasses.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => onIndexChange(index)}
              aria-label={`Go to glass ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default GlassCarousel

