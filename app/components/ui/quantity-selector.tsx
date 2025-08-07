"use client"

import { useState, useCallback, memo, forwardRef } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'bordered' | 'minimal'
  showPresets?: boolean
  showInput?: boolean
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

const QuantitySelector = forwardRef<HTMLDivElement, QuantitySelectorProps>(({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  size = 'md',
  variant = 'outline',
  showPresets = false,
  showInput = false,
  className,
  'aria-label': ariaLabel = "Quantity selector",
  'aria-describedby': ariaDescribedby
}, ref) => {
  const [inputValue, setInputValue] = useState(value.toString())

  // Memoized handlers for performance
  const handleDecrease = useCallback(() => {
    if (!disabled) {
      const newValue = Math.max(min, value - 1)
      onChange(newValue)
      setInputValue(newValue.toString())
    }
  }, [value, onChange, min, disabled])

  const handleIncrease = useCallback(() => {
    if (!disabled) {
      const newValue = max ? Math.min(max, value + 1) : value + 1
      onChange(newValue)
      setInputValue(newValue.toString())
    }
  }, [value, onChange, max, disabled])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    const numValue = parseInt(newValue) || min
    const clampedValue = max ? Math.min(max, Math.max(min, numValue)) : Math.max(min, numValue)
    
    if (clampedValue !== value) {
      onChange(clampedValue)
    }
  }, [onChange, min, max, value])

  const handleInputBlur = useCallback(() => {
    const numValue = parseInt(inputValue) || min
    const clampedValue = max ? Math.min(max, Math.max(min, numValue)) : Math.max(min, numValue)
    setInputValue(clampedValue.toString())
    if (clampedValue !== value) {
      onChange(clampedValue)
    }
  }, [inputValue, onChange, min, max, value])

  const handlePresetClick = useCallback((preset: number) => {
    if (!disabled) {
      const clampedValue = max ? Math.min(max, Math.max(min, preset)) : Math.max(min, preset)
      onChange(clampedValue)
      setInputValue(clampedValue.toString())
    }
  }, [onChange, min, max, disabled])

  // Size configurations
  const sizeConfig = {
    sm: {
      buttonSize: 'sm' as const,
      inputSize: 'sm' as const,
      textSize: 'text-sm' as const,
      gap: 'gap-1' as const,
      presetSize: 'text-xs' as const
    },
    md: {
      buttonSize: 'default' as const,
      inputSize: 'default' as const,
      textSize: 'text-base' as const,
      gap: 'gap-2' as const,
      presetSize: 'text-sm' as const
    },
    lg: {
      buttonSize: 'lg' as const,
      inputSize: 'lg' as const,
      textSize: 'text-lg' as const,
      gap: 'gap-3' as const,
      presetSize: 'text-base' as const
    }
  }

  const config = sizeConfig[size]

  // Variant configurations
  const variantConfig = {
    outline: {
      buttonClass: "border border-gray-300 hover:border-gray-400",
      inputClass: "border border-gray-300 focus:border-green-500",
      containerClass: "flex items-center"
    },
    bordered: {
      buttonClass: "border-0 hover:bg-gray-50",
      inputClass: "border-x border-gray-300 focus:border-green-500",
      containerClass: "flex items-center border border-gray-300 rounded-md"
    },
    minimal: {
      buttonClass: "hover:bg-gray-100",
      inputClass: "border-0 focus:ring-2 focus:ring-green-500",
      containerClass: "flex items-center"
    }
  }

  const variantStyle = variantConfig[variant]

  const isDecreaseDisabled = disabled || value <= min
  const isIncreaseDisabled = disabled || (max && value >= max)

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    >
      {/* Main quantity controls */}
      <div className={cn("flex items-center", variantStyle.containerClass, config.gap)}>
        <Button
          size={config.buttonSize}
          variant={variant === 'outline' ? 'outline' : 'ghost'}
          onClick={handleDecrease}
          disabled={isDecreaseDisabled}
          className={cn(
            "flex-shrink-0",
            variantStyle.buttonClass,
            variant === 'bordered' && "rounded-none border-r border-gray-300",
            isDecreaseDisabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>

        {showInput ? (
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={min}
            max={max}
            disabled={disabled}
            size={config.inputSize}
            className={cn(
              "text-center w-16 flex-shrink-0",
              config.textSize,
              variantStyle.inputClass
            )}
            aria-label="Quantity"
            aria-live="polite"
            aria-atomic="true"
          />
        ) : (
          <span className={cn(
            "text-center font-medium flex-shrink-0",
            config.textSize,
            variant === 'bordered' ? "px-4 py-2 border-x border-gray-300" : "w-10"
          )}>
            {value}
          </span>
        )}

        <Button
          size={config.buttonSize}
          variant={variant === 'outline' ? 'outline' : 'ghost'}
          onClick={handleIncrease}
          disabled={isIncreaseDisabled}
          className={cn(
            "flex-shrink-0",
            variantStyle.buttonClass,
            variant === 'bordered' && "rounded-none border-l border-gray-300",
            isIncreaseDisabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stock information */}
      {max && (
        <div className="text-xs text-gray-500">
          Max: {max} available
        </div>
      )}

      {/* Quantity presets */}
      {showPresets && (
        <div className="flex flex-wrap gap-1">
          {[1, 2, 5, 10].map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              disabled={disabled || (max && preset > max)}
              className={cn(
                "px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                config.presetSize,
                value === preset ? "bg-green-100 border-green-300 text-green-700" : "border-gray-300 text-gray-700"
              )}
              aria-label={`Set quantity to ${preset}`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

QuantitySelector.displayName = "QuantitySelector"

export { QuantitySelector } 