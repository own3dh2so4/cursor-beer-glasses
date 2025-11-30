interface StatsCardProps {
    title: string
    value: number | string
    icon: string
    description?: string
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
    return (
        <div className="bg-white/85 backdrop-blur-lg rounded-xl p-6 shadow-card transition-default hover:shadow-card-hover hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        {title}
                    </p>
                    <p className="text-4xl font-bold text-primary mb-2 drop-shadow-sm">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {description && (
                        <p className="text-xs text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
                <div className="text-5xl opacity-20 ml-4">
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default StatsCard
