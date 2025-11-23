import { expect, afterEach, vi } from 'vitest'
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

