import type { Glass } from '../../../shared/types'

interface GlassInfoProps {
  glass: Glass
  textColor: string
}

function GlassInfo({ glass, textColor }: GlassInfoProps) {
  return (
    <div className="glass-info">
      <h2 className="section-title" style={{ color: textColor }}>Glass Details</h2>
      
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Name:</span>
          <span className="info-value" style={{ color: textColor }}>{glass.name}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Bought in:</span>
          <span className="info-value" style={{ color: textColor }}>{glass.bought_city}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Country:</span>
          <span className="info-value" style={{ color: textColor }}>{glass.bought_country}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Acquired:</span>
          <span className="info-value" style={{ color: textColor }}>{glass.got}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>From:</span>
          <span className="info-value" style={{ color: textColor }}>{glass.got_from}</span>
        </div>
      </div>

      {glass.map && (
        <div className="map-container">
          <iframe
            src={glass.map}
            width="100%"
            style={{ border: 0 }}
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

