"use client"

import { useState, useCallback, memo, forwardRef } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CartQuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'micro' | 'compact' | 'default'
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

const CartQuantitySelector = forwardRef<HTMLDivElement, CartQuantitySelectorProps>(({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  size = 'compact',
  className,
  'aria-label': ariaLabel = "Quantity selector",
  'aria-describedby': ariaDescribedby
}, ref) => {
  
  // Memoized handlers for performance
  const handleDecrease = useCallback(() => {
    if (!disabled) {
      const newValue = Math.max(min, value - 1)
      onChange(newValue)
    }
  }, [value, onChange, min, disabled])

  const handleIncrease = useCallback(() => {
    if (!disabled) {
      const newValue = max ? Math.min(max, value + 1) : value + 1
      onChange(newValue)
    }
  }, [value, onChange, max, disabled])

  const isDecreaseDisabled = disabled || value <= min
  const isIncreaseDisabled = disabled || (max && value >= max)

  // Size configurations
  const sizeConfig = {
    micro: {
      buttonSize: 'h-5 w-5',
      iconSize: 'h-2.5 w-2.5',
      textSize: 'text-xs',
      spacing: 'mx-1.5',
      minWidth: 'min-w-[1.25rem]'
    },
    compact: {
      buttonSize: 'h-6 w-6',
      iconSize: 'h-3 w-3',
      textSize: 'text-sm',
      spacing: 'mx-2',
      minWidth: 'min-w-[1.5rem]'
    },
    default: {
      buttonSize: 'h-7 w-7',
      iconSize: 'h-3.5 w-3.5',
      textSize: 'text-base',
      spacing: 'mx-2.5',
      minWidth: 'min-w-[1.75rem]'
    }
  }

  const config = sizeConfig[size]

  return (
    <div
      ref={ref}
      className={cn("flex items-center", className)}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    >
      {/* Decrease Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDecrease}
        disabled={isDecreaseDisabled}
        className={cn(
          config.buttonSize,
          "p-0 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
          "flex items-center justify-center transition-all duration-150",
          isDecreaseDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={cn(config.iconSize, "text-gray-600")} />
      </Button>

      {/* Quantity Display */}
      <span className={cn(
        config.spacing,
        config.textSize,
        "font-medium text-gray-900 text-center",
        config.minWidth
      )}>
        {value}
      </span>

      {/* Increase Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleIncrease}
        disabled={isIncreaseDisabled}
        className={cn(
          config.buttonSize,
          "p-0 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
          "flex items-center justify-center transition-all duration-150",
          isIncreaseDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={cn(config.iconSize, "text-gray-600")} />
      </Button>
    </div>
  )
})

CartQuantitySelector.displayName = "CartQuantitySelector"

export { CartQuantitySelector }
