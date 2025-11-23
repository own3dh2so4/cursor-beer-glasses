import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useImageBrightness from './useImageBrightness'

interface MockCanvasContext {
  drawImage: Mock
  getImageData: Mock
}

interface MockCanvas {
  getContext: Mock
  width: number
  height: number
}

interface MockImageInstance {
  crossOrigin: string | null
  onload: (() => void) | null
  onerror: (() => void) | null
  src: string | null
  width: number
  height: number
}

describe('useImageBrightness', () => {
  let mockCanvas: MockCanvas
  let mockContext: MockCanvasContext
  let mockImage: MockImageInstance
  let originalCreateElement: typeof document.createElement
  let originalImage: typeof Image

  beforeEach(() => {
    // Save originals
    originalCreateElement = document.createElement
    originalImage = global.Image

    // Mock canvas and context
    mockContext = {
      drawImage: vi.fn(),
      getImageData: vi.fn()
    }

    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      width: 0,
      height: 0
    }

    // Mock document.createElement for canvas
    document.createElement = vi.fn((tag: string) => {
      if (tag === 'canvas') {
        return mockCanvas as unknown as HTMLCanvasElement
      }
      return originalCreateElement.call(document, tag)
    }) as typeof document.createElement

    // Mock Image constructor
    global.Image = class MockImage {
      crossOrigin: string | null = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      src: string | null = null
      width = 100
      height = 100
      
      constructor() {
        mockImage = this
      }
    } as unknown as typeof Image

    // Clear console warnings
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore originals
    document.createElement = originalCreateElement
    global.Image = originalImage
    vi.restoreAllMocks()
  })

  it('should return default white background and dark text while analyzing', () => {
    const { result } = renderHook(() => useImageBrightness('/test-image.jpg'))
    
    expect(result.current.isAnalyzing).toBe(true)
    expect(result.current.backgroundColor).toBe('rgba(255, 255, 255, 0.85)')
    expect(result.current.textColor).toBe('#1a202c')
  })

  it('should return dark background and light text for very bright images', async () => {
    // Mock a very bright image (avg brightness > 200)
    mockContext.getImageData.mockReturnValue({
      data: new Uint8ClampedArray([
        250, 250, 250, 255, // Very bright pixel
        240, 240, 240, 255,
        230, 230, 230, 255,
        220, 220, 220, 255
      ])
    })

    const { result } = renderHook(() => useImageBrightness('/bright-image.jpg'))
    
    // Trigger image load
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    expect(result.current.backgroundColor).toBe('rgba(45, 55, 72, 0.85)')
    expect(result.current.textColor).toBe('#f7fafc')
  })

  it('should return medium gray background and light text for moderately bright images', async () => {
    // Mock a moderately bright image (avg brightness > 180 but <= 200)
    mockContext.getImageData.mockReturnValue({
      data: new Uint8ClampedArray([
        190, 190, 190, 255, // Moderately bright pixel
        185, 185, 185, 255,
        195, 195, 195, 255,
        180, 180, 180, 255
      ])
    })

    const { result } = renderHook(() => useImageBrightness('/medium-image.jpg'))
    
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    expect(result.current.backgroundColor).toBe('rgba(100, 116, 139, 0.85)')
    expect(result.current.textColor).toBe('#f7fafc')
  })

  it('should return white background and dark text for dark images', async () => {
    // Mock a dark image (avg brightness <= 180)
    mockContext.getImageData.mockReturnValue({
      data: new Uint8ClampedArray([
        100, 100, 100, 255, // Dark pixel
        80, 80, 80, 255,
        120, 120, 120, 255,
        90, 90, 90, 255
      ])
    })

    const { result } = renderHook(() => useImageBrightness('/dark-image.jpg'))
    
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    expect(result.current.backgroundColor).toBe('rgba(255, 255, 255, 0.85)')
    expect(result.current.textColor).toBe('#1a202c')
  })

  it('should ignore transparent pixels in brightness calculation', async () => {
    // Mock image with mix of opaque and transparent pixels
    mockContext.getImageData.mockReturnValue({
      data: new Uint8ClampedArray([
        250, 250, 250, 255, // Bright opaque pixel
        100, 100, 100, 0,   // Dark but transparent (should be ignored)
        240, 240, 240, 255, // Bright opaque pixel
        50, 50, 50, 30      // Dark, mostly transparent (should be ignored)
      ])
    })

    const { result } = renderHook(() => useImageBrightness('/transparent-image.png'))
    
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    // Should return dark background and light text because only bright pixels are counted
    expect(result.current.backgroundColor).toBe('rgba(45, 55, 72, 0.85)')
    expect(result.current.textColor).toBe('#f7fafc')
  })

  it('should handle image load error gracefully', async () => {
    const { result } = renderHook(() => useImageBrightness('/error-image.jpg'))
    
    if (mockImage.onerror) mockImage.onerror()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    expect(result.current.backgroundColor).toBe('rgba(255, 255, 255, 0.85)')
    expect(result.current.textColor).toBe('#1a202c')
    expect(console.warn).toHaveBeenCalledWith('Error loading image for brightness analysis')
  })

  it('should handle canvas analysis error gracefully', async () => {
    mockContext.getImageData.mockImplementation(() => {
      throw new Error('Canvas error')
    })

    const { result } = renderHook(() => useImageBrightness('/test-image.jpg'))
    
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    expect(result.current.backgroundColor).toBe('rgba(255, 255, 255, 0.85)')
    expect(result.current.textColor).toBe('#1a202c')
    expect(console.warn).toHaveBeenCalledWith(
      'Error analyzing image brightness:',
      expect.any(Error)
    )
  })

  it('should handle null or undefined image source', () => {
    const { result } = renderHook(() => useImageBrightness(null as unknown as string))
    
    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.backgroundColor).toBe('rgba(255, 255, 255, 0.85)')
    expect(result.current.textColor).toBe('#1a202c')
  })

  it('should set crossOrigin attribute for CORS support', () => {
    renderHook(() => useImageBrightness('/test-image.jpg'))
    
    expect(mockImage.crossOrigin).toBe('Anonymous')
  })

  it('should scale large images down for faster analysis', async () => {
    mockImage.width = 2000
    mockImage.height = 1500

    mockContext.getImageData.mockReturnValue({
      data: new Uint8ClampedArray(Array(400).fill(150).concat(Array(400).fill(255)))
    })

    renderHook(() => useImageBrightness('/large-image.jpg'))
    
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(mockCanvas.width).toBeLessThanOrEqual(100)
      expect(mockCanvas.height).toBeLessThanOrEqual(100)
    })
  })

  it('should handle image source changes to null', async () => {
    const { result, rerender } = renderHook(
      ({ src }: { src: string | null }) => useImageBrightness(src as string),
      { initialProps: { src: '/image1.jpg' as string | null } }
    )

    // First render should be analyzing
    expect(result.current.isAnalyzing).toBe(true)

    // Simulate first image load with bright image
    mockContext.getImageData.mockReturnValue({
      data: new Uint8ClampedArray([250, 250, 250, 255, 250, 250, 250, 255])
    })
    if (mockImage.onload) mockImage.onload()

    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
    })

    const firstBackground = result.current.backgroundColor
    const firstTextColor = result.current.textColor
    expect(firstBackground).toBe('rgba(45, 55, 72, 0.85)') // Dark background for bright image
    expect(firstTextColor).toBe('#f7fafc') // Light text for dark background

    // Change to null source
    rerender({ src: null })

    // Should stop analyzing immediately when source is null
    expect(result.current.isAnalyzing).toBe(false)
    // Background and text colors should remain from previous analysis (not reset)
    expect(result.current.backgroundColor).toBe('rgba(45, 55, 72, 0.85)')
    expect(result.current.textColor).toBe('#f7fafc')
  })
})

