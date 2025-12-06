import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useBrands } from '../hooks/useBrands'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { data: allBrands = [] } = useBrands()

  // Determine title and subtitle based on route
  const getNavbarProps = () => {
    if (location.pathname === '/stats') {
      return {
        title: '📊 Own3dh2so4 Beer Glass Statistics',
        subtitle: 'Explore your beer glass collection through interactive visualizations',
        collapsedTitle: '🍺 Own3dh2so4 Beer Glasses Statistics'
      }
    }

    // For gallery (/) or brand detail, show gallery title
    return {
      title: 'Own3dh2so4 Beer Glasses Collection',
      subtitle: (
        <span>
          <strong>{allBrands.length}</strong> brands in collection
        </span>
      ),
      collapsedTitle: '🍺 Own3dh2so4 Beer Glasses'
    }
  }

  const navbarProps = getNavbarProps()

  return (
    <>
      <Navbar {...navbarProps} />
      {children}
    </>
  )
}

