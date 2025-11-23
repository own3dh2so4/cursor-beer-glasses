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
    <div className="group cursor-pointer transition-default" onClick={handleClick}>
      <div className="relative w-full pt-[100%] bg-slate-50/85 backdrop-blur-md rounded-xl overflow-hidden shadow-card transition-default group-hover:-translate-y-1 group-hover:shadow-card-hover">
        <img 
          src={getAssetPath(brand.logo)} 
          alt={brand.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-default"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/75 flex items-center justify-center scale-x-0 origin-center transition-transform duration-500 ease-out group-hover:scale-x-100">
          <span className="text-white text-lg font-semibold text-center px-4 max-w-[90%] opacity-0 scale-75 transition-all duration-300 ease-out delay-200 group-hover:opacity-100 group-hover:scale-100">{brand.name}</span>
        </div>
      </div>
    </div>
  )
}

export default GalleryCard

