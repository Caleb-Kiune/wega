'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
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
      <div className="w-full max-w-md z-10 relative">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full mb-6 shadow-lg border-4 border-white mx-auto animate-fade-in">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">WEGA Kitchenware</h1>
          <p className="text-lg font-medium text-gray-600">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 rounded-2xl bg-white/95 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome back</CardTitle>
            <CardDescription className="text-center text-gray-600 font-medium">
              Sign in to your admin account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
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
                  suppressHydrationWarning
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 px-4 pr-12 bg-white border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 rounded-xl transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                    autoComplete="current-password"
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-0 bottom-0 flex items-center justify-center h-12 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                    disabled={isLoading}
                    tabIndex={-1}
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200 hover:underline"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
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
      </div>
    </div>
  );
} 