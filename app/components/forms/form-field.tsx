import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  showPasswordToggle?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  autoComplete?: string;
  'aria-describedby'?: string;
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      touched,
      required = false,
      disabled = false,
      className,
      options = [],
      showPasswordToggle = false,
      min,
      max,
      step,
      rows = 3,
      autoComplete,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = error && touched;
    const fieldId = `${name}-field`;
    const errorId = `${name}-error`;

    const handleChange = (newValue: string | number | boolean) => {
      onChange?.(newValue);
    };

    const renderField = () => {
      const commonProps = {
        id: fieldId,
        name,
        disabled,
        'aria-invalid': hasError,
        'aria-describedby': hasError ? errorId : ariaDescribedBy,
        className: cn(
          hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        ),
        ...props
      };

      switch (type) {
        case 'textarea':
          return (
            <Textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={onBlur}
              rows={rows}
              autoComplete={autoComplete}
              {...commonProps}
            />
          );

        case 'select':
          return (
            <Select
              value={value as string}
              onValueChange={(newValue) => handleChange(newValue)}
              disabled={disabled}
            >
              <SelectTrigger className={cn(hasError && 'border-red-500')}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={fieldId}
                checked={value as boolean}
                onCheckedChange={(checked) => handleChange(checked as boolean)}
                disabled={disabled}
                className={cn(hasError && 'border-red-500')}
              />
              <Label htmlFor={fieldId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </Label>
            </div>
          );

        default:
          return (
            <div className="relative">
              <Input
                ref={ref as React.Ref<HTMLInputElement>}
                type={showPasswordToggle && showPassword ? 'text' : type}
                placeholder={placeholder}
                value={value as string}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={onBlur}
                min={min}
                max={max}
                step={step}
                autoComplete={autoComplete}
                {...commonProps}
              />
              {showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          );
      }
    };

    return (
      <div className="space-y-2">
        {type !== 'checkbox' && (
          <Label htmlFor={fieldId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        
        {renderField()}
        
        {hasError && (
          <div className="flex items-center space-x-1 text-sm text-red-500" id={errorId} role="alert">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField'; 