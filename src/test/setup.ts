import { afterEach, vi, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock import.meta.env
if (!import.meta.env) {
  Object.defineProperty(import.meta, 'env', {
    value: {
      BASE_URL: '/cursor-beer-glasses/'
    }
  })
}

// Suppress benign happy-dom errors in tests
const originalConsoleError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = String(args[0])
    // Suppress happy-dom AbortError and NetworkError messages
    if (
      message.includes('AbortError') ||
      message.includes('NetworkError') ||
      message.includes('maps.google.com')
    ) {
      return
    }
    originalConsoleError(...args)
  }
})

