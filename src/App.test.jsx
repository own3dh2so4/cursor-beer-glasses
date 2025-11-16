import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />)
    const appElement = container.querySelector('.app')
    expect(appElement).toBeTruthy()
  })

  it('should have main app container', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.app')).toBeTruthy()
  })
})

