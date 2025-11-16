# Adaptive Background Color Feature

## Overview

The application automatically analyzes the brightness of brand logo images and applies an appropriate background color to all components on the brand detail page. This ensures optimal contrast and readability across different brand identities.

## How It Works

### Image Brightness Analysis

The system uses the Canvas API to analyze each brand's logo image:

1. **Image Loading**: The logo image is loaded with CORS support
2. **Optimization**: Image is scaled down to 100x100px for fast analysis
3. **Brightness Calculation**: Uses perceptual luminance formula:
   ```
   brightness = (0.299 * R) + (0.587 * G) + (0.114 * B)
   ```
   This formula weights colors based on human eye sensitivity (green > red > blue)
4. **Transparency Handling**: Pixels with alpha < 50 are ignored
5. **Color Selection**: Background color is chosen based on average brightness

### Color Scheme

The system automatically adapts both background and text colors with 85% opacity for backgrounds and optimal contrast for text:

| Image Brightness | Background Color | RGBA Value | Text Color | Hex Value |
|-----------------|------------------|------------|------------|-----------|
| **Very Bright** (> 200/255) | Dark Gray | `rgba(45, 55, 72, 0.85)` | Light | `#f7fafc` |
| **Moderately Bright** (> 180/255) | Medium Gray | `rgba(100, 116, 139, 0.85)` | Light | `#f7fafc` |
| **Dark** (≤ 180/255) | White | `rgba(255, 255, 255, 0.85)` | Dark | `#1a202c` |

### Components Affected

The adaptive background and text colors are applied to:
- **Back to Gallery button** - Ensures visibility in all scenarios
- **Header** with brand logo
- **Glass Photo** section (carousel)
- **Glass Details** section (information cards, inherits text color)
- **Brewery Information** section (including links with adaptive color)

## Implementation

### Hook: `useImageBrightness`

Located in: `src/hooks/useImageBrightness.js`

```javascript
const { backgroundColor, textColor, isAnalyzing } = useImageBrightness(imageUrl)
```

**Parameters:**
- `imageUrl` (string): URL of the image to analyze

**Returns:**
- `backgroundColor` (string): RGBA color string for backgrounds
- `textColor` (string): Hex color string for text
- `isAnalyzing` (boolean): Whether analysis is in progress

### Usage in BrandDetail

```javascript
const imageUrl = brand ? getAssetPath(brand.name_image) : null
const { backgroundColor, textColor } = useImageBrightness(imageUrl)

// Applied to button
<button style={{ backgroundColor, color: textColor }}>

// Applied to all sections via inline styles
<section style={{ backgroundColor, color: textColor }}>

// Passed to child components for links
<BreweryInfo brand={brand} textColor={textColor} />
```

## Benefits

✅ **Automatic Adaptation**: No manual configuration needed per brand  
✅ **Optimal Contrast**: Text and background colors automatically adjust for maximum readability  
✅ **Complete Coverage**: All interactive elements (buttons, links, text) adapt correctly  
✅ **Consistent Design**: Unified look across all brand pages  
✅ **Performance**: Fast analysis with optimized image processing  
✅ **Transparent Effect**: 85% opacity allows background to show through  
✅ **Error Handling**: Falls back to white background and dark text on errors  

## Testing

Comprehensive test coverage in: `src/hooks/useImageBrightness.test.js`

**Test Coverage:**
- Bright, medium, and dark image detection
- Transparent pixel handling
- Error scenarios (load errors, canvas errors)
- Null/undefined image sources
- Image source changes
- CORS configuration
- Image scaling optimization

**Run Tests:**
```bash
npm test -- useImageBrightness.test.js
```

## Technical Details

### Performance Optimization

- Images are downscaled to max 100x100px before analysis
- Analysis runs once per brand (on mount and when ID changes)
- Results are cached in component state
- No blocking of UI rendering

### CORS Support

Images are loaded with `crossOrigin = 'Anonymous'` to enable canvas manipulation of images from CDNs or different origins.

### Error Handling

The system gracefully handles:
- Failed image loads
- Canvas API errors
- Missing or invalid image URLs
- Browser compatibility issues

Default fallback: `rgba(255, 255, 255, 0.85)` (white with 85% opacity)

## Browser Compatibility

Requires:
- Canvas API support
- Uint8ClampedArray support
- Modern JavaScript (ES6+)

Supported in all modern browsers (Chrome, Firefox, Safari, Edge).

## Future Enhancements

Potential improvements:
- [ ] Cache analysis results to localStorage
- [ ] Add custom color themes
- [ ] Support for brand-specific color overrides
- [ ] Adjust text color based on background
- [ ] Animation/transition when color changes

