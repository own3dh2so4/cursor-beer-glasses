import type { Brand } from '@/shared/types'

interface BreweryInfoProps {
  brand: Brand
  textColor: string
}

function BreweryInfo({ brand, textColor }: BreweryInfoProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-slate-100" style={{ color: textColor }}>Brewery Information</h2>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 tablet:gap-4 desktop:gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Name:</span>
          <span className="text-sm" style={{ color: textColor }}>{brand.name}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>City:</span>
          <span className="text-sm" style={{ color: textColor }}>{brand.from_city}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Country:</span>
          <span className="text-sm" style={{ color: textColor }}>{brand.from_country}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: textColor }}>Website:</span>
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-default break-words hover:underline"
            style={{ color: textColor }}
          >
            {brand.website}
          </a>
        </div>
      </div>

      {brand.map && (
        <div className="mt-4 rounded-xl overflow-hidden shadow-card">
          <iframe
            src={brand.map}
            width="100%"
            className="block w-full h-[200px] border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${brand.name}`}
          ></iframe>
        </div>
      )}
    </div>
  )
}

export default BreweryInfo

