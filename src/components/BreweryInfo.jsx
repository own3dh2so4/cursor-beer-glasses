function BreweryInfo({ brand, textColor }) {
  return (
    <div className="brewery-info">
      <h2 className="section-title" style={{ color: textColor }}>Brewery Information</h2>
      
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Name:</span>
          <span className="info-value" style={{ color: textColor }}>{brand.name}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>City:</span>
          <span className="info-value" style={{ color: textColor }}>{brand.from_city}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Country:</span>
          <span className="info-value" style={{ color: textColor }}>{brand.from_country}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label" style={{ color: textColor }}>Website:</span>
          <a 
            href={brand.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="info-link"
            style={{ color: textColor }}
          >
            {brand.website}
          </a>
        </div>
      </div>

      {brand.map && (
        <div className="map-container">
          <iframe
            src={brand.map}
            width="100%"
            style={{ border: 0 }}
            allowFullScreen=""
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

