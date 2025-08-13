'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/forms/form-field';
import { useFormValidation, commonValidationRules } from '@/hooks/use-form-validation';
import { Package, ArrowRight, Lock, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface LoginFormData {
  username: string;
  password: string;
}

const loginValidationRules = {
  username: [
    commonValidationRules.required('Username or email'),
    commonValidationRules.minLength(3, 'Username'),
    commonValidationRules.maxLength(30, 'Username')
  ],
  password: [
    commonValidationRules.required('Password'),
    commonValidationRules.minLength(8, 'Password')
  ]
};

export default function AdminLoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{ isLocked: boolean; remainingSeconds: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    markFieldAsTouched,
    resetValidation
  } = useFormValidation(loginValidationRules);

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Autofocus username field
  useEffect(() => {
    if (isClient && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [isClient]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (formData.username && errors.username) {
      clearFieldError('username');
    }
  }, [formData.username, errors.username, clearFieldError]);

  useEffect(() => {
    if (formData.password && errors.password) {
      clearFieldError('password');
    }
  }, [formData.password, errors.password, clearFieldError]);

  // Clear error message when user starts typing
  useEffect(() => {
    if (formData.username || formData.password) {
      setErrorMessage(null);
    }
  }, [formData.username, formData.password]);

  const handleFieldChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    if (error) {
      setFieldError(field, error);
    } else {
      clearFieldError(field);
    }
  };

  const handleFieldBlur = (field: keyof LoginFormData) => {
    markFieldAsTouched(field);
    const error = validateField(field, formData[field]);
    if (error) {
      setFieldError(field, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      setIsLoading(true);
      setLockoutInfo(null);
      setErrorMessage(null);
      
      await login({
        ...formData,
        remember_me: rememberMe
      });
      
      // Success toast is handled in the auth context
      
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('too many login attempts') || message.includes('account locked')) {
          errorMessage = 'Account is temporarily locked due to too many failed attempts. Please try again later.';
          setLockoutInfo({ isLocked: true, remainingSeconds: 900 }); // 15 minutes
        } else if (message.includes('invalid username or password') || message.includes('invalid credentials')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (message.includes('csrf') || message.includes('session expired')) {
          errorMessage = 'Session expired. Please try again.';
        } else if (message.includes('deactivated')) {
          errorMessage = 'Account is deactivated. Please contact your administrator.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info('Please contact your system administrator to reset your password.');
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900">
                Admin Login
              </CardTitle>
              <CardDescription className="text-slate-600">
                Sign in to manage your kitchenware store
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Lockout Warning */}
              {lockoutInfo?.isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-red-500" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Account Temporarily Locked</p>
                      <p className="text-xs text-red-600">
                        Too many failed attempts. Please try again in {lockoutInfo.remainingSeconds} seconds.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Login Failed</p>
                      <p className="text-xs text-red-600">{errorMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Username/Email Field */}
              <FormField
                ref={usernameInputRef}
                label="Username or Email"
                name="username"
                type="text"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={(value) => handleFieldChange('username', value as string)}
                onBlur={() => handleFieldBlur('username')}
                error={errors.username}
                touched={touched.username}
                required
                disabled={isLoading || lockoutInfo?.isLocked}
                autoComplete="username"
                aria-describedby="username-help"
              />

              {/* Password Field */}
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => handleFieldChange('password', value as string)}
                onBlur={() => handleFieldBlur('password')}
                error={errors.password}
                touched={touched.password}
                required
                disabled={isLoading || lockoutInfo?.isLocked}
                showPasswordToggle
                autoComplete="current-password"
                aria-describedby="password-help"
              />

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading || lockoutInfo?.isLocked}
                  aria-describedby="remember-me-help"
                />
                <Label htmlFor="remember-me" className="text-sm text-gray-600">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || lockoutInfo?.isLocked}
                aria-describedby="submit-help"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="space-y-2 text-xs text-slate-500">
              <p id="username-help">
                Enter your username or email address
              </p>
              <p id="password-help">
                Enter your password (minimum 8 characters)
              </p>
              <p id="remember-me-help">
                Keep me signed in for 30 days
              </p>
              <p id="submit-help">
                Click to sign in to your admin account
              </p>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-emerald-600 hover:text-emerald-700 underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 