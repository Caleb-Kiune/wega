import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceRangeFilter from '../PriceRangeFilter';

// Mock the useDebounce hook
jest.mock('@/lib/hooks/use-debounce', () => ({
  useDebounce: (value: any) => value
}));

describe('PriceRangeFilter', () => {
  const defaultProps = {
    currentRange: undefined,
    onRangeChange: jest.fn(),
    loading: false,
    disabled: false,
    availablePriceRange: { min: 0, max: 50000 },
    currency: 'KES',
    currencySymbol: 'KES',
    showDecimals: false,
    minGap: 1000,
    autoApply: true,
    debounceMs: 500,
    showResetButton: true,
    showPriceSuggestions: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders price range filter with default values', () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByLabelText('Min Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Price')).toBeInTheDocument();
    expect(screen.getByText('Quick Filters')).toBeInTheDocument();
  });

  it('displays current price range when provided', () => {
    const currentRange = { min: 5000, max: 15000 };
    render(<PriceRangeFilter {...defaultProps} currentRange={currentRange} />);
    
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15000')).toBeInTheDocument();
  });

  it('shows active badge when price range is applied', () => {
    const currentRange = { min: 5000, max: 15000 };
    render(<PriceRangeFilter {...defaultProps} currentRange={currentRange} />);
    
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows reset button when price range is active', () => {
    const currentRange = { min: 5000, max: 15000 };
    render(<PriceRangeFilter {...defaultProps} currentRange={currentRange} />);
    
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onRangeChange when reset button is clicked', async () => {
    const currentRange = { min: 5000, max: 15000 };
    const onRangeChange = jest.fn();
    
    render(<PriceRangeFilter {...defaultProps} currentRange={currentRange} onRangeChange={onRangeChange} />);
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await userEvent.click(resetButton);
    
    expect(onRangeChange).toHaveBeenCalledWith(null);
  });

  it('validates min price input', async () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    const minInput = screen.getByLabelText('Min Price');
    await userEvent.type(minInput, '10000');
    fireEvent.blur(minInput);
    
    // Should not show error for valid input
    expect(screen.queryByText('Please enter a valid minimum price')).not.toBeInTheDocument();
  });

  it('shows error for invalid min price', async () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    const minInput = screen.getByLabelText('Min Price');
    await userEvent.type(minInput, '-1000');
    fireEvent.blur(minInput);
    
    expect(screen.getByText('Please enter a valid minimum price')).toBeInTheDocument();
  });

  it('validates max price input', async () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    const maxInput = screen.getByLabelText('Max Price');
    await userEvent.type(maxInput, '20000');
    fireEvent.blur(maxInput);
    
    // Should not show error for valid input
    expect(screen.queryByText('Please enter a valid maximum price')).not.toBeInTheDocument();
  });

  it('shows error when min price is greater than max price', async () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    const minInput = screen.getByLabelText('Min Price');
    const maxInput = screen.getByLabelText('Max Price');
    
    await userEvent.type(minInput, '20000');
    await userEvent.type(maxInput, '10000');
    fireEvent.blur(maxInput);
    
    expect(screen.getByText('Minimum price must be less than maximum price')).toBeInTheDocument();
  });

  it('shows error when price range is too small', async () => {
    render(<PriceRangeFilter {...defaultProps} minGap={5000} />);
    
    const minInput = screen.getByLabelText('Min Price');
    const maxInput = screen.getByLabelText('Max Price');
    
    await userEvent.type(minInput, '1000');
    await userEvent.type(maxInput, '2000');
    fireEvent.blur(maxInput);
    
    expect(screen.getByText(/Price range must be at least/)).toBeInTheDocument();
  });

  it('displays price suggestions', () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    expect(screen.getByText('Under KES 5K')).toBeInTheDocument();
    expect(screen.getByText('KES 5K - 10K')).toBeInTheDocument();
    expect(screen.getByText('KES 10K - 20K')).toBeInTheDocument();
    expect(screen.getByText('Over KES 20K')).toBeInTheDocument();
  });

  it('applies price range when suggestion is clicked', async () => {
    const onRangeChange = jest.fn();
    render(<PriceRangeFilter {...defaultProps} onRangeChange={onRangeChange} />);
    
    const suggestionButton = screen.getByText('Under KES 5K');
    await userEvent.click(suggestionButton);
    
    await waitFor(() => {
      expect(onRangeChange).toHaveBeenCalledWith({ min: 0, max: 5000 });
    });
  });

  it('formats prices correctly', () => {
    render(<PriceRangeFilter {...defaultProps} />);
    
    // Check that prices are formatted with currency symbol
    expect(screen.getByText('KES 0')).toBeInTheDocument();
    expect(screen.getByText('KES 50,000')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<PriceRangeFilter {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Updating results...')).toBeInTheDocument();
  });

  it('disables inputs when loading', () => {
    render(<PriceRangeFilter {...defaultProps} loading={true} />);
    
    const minInput = screen.getByLabelText('Min Price');
    const maxInput = screen.getByLabelText('Max Price');
    
    expect(minInput).toBeDisabled();
    expect(maxInput).toBeDisabled();
  });

  it('disables inputs when disabled prop is true', () => {
    render(<PriceRangeFilter {...defaultProps} disabled={true} />);
    
    const minInput = screen.getByLabelText('Min Price');
    const maxInput = screen.getByLabelText('Max Price');
    
    expect(minInput).toBeDisabled();
    expect(maxInput).toBeDisabled();
  });

  it('shows current range display when active', () => {
    const currentRange = { min: 5000, max: 15000 };
    render(<PriceRangeFilter {...defaultProps} currentRange={currentRange} />);
    
    expect(screen.getByText(/Showing products from KES 5,000 to KES 15,000/)).toBeInTheDocument();
  });

  it('hides price suggestions when showPriceSuggestions is false', () => {
    render(<PriceRangeFilter {...defaultProps} showPriceSuggestions={false} />);
    
    expect(screen.queryByText('Quick Filters')).not.toBeInTheDocument();
    expect(screen.queryByText('Under KES 5K')).not.toBeInTheDocument();
  });

  it('hides reset button when showResetButton is false', () => {
    const currentRange = { min: 5000, max: 15000 };
    render(<PriceRangeFilter {...defaultProps} currentRange={currentRange} showResetButton={false} />);
    
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });

  it('applies range automatically when autoApply is true', async () => {
    const onRangeChange = jest.fn();
    render(<PriceRangeFilter {...defaultProps} onRangeChange={onRangeChange} autoApply={true} />);
    
    const minInput = screen.getByLabelText('Min Price');
    await userEvent.type(minInput, '5000');
    fireEvent.blur(minInput);
    
    await waitFor(() => {
      expect(onRangeChange).toHaveBeenCalledWith({ min: 5000, max: 50000 });
    });
  });

  it('shows apply button when autoApply is false', () => {
    render(<PriceRangeFilter {...defaultProps} autoApply={false} />);
    
    expect(screen.getByRole('button', { name: /apply price filter/i })).toBeInTheDocument();
  });

  it('handles decimal prices when showDecimals is true', () => {
    render(<PriceRangeFilter {...defaultProps} showDecimals={true} />);
    
    // Check that prices are formatted with decimals
    expect(screen.getByText('KES 0.00')).toBeInTheDocument();
    expect(screen.getByText('KES 50,000.00')).toBeInTheDocument();
  });
}); 