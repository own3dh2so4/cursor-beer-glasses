import { useState, useEffect, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
    title: ReactNode
    subtitle?: ReactNode
    collapsedTitle?: string
}

export function Navbar({ title, subtitle, collapsedTitle = '🍺 Beer Glasses' }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path: string) => location.pathname === path

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/30 shadow-sm backdrop-blur-xl ${
                isScrolled ? 'bg-slate-50/90 py-4' : 'bg-slate-50/85 py-8 tablet:py-12'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className={`transition-all duration-300 origin-left ${isScrolled ? 'scale-100' : 'scale-100'}`}>
                            {isScrolled ? (
                                <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-default">
                                    {collapsedTitle}
                                </Link>
                            ) : (
                                <div className="animate-fade-in">
                                    <h1 className="text-3xl tablet:text-5xl font-bold text-primary mb-2 drop-shadow-sm">
                                        {title}
                                    </h1>
                                    {subtitle && (
                                        <div className="text-lg tablet:text-xl text-gray-600">
                                            {subtitle}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 ml-4">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg font-semibold transition-default ${
                                isActive('/')
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-700 hover:bg-white/60'
                            }`}
                        >
                            Gallery
                        </Link>
                        <Link
                            to="/stats"
                            className={`px-4 py-2 rounded-lg font-semibold transition-default ${
                                isActive('/stats')
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-700 hover:bg-white/60'
                            }`}
                        >
                            Statistics
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
