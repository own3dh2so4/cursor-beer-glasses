import { useState, useEffect } from 'react'
import type { BrightnessResult } from '../types'

/**
 * Custom hook to analyze image brightness and determine appropriate background and text colors
 * @param imageSrc - The image source URL
 * @returns Object containing backgroundColor, textColor, and isAnalyzing state
 */
const useImageBrightness = (imageSrc: string): BrightnessResult => {
  const [backgroundColor, setBackgroundColor] = useState<string>('rgba(255, 255, 255, 0.85)')
  const [textColor, setTextColor] = useState<string>('#1a202c')
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true)

  useEffect(() => {
    if (!imageSrc) {
      setIsAnalyzing(false)
      return
    }

    const analyzeImage = () => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            throw new Error('Could not get canvas context')
          }
          
          // Reduce image size for faster analysis
          const maxSize = 100
          const scale = Math.min(maxSize / img.width, maxSize / img.height)
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          let totalBrightness = 0
          let pixelCount = 0
          
          // Calculate average brightness
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i] ?? 0
            const g = data[i + 1] ?? 0
            const b = data[i + 2] ?? 0
            const a = data[i + 3] ?? 0
            
            // Only count non-transparent pixels
            if (a && a > 50) {
              // Calculate perceived brightness (using luminance formula)
              const brightness = (0.299 * r + 0.587 * g + 0.114 * b)
              totalBrightness += brightness
              pixelCount++
            }
          }
          
          const avgBrightness = totalBrightness / pixelCount
          
          // If image is very bright (threshold: 200 out of 255), use darker background
          // If image is dark, use white background
          // Using more transparency (0.85 instead of 0.95) for a lighter effect
          if (avgBrightness > 200) {
            setBackgroundColor('rgba(45, 55, 72, 0.85)') // Dark gray with more transparency
            setTextColor('#f7fafc') // Light text for dark background
          } else if (avgBrightness > 180) {
            setBackgroundColor('rgba(100, 116, 139, 0.85)') // Medium gray with more transparency
            setTextColor('#f7fafc') // Light text for medium background
          } else {
            setBackgroundColor('rgba(255, 255, 255, 0.85)') // White with more transparency
            setTextColor('#1a202c') // Dark text for light background
          }
          
          setIsAnalyzing(false)
        } catch (error) {
          console.warn('Error analyzing image brightness:', error)
          setBackgroundColor('rgba(255, 255, 255, 0.85)')
          setTextColor('#1a202c')
          setIsAnalyzing(false)
        }
      }
      
      img.onerror = () => {
        console.warn('Error loading image for brightness analysis')
        setBackgroundColor('rgba(255, 255, 255, 0.85)')
        setTextColor('#1a202c')
        setIsAnalyzing(false)
      }
      
      img.src = imageSrc
    }

    analyzeImage()
  }, [imageSrc])

  return { backgroundColor, textColor, isAnalyzing }
}

export default useImageBrightness

