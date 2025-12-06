import { useState, useEffect } from 'react'

/**
 * Hook to detect if the current viewport is mobile or tablet
 * Uses window.innerWidth with a breakpoint of 1024px (desktop breakpoint)
 * Returns true for mobile (< 768px) and tablet (768px - 1023px)
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 1024
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

