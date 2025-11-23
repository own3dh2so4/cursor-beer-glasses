import { getAssetPath } from '../../../shared/utils/dataLoader'
import type { Glass } from '../../../shared/types'

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
    <div className="w-full">
      <div className="relative flex items-center justify-center mb-3">
        {glasses.length > 1 && (
          <button 
            className="absolute top-1/2 -translate-y-1/2 left-2.5 tablet:left-2.5 desktop:left-4 bg-white/95 border-2 border-primary text-primary w-10 h-10 rounded-full text-2xl cursor-pointer transition-default flex items-center justify-center z-10 shadow-card backdrop-blur-sm hover:bg-primary hover:text-white hover:scale-110" 
            onClick={handlePrevious}
            aria-label="Previous glass"
          >
            &#8249;
          </button>
        )}
        
        <div className="w-full max-w-full min-h-[400px] desktop:min-h-[500px] flex items-center justify-center bg-transparent rounded-xl p-1 desktop:p-1 relative overflow-hidden">
          <img 
            src={getAssetPath(currentGlass.photo || '')} 
            alt={currentGlass.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out rounded-lg hover:scale-105"
          />
        </div>
        
        {glasses.length > 1 && (
          <button 
            className="absolute top-1/2 -translate-y-1/2 right-2.5 tablet:right-2.5 desktop:right-4 bg-white/95 border-2 border-primary text-primary w-10 h-10 rounded-full text-2xl cursor-pointer transition-default flex items-center justify-center z-10 shadow-card backdrop-blur-sm hover:bg-primary hover:text-white hover:scale-110" 
            onClick={handleNext}
            aria-label="Next glass"
          >
            &#8250;
          </button>
        )}
      </div>
      
      {glasses.length > 1 && (
        <div className="flex gap-2 justify-center">
          {glasses.map((_, index) => (
            <button
              key={index}
              className={`h-3 rounded-full border-2 border-primary bg-white cursor-pointer transition-default p-0 hover:bg-accent hover:border-accent ${
                index === currentIndex ? 'bg-primary w-8 rounded-md' : 'w-3'
              }`}
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

