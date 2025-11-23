import { useNavigate } from 'react-router-dom'
import { getAssetPath } from '../../../shared/utils/dataLoader'
import type { Brand } from '../../../shared/types'

interface GalleryCardProps {
  brand: Brand
}

function GalleryCard({ brand }: GalleryCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/${brand.id}`)
  }

  return (
    <div className="gallery-card" onClick={handleClick}>
      <div className="gallery-card-image-container">
        <img 
          src={getAssetPath(brand.logo)} 
          alt={brand.name}
          className="gallery-card-image"
        />
        <div className="gallery-card-overlay">
          <span className="gallery-card-name">{brand.name}</span>
        </div>
      </div>
    </div>
  )
}

export default GalleryCard

