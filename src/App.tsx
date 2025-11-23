import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Gallery from './components/Gallery'
import BrandDetail from './components/BrandDetail'

function App() {
  return (
    <BrowserRouter basename="/cursor-beer-glasses">
      <div className="app">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/:id" element={<BrandDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

