'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Package } from 'lucide-react';
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
      // Error handling is done in the auth context
      // Just log for debugging purposes
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

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 rounded-2xl bg-white/95">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 p-4 relative">
      {/* Centered Card */}
      <div className="w-full max-w-md z-10">
        {/* Green Accent Bar */}
        <div className="h-2 w-full rounded-t-2xl bg-green-600 mb-0" />
        {/* Logo/Brand */}
        <div className="text-center -mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 shadow-lg border-4 border-white mx-auto -mt-10">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Wega Kitchenware</h1>
          <p className="text-gray-600 mt-1 text-base font-medium">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 rounded-2xl bg-white/95 backdrop-blur-sm mt-0">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl text-center font-bold">Welcome back</CardTitle>
            <CardDescription className="text-center text-base text-gray-500 font-medium">
              Sign in to your admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-7" suppressHydrationWarning>
              {/* Username/Email Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="font-semibold text-gray-800">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="h-12 pl-4 pr-11 py-0 bg-white border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 rounded-lg transition-all shadow-sm text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                  autoComplete="username"
                  suppressHydrationWarning
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-gray-800">Password</Label>
                <div className="relative flex items-center h-12">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 pl-4 pr-11 py-0 bg-white border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 rounded-lg transition-all shadow-sm text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                    autoComplete="current-password"
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-0 bottom-0 flex items-center justify-center h-12 text-green-500 hover:text-green-700 transition-colors p-1"
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

              {/* Submit Button */}
              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-7 text-center">
              <p className="text-sm text-gray-500">
                Having trouble? Contact your system administrator
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer (subtle) */}
        <div className="text-center mt-8 opacity-60 text-xs">
          <p className="text-gray-400">
            © 2024 Wega Kitchenware. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 