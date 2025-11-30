import { ReactNode } from 'react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

/**
 * Future flags for React Router v7 compatibility
 * These flags prepare the app for React Router v7 migration
 */
const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
}

/**
 * Test wrapper for BrowserRouter with future flags
 */
export function TestBrowserRouter({ children, basename }: { children: ReactNode; basename?: string }) {
  return (
    <BrowserRouter basename={basename} future={routerFutureFlags}>
      {children}
    </BrowserRouter>
  )
}

/**
 * Test wrapper for MemoryRouter with future flags
 */
export function TestMemoryRouter({
  children,
  initialEntries
}: {
  children: ReactNode
  initialEntries?: string[]
}) {
  return (
    <MemoryRouter initialEntries={initialEntries} future={routerFutureFlags}>
      {children}
    </MemoryRouter>
  )
}

