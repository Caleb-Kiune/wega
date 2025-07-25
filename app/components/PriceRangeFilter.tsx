"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';

/**
 * PriceRangeFilter Component
 * 
 * Mobile Optimizations:
 * - Compact spacing (space-y-3 for modal vs space-y-4 for desktop)
 * - Smaller text sizes (text-xs on mobile, text-sm on desktop)
 * - Reduced input heights (h-8 on mobile, h-9 on desktop)
 * - Truncated text to prevent overflow
 * - Flex-shrink-0 on icons and badges
 * - min-w-0 on containers to allow proper flex shrinking
 * - Responsive button sizes and spacing
 * - Hidden reset text on mobile (icon only)
 * 
 * Modal-specific features:
 * - isModal prop for compact layout
 * - Prevents horizontal scrolling
 * - Optimized for Sheet component
 */
export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceRangeFilterProps {
  currentRange?: PriceRange;
  onRangeChange: (range: PriceRange | null) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  // Dynamic price range from actual product data
  availablePriceRange?: PriceRange;
  // Currency configuration
  currency?: string;
  currencySymbol?: string;
  // Formatting options
  showDecimals?: boolean;
  // Validation options
  minGap?: number; // Minimum gap between min and max
  // UX options
  autoApply?: boolean;
  debounceMs?: number;
  showResetButton?: boolean;
  showPriceSuggestions?: boolean;
  // Modal-specific options
  isModal?: boolean; // Whether this is used in a modal
}

