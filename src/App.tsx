import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Gallery } from './features/gallery'
import { BrandDetail } from './features/brand-detail'
import { Statistics } from './features/statistics'

import { ScrollToTop } from './shared/components/ScrollToTop'
import { Layout } from './shared/components/Layout'

function App() {
  return (
    <BrowserRouter
      basename="/cursor-beer-glasses"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/:id" element={<BrandDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

