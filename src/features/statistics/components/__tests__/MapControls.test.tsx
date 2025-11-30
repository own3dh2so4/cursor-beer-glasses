import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MapControls from '../MapControls'

describe('MapControls', () => {
    const mockHandlers = {
        onZoomIn: vi.fn(),
        onZoomOut: vi.fn(),
        onReset: vi.fn()
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render all three control buttons', () => {
        render(<MapControls zoom={1} {...mockHandlers} />)

        expect(screen.getByLabelText('Zoom in')).toBeInTheDocument()
        expect(screen.getByLabelText('Zoom out')).toBeInTheDocument()
        expect(screen.getByLabelText('Reset view')).toBeInTheDocument()
    })

    it('should call onZoomIn when zoom in button is clicked', () => {
        render(<MapControls zoom={1} {...mockHandlers} />)

        fireEvent.click(screen.getByLabelText('Zoom in'))

        expect(mockHandlers.onZoomIn).toHaveBeenCalledTimes(1)
    })

    it('should call onZoomOut when zoom out button is clicked', () => {
        render(<MapControls zoom={2} {...mockHandlers} />)

        fireEvent.click(screen.getByLabelText('Zoom out'))

        expect(mockHandlers.onZoomOut).toHaveBeenCalledTimes(1)
    })

    it('should call onReset when reset button is clicked', () => {
        render(<MapControls zoom={2} {...mockHandlers} />)

        fireEvent.click(screen.getByLabelText('Reset view'))

        expect(mockHandlers.onReset).toHaveBeenCalledTimes(1)
    })

    it('should disable zoom in button when at maximum zoom', () => {
        render(<MapControls zoom={4} {...mockHandlers} />)

        const zoomInBtn = screen.getByLabelText('Zoom in')
        expect(zoomInBtn).toBeDisabled()
    })

    it('should disable zoom out button when at minimum zoom', () => {
        render(<MapControls zoom={1} {...mockHandlers} />)

        const zoomOutBtn = screen.getByLabelText('Zoom out')
        expect(zoomOutBtn).toBeDisabled()
    })

    it('should enable both zoom buttons at mid-range zoom', () => {
        render(<MapControls zoom={2} {...mockHandlers} />)

        expect(screen.getByLabelText('Zoom in')).not.toBeDisabled()
        expect(screen.getByLabelText('Zoom out')).not.toBeDisabled()
    })

    it('should not call handler when disabled button is clicked', () => {
        render(<MapControls zoom={4} {...mockHandlers} />)

        fireEvent.click(screen.getByLabelText('Zoom in'))

        expect(mockHandlers.onZoomIn).not.toHaveBeenCalled()
    })
})
