import { useState, useRef } from 'react'
import { normalizeCountryName, getCountryCode } from '../utils/countryAliases'

export function useMapInteractions(countryMap: Map<string, { count: number; originalName: string }>) {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
    const [tooltip, setTooltip] = useState<{ x: number; y: number; country: string; count: number; code?: string } | null>(null)
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const [panStart, setPanStart] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle mouse events for tooltip
    const handleMouseEnter = (event: React.MouseEvent<SVGPathElement>, countryName: string) => {
        const normalized = normalizeCountryName(countryName)
        const data = countryMap.get(normalized)
        const code = getCountryCode(countryName)

        setHoveredCountry(countryName)

        if (data && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setTooltip({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                country: data.originalName,
                count: data.count,
                code
            })
        } else {
            setTooltip(null)
        }
    }

    const handleMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
        if (tooltip && hoveredCountry && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setTooltip(prev => prev ? {
                ...prev,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            } : null)
        }
    }

    const handleMouseLeave = () => {
        setHoveredCountry(null)
        setTooltip(null)
    }

    // Pan handlers
    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
        if ((event.target as SVGElement).tagName !== 'path') {
            setIsPanning(true)
            setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y })
        }
    }

    const handleMapMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (isPanning) {
            setPan({
                x: event.clientX - panStart.x,
                y: event.clientY - panStart.y
            })
        }
    }

    const handleMouseUp = () => {
        setIsPanning(false)
    }

    // Zoom handlers
    const handleZoomIn = () => {
        setZoom(prev => Math.min(4, prev * 1.2))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(1, prev * 0.8))
    }

    const handleResetView = () => {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }

    return {
        // State
        hoveredCountry,
        tooltip,
        zoom,
        pan,
        isPanning,
        containerRef,
        // Tooltip handlers
        handleMouseEnter,
        handleMouseMove,
        handleMouseLeave,
        // Pan handlers
        handleMouseDown,
        handleMapMouseMove,
        handleMouseUp,
        // Zoom handlers
        handleZoomIn,
        handleZoomOut,
        handleResetView
    }
}
