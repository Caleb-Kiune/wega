import { useState, useCallback } from 'react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface ValidationRules {
  [field: string]: ValidationRule[];
}

interface ValidationErrors {
  [field: string]: string;
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [field: string]: boolean }>({});

  const validateField = useCallback((field: string, value: string): string | null => {
    const fieldRules = rules[field];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    return null;
  }, [rules]);

  const validateForm = useCallback((values: { [field: string]: string }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, values[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const setFieldError = useCallback((field: string, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const markFieldAsTouched = useCallback((field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    markFieldAsTouched,
    resetValidation
  };
}

// Common validation rules
export const commonValidationRules = {
  required: (fieldName: string): ValidationRule => ({
    test: (value: string) => value.trim().length > 0,
    message: `${fieldName} is required`
  }),
  
  minLength: (length: number, fieldName: string): ValidationRule => ({
    test: (value: string) => value.length >= length,
    message: `${fieldName} must be at least ${length} characters long`
  }),
  
  maxLength: (length: number, fieldName: string): ValidationRule => ({
    test: (value: string) => value.length <= length,
    message: `${fieldName} must be no more than ${length} characters long`
  }),
  
  email: (): ValidationRule => ({
    test: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: 'Please enter a valid email address'
  }),
  
  username: (): ValidationRule => ({
    test: (value: string) => /^[a-zA-Z0-9_]+$/.test(value),
    message: 'Username can only contain letters, numbers, and underscores'
  }),
  
  password: (): ValidationRule => ({
    test: (value: string) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    },
    message: 'Password must contain uppercase, lowercase, number, and special character'
  })
}; 