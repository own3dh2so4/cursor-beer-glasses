import type { StatisticsViewMode } from '@/shared/types'

interface ViewModeToggleProps {
    currentMode: StatisticsViewMode
    onModeChange: (mode: StatisticsViewMode) => void
}

function ViewModeToggle({ currentMode, onModeChange }: ViewModeToggleProps) {
    return (
        <div className="bg-white/85 backdrop-blur-lg rounded-xl p-2 shadow-card inline-flex gap-2">
            <button
                onClick={() => onModeChange('purchase')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${currentMode === 'purchase'
                    ? 'bg-primary text-white shadow-sm-card'
                    : 'text-gray-600 hover:bg-slate-50/80'
                    }`}
                aria-pressed={currentMode === 'purchase'}
            >
                🛍️ Where I Bought
            </button>
            <button
                onClick={() => onModeChange('origin')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${currentMode === 'origin'
                    ? 'bg-primary text-white shadow-sm-card'
                    : 'text-gray-600 hover:bg-slate-50/80'
                    }`}
                aria-pressed={currentMode === 'origin'}
            >
                🏭 Brewery Origin
            </button>
        </div>
    )
}

export default ViewModeToggle
