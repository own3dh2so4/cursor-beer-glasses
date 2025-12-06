import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname === path

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg text-slate-700 hover:bg-white/60 transition-default focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleLinkClick}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div
            id="mobile-menu"
            className="fixed top-16 right-4 bg-white rounded-lg shadow-xl z-50 min-w-[200px] py-2 border border-gray-200"
            role="menu"
          >
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`block px-6 py-3 text-base font-semibold transition-default ${
                isActive('/')
                  ? 'bg-primary text-white'
                  : 'text-slate-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Gallery
            </Link>
            <Link
              to="/stats"
              onClick={handleLinkClick}
              className={`block px-6 py-3 text-base font-semibold transition-default ${
                isActive('/stats')
                  ? 'bg-primary text-white'
                  : 'text-slate-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Statistics
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

