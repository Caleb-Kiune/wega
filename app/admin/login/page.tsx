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
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 rounded-2xl bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md z-10 relative"
        tabIndex={-1}
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow border mx-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
              alt="WEGA Kitchenware Logo"
              width={80}
              height={80}
              className="w-16 h-16 object-contain rounded-full"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2 font-serif">Admin Login</h1>
        </div>
        {/* Login Card */}
        <Card className="shadow-lg border-0 rounded-2xl bg-white">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg font-semibold text-center text-gray-900 font-serif">Sign in to continue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning autoComplete="on">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username or Email
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username or email"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="h-11 px-4 bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-100 rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                  autoComplete="username"
                  ref={usernameInputRef}
                  required
                  tabIndex={1}
                  suppressHydrationWarning
                />
              </div>
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-11 px-4 pr-16 bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-100 rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                    tabIndex={2}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-0 bottom-0 flex items-center justify-center h-11 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                    disabled={isLoading}
                    tabIndex={3}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Inline Error Feedback */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-xs text-center mb-2"
                  aria-live="polite"
                >
                  {errorMessage}
                </motion.div>
              )}
              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold text-base shadow transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                  tabIndex={4}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} WEGA Kitchenware
          </p>
        </div>
      </motion.div>
    </div>
  );
} 