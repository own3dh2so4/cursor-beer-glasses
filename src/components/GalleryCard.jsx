import { useNavigate } from 'react-router-dom'
import { getAssetPath } from '../utils/dataLoader'

function GalleryCard({ brand }) {
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

