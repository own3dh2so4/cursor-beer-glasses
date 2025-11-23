import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
registerSW({
  onNeedRefresh() {
    // Optional: Show a prompt to reload when new content is available
    if (confirm('New content available. Reload?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    // App is ready to work offline
  }
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