export default function PriceRangeFilter({
  currentRange,
  onRangeChange,
  loading = false,
  disabled = false,
  className = "",
  availablePriceRange = { min: 0, max: 50000 },
  currency = "KES",
  currencySymbol = "KES",
  showDecimals = false,
  minGap = 1000,
  autoApply = true,
  debounceMs = 500,
  showResetButton = true,
  showPriceSuggestions = true,
  isModal = false,
}: PriceRangeFilterProps) {
  // Local state for inputs and slider
  const [localRange, setLocalRange] = useState<PriceRange>({
    min: currentRange?.min || availablePriceRange.min,
    max: currentRange?.max || availablePriceRange.max
  });
  
  const [inputValues, setInputValues] = useState({
    min: currentRange?.min?.toString() || '',
    max: currentRange?.max?.toString() || ''
  });

  const [errors, setErrors] = useState<{
    min?: string;
    max?: string;
    range?: string;
  }>({});

  const [isApplying, setIsApplying] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Debounced range for auto-apply
  const debouncedRange = useDebounce(localRange, debounceMs);

  // Price suggestions based on available range
  const priceSuggestions = useMemo(() => {
    const { min, max } = availablePriceRange;
    const range = max - min;
    const quarter = range / 4;
    
    return [
      { label: 'Under KES 5K', range: { min, max: Math.min(min + 5000, max) } },
      { label: 'KES 5K - 10K', range: { min: Math.max(min, 5000), max: Math.min(max, 10000) } },
      { label: 'KES 10K - 20K', range: { min: Math.max(min, 10000), max: Math.min(max, 20000) } },
      { label: 'Over KES 20K', range: { min: Math.max(min, 20000), max } },
    ].filter(suggestion => suggestion.range.min < suggestion.range.max);
  }, [availablePriceRange]);

  // Format price for display
  const formatPrice = useCallback((price: number): string => {
    if (showDecimals) {
      return `${currencySymbol} ${price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    return `${currencySymbol} ${price.toLocaleString('en-US')}`;
  }, [currencySymbol, showDecimals]);

  // Validate price range
  const validateRange = useCallback((range: PriceRange): { isValid: boolean; errors: typeof errors } => {
    const newErrors: typeof errors = {};
    
    // Check if min is valid number
    if (isNaN(range.min) || range.min < 0) {
      newErrors.min = 'Please enter a valid minimum price';
    }
    
    // Check if max is valid number
    if (isNaN(range.max) || range.max < 0) {
      newErrors.max = 'Please enter a valid maximum price';
    }
    
    // Check if min is less than max
    if (range.min >= range.max) {
      newErrors.range = 'Minimum price must be less than maximum price';
    }
    
    // Check minimum gap
    if (range.max - range.min < minGap) {
      newErrors.range = `Price range must be at least ${formatPrice(minGap)}`;
    }
    
    // Check if within available range
    if (range.min < availablePriceRange.min) {
      newErrors.min = `Minimum price cannot be less than ${formatPrice(availablePriceRange.min)}`;
    }
    
    if (range.max > availablePriceRange.max) {
      newErrors.max = `Maximum price cannot be more than ${formatPrice(availablePriceRange.max)}`;
    }
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  }, [availablePriceRange, minGap, formatPrice]);

  // Handle slider change
  const handleSliderChange = useCallback((value: number[]) => {
    const newRange = { min: value[0], max: value[1] };
    setLocalRange(newRange);
    setInputValues({
      min: newRange.min > availablePriceRange.min ? newRange.min.toString() : '',
      max: newRange.max < availablePriceRange.max ? newRange.max.toString() : ''
    });
    setHasChanges(true);
  }, [availablePriceRange]);

  // Handle input change
  const handleInputChange = useCallback((type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputValues(prev => ({ ...prev, [type]: value }));
    
    const newRange = {
      ...localRange,
      [type]: numValue
    };
    
    setLocalRange(newRange);
    setHasChanges(true);
  }, [localRange]);

  // Handle input blur (validation)
  const handleInputBlur = useCallback((type: 'min' | 'max') => {
    const { isValid, errors: validationErrors } = validateRange(localRange);
    setErrors(validationErrors);
    
    // Auto-apply if valid and auto-apply is enabled
    if (isValid && autoApply && hasChanges) {
      applyRange();
    }
  }, [localRange, validateRange, autoApply, hasChanges]);

  // Apply the current range
  const applyRange = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateRange(localRange);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    setIsApplying(true);
    setErrors({});
    
    try {
      // Check if range is different from current
      const isDifferent = !currentRange || 
        currentRange.min !== localRange.min || 
        currentRange.max !== localRange.max;
      
      if (isDifferent) {
        await onRangeChange(localRange);
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error applying price range:', error);
      setErrors({ range: 'Failed to apply price range. Please try again.' });
    } finally {
      setIsApplying(false);
    }
  }, [localRange, currentRange, validateRange, onRangeChange]);

  // Reset to available range
  const handleReset = useCallback(() => {
    const resetRange = { ...availablePriceRange };
    setLocalRange(resetRange);
    setInputValues({
      min: '',
      max: ''
    });
    setErrors({});
    setHasChanges(false);
    onRangeChange(null);
  }, [availablePriceRange, onRangeChange]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: typeof priceSuggestions[0]) => {
    setLocalRange(suggestion.range);
    setInputValues({
      min: suggestion.range.min > availablePriceRange.min ? suggestion.range.min.toString() : '',
      max: suggestion.range.max < availablePriceRange.max ? suggestion.range.max.toString() : ''
    });
    setHasChanges(true);
    setErrors({});
    
    if (autoApply) {
      setTimeout(() => applyRange(), 100);
    }
  }, [availablePriceRange, autoApply, applyRange]);

  // Auto-apply when debounced range changes
  useEffect(() => {
    if (autoApply && hasChanges && debouncedRange) {
      const { isValid } = validateRange(debouncedRange);
      if (isValid) {
        applyRange();
      }
    }
  }, [debouncedRange, autoApply, hasChanges, validateRange, applyRange]);

  // Update local state when current range changes
  useEffect(() => {
    if (currentRange) {
      setLocalRange(currentRange);
      setInputValues({
        min: currentRange.min > availablePriceRange.min ? currentRange.min.toString() : '',
        max: currentRange.max < availablePriceRange.max ? currentRange.max.toString() : ''
      });
      setHasChanges(false);
    }
  }, [currentRange, availablePriceRange]);

  // Check if current range is active
  const isRangeActive = currentRange && (
    currentRange.min > availablePriceRange.min || 
    currentRange.max < availablePriceRange.max
  );

  // Compact spacing for modal
  const spacingClass = isModal ? "space-y-3" : "space-y-4";

  return (
    <div className={cn(spacingClass, className)}>
      {/* Compact Header */}
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <DollarSign className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
          <h3 className="text-xs font-semibold text-gray-900 truncate">Price Range</h3>
          {isRangeActive && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4 flex-shrink-0">
              Active
            </Badge>
          )}
        </div>
        
        {showResetButton && isRangeActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={loading || disabled}
            className="h-5 px-1.5 text-xs text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            <X className="h-2.5 w-2.5 mr-0.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>

      {/* Compact Price Inputs */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-700">
            Min Price
          </label>
          <div className="relative">
            <Input
              type="number"
              value={inputValues.min}
              onChange={(e) => handleInputChange('min', e.target.value)}
              onBlur={() => handleInputBlur('min')}
              placeholder={formatPrice(availablePriceRange.min)}
              disabled={loading || disabled}
              className={cn(
                "h-8 text-xs transition-colors sm:h-9 sm:text-sm w-full",
                errors.min && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.min && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-red-600">
                <AlertCircle className="h-2.5 w-2.5 flex-shrink-0" />
                <span className="text-xs truncate">{errors.min}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1 min-w-0">
          <label className="text-xs font-medium text-gray-700">
            Max Price
          </label>
          <div className="relative">
            <Input
              type="number"
              value={inputValues.max}
              onChange={(e) => handleInputChange('max', e.target.value)}
              onBlur={() => handleInputBlur('max')}
              placeholder={formatPrice(availablePriceRange.max)}
              disabled={loading || disabled}
              className={cn(
                "h-8 text-xs transition-colors sm:h-9 sm:text-sm w-full",
                errors.max && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors.max && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-red-600">
                <AlertCircle className="h-2.5 w-2.5 flex-shrink-0" />
                <span className="text-xs truncate">{errors.max}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Range Error */}
      {errors.range && (
        <div className="flex items-start gap-1.5 p-2 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-red-700 leading-relaxed">{errors.range}</span>
        </div>
      )}

      {/* Compact Price Range Slider */}
      <div className="space-y-2">
        <Slider
          value={[localRange.min, localRange.max]}
          onValueChange={handleSliderChange}
          min={availablePriceRange.min}
          max={availablePriceRange.max}
          step={Math.max(100, Math.floor((availablePriceRange.max - availablePriceRange.min) / 100))}
          disabled={loading || disabled}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-gray-600 font-medium sm:text-sm">
          <span className="truncate">{formatPrice(localRange.min)}</span>
          <span className="truncate">{formatPrice(localRange.max)}</span>
        </div>
      </div>

      {/* Compact Price Suggestions */}
      {showPriceSuggestions && priceSuggestions.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Quick Filters
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {priceSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={loading || disabled}
                className="text-xs h-6 px-2 sm:h-7 sm:px-3 flex-shrink-0"
              >
                <span className="truncate">{suggestion.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Apply Button (when auto-apply is disabled) */}
      {!autoApply && hasChanges && (
        <Button
          onClick={applyRange}
          disabled={loading || disabled || isApplying}
          className="w-full h-8 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-semibold rounded-md transition-all duration-200 shadow-sm sm:h-9 sm:text-sm"
        >
          {isApplying ? (
            <>
              <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              <span className="truncate">Applying...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3 mr-1.5" />
              <span className="truncate">Apply Price Filter</span>
            </>
          )}
        </Button>
      )}

      {/* Compact Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-1.5">
          <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
          <span className="text-xs text-gray-500 ml-1.5 truncate">Updating results...</span>
        </div>
      )}

      {/* Compact Current Range Display */}
      {isRangeActive && (
        <div className="flex items-start gap-1.5 p-2 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-green-700 leading-relaxed">
            Showing products from {formatPrice(currentRange!.min)} to {formatPrice(currentRange!.max)}
          </span>
        </div>
      )}
    </div>
  );
} 