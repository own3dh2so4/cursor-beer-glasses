import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Gallery } from './features/gallery'
import { BrandDetail } from './features/brand-detail'
import { Statistics } from './features/statistics'

function App() {
  return (
    <BrowserRouter
      basename="/cursor-beer-glasses"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-slate-50/85 backdrop-blur-xl border-b border-white/30 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-default">
                🍺 Beer Glasses
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg font-semibold text-slate-700 hover:bg-white/60 transition-default"
                >
                  Gallery
                </Link>
                <Link
                  to="/stats"
                  className="px-4 py-2 rounded-lg font-semibold text-slate-700 hover:bg-white/60 transition-default"
                >
                  Statistics
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/:id" element={<BrandDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

