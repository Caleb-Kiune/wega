'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image'
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!credentials.username || !credentials.password) {
      setErrorMessage('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(credentials);
    } catch (error) {
      setErrorMessage('Invalid username or password');
      toast.error('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleForgotPassword = () => {
    toast.info('Please contact your system administrator to reset your password.');
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 rounded-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Centered Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md z-10 relative group focus-within:scale-[1.02] focus-within:shadow-2xl hover:scale-[1.01] hover:shadow-2xl transition-all duration-300"
        tabIndex={-1}
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg border-4 border-white mx-auto animate-fade-in relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
              alt="WEGA Kitchenware Logo"
              width={90}
              height={90}
              className="w-20 h-20 object-contain rounded-full"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 font-serif">WEGA Kitchenware</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 shadow-sm">
              <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a2 2 0 0 0 2-2V7a2 2 0 1 0-4 0v8a2 2 0 0 0 2 2zm0 0v2m0 0h.01" /></svg>
              Admin Only
            </span>
            <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200 shadow-sm">
              <svg className="h-4 w-4 mr-1 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a2 2 0 0 0 2-2V7a2 2 0 1 0-4 0v8a2 2 0 0 0 2 2zm0 0v2m0 0h.01" /></svg>
              <span>Dashboard</span>
            </span>
          </div>
          <p className="text-base font-medium text-gray-500 mb-2">Empowering your kitchenware business with secure, modern admin tools.</p>
        </div>
        {/* Login Card */}
        <Card className="shadow-2xl border-0 rounded-2xl bg-white/95 backdrop-blur-sm animate-fade-in-up focus-within:ring-2 focus-within:ring-green-400 hover:shadow-green-200 hover:ring-2 hover:ring-green-200 transition-all duration-300">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900 font-serif">Welcome back</CardTitle>
            <CardDescription className="text-center text-gray-600 font-medium">
              Sign in to your admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning autoComplete="on">
              {/* Username/Email Field */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Username or Email
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="h-12 px-4 bg-white border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 rounded-xl transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                  autoComplete="username"
                  ref={usernameInputRef}
                  required
                  tabIndex={1}
                  suppressHydrationWarning
                />
              </div>
              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 px-4 pr-20 bg-white border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 rounded-xl transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                    tabIndex={2}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-0 bottom-0 flex items-center justify-center h-12 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                    disabled={isLoading}
                    tabIndex={3}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="ml-2 text-xs text-gray-500 select-none">{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </div>
              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    tabIndex={4}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-700 select-none">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200 hover:underline"
                  disabled={isLoading}
                  tabIndex={5}
                >
                  Forgot password?
                </button>
              </div>
              {/* Inline Error Feedback */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm font-medium text-center mb-2 shadow-sm"
                  aria-live="polite"
                >
                  {errorMessage}
                </motion.div>
              )}
              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.03] hover:shadow-green-300"
                  disabled={isLoading}
                  tabIndex={6}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
            {/* Additional Info */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Having trouble? Contact your system administrator
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} WEGA Kitchenware. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 