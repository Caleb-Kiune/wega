import { render, screen, fireEvent } from '@testing-library/react'
import { QuantitySelector } from '../quantity-selector'

describe('QuantitySelector', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders with default props', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} />)
    
    expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument()
    expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onChange when increase button is clicked', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} />)
    
    fireEvent.click(screen.getByLabelText('Increase quantity'))
    
    expect(mockOnChange).toHaveBeenCalledWith(2)
  })

  it('calls onChange when decrease button is clicked', () => {
    render(<QuantitySelector value={2} onChange={mockOnChange} />)
    
    fireEvent.click(screen.getByLabelText('Decrease quantity'))
    
    expect(mockOnChange).toHaveBeenCalledWith(1)
  })

  it('respects min value', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} min={1} />)
    
    const decreaseButton = screen.getByLabelText('Decrease quantity')
    fireEvent.click(decreaseButton)
    
    expect(mockOnChange).toHaveBeenCalledWith(1) // Should not go below min
  })

  it('respects max value', () => {
    render(<QuantitySelector value={5} onChange={mockOnChange} max={5} />)
    
    const increaseButton = screen.getByLabelText('Increase quantity')
    fireEvent.click(increaseButton)
    
    expect(mockOnChange).toHaveBeenCalledWith(5) // Should not exceed max
  })

  it('shows presets when showPresets is true', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} showPresets={true} />)
    
    expect(screen.getByLabelText('Set quantity to 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Set quantity to 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Set quantity to 5')).toBeInTheDocument()
    expect(screen.getByLabelText('Set quantity to 10')).toBeInTheDocument()
  })

  it('shows input when showInput is true', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} showInput={true} />)
    
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument()
  })

  it('disables buttons when disabled prop is true', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} disabled={true} />)
    
    const decreaseButton = screen.getByLabelText('Decrease quantity')
    const increaseButton = screen.getByLabelText('Increase quantity')
    
    expect(decreaseButton).toBeDisabled()
    expect(increaseButton).toBeDisabled()
  })

  it('shows max available when max is provided', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} max={10} />)
    
    expect(screen.getByText('Max: 10 available')).toBeInTheDocument()
  })
}) 