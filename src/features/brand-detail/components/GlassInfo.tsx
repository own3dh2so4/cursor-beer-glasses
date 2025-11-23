import type { Glass } from '../../../shared/types'

interface GlassInfoProps {
  glass: Glass
  textColor: string
}

function GlassInfo({ glass, textColor }: GlassInfoProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-slate-100" style={{ color: textColor }}>Glass Details</h2>
      
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 tablet:gap-4 desktop:gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Name:</span>
          <span className="text-sm" style={{ color: textColor }}>{glass.name}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Bought in:</span>
          <span className="text-sm" style={{ color: textColor }}>{glass.bought_city}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Country:</span>
          <span className="text-sm" style={{ color: textColor }}>{glass.bought_country}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Acquired:</span>
          <span className="text-sm" style={{ color: textColor }}>{glass.got}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>From:</span>
          <span className="text-sm" style={{ color: textColor }}>{glass.got_from}</span>
        </div>
      </div>

      {glass.map && (
        <div className="mt-4 rounded-xl overflow-hidden shadow-card">
          <iframe
            src={glass.map}
            width="100%"
            className="block w-full h-[200px] border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${glass.bought_city}`}
          ></iframe>
        </div>
      )}
    </div>
  )
}

export default GlassInfo

