interface MapControlsProps {
    zoom: number
    onZoomIn: () => void
    onZoomOut: () => void
    onReset: () => void
}

function MapControls({ zoom, onZoomIn, onZoomOut, onReset }: MapControlsProps) {
    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
                onClick={onZoomIn}
                disabled={zoom >= 4}
                className="bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-card transition-default font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom in"
            >
                +
            </button>
            <button
                onClick={onZoomOut}
                disabled={zoom <= 1}
                className="bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-card transition-default font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom out"
            >
                −
            </button>
            <button
                onClick={onReset}
                className="bg-white/90 hover:bg-white px-2 py-2 rounded-lg shadow-card transition-default text-xs text-gray-700"
                aria-label="Reset view"
            >
                ⟲
            </button>
        </div>
    )
}

export default MapControls
