'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, AdminUser, LoginCredentials, AuthTokens } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (user: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check authentication status on mount (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      checkAuthStatus();
    }
  }, [isHydrated]);

  // Set up token refresh interval
  useEffect(() => {
    if (isAuthenticated && isHydrated) {
      const interval = setInterval(() => {
        if (authApi.isTokenExpired() && !authApi.isRefreshTokenExpired()) {
          refreshAuth();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [user, isHydrated]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log('Checking auth status...');
      
      // Check if we have tokens
      const accessToken = authApi.getAccessToken();
      const refreshToken = authApi.getRefreshToken();
      
      console.log('Tokens found:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken 
      });
      
      if (!accessToken || !refreshToken) {
        console.log('No tokens found, setting user to null');
        setUser(null);
        return;
      }

      // Check if tokens are expired
      if (authApi.isRefreshTokenExpired()) {
        console.log('Refresh token expired, clearing tokens');
        // Both tokens expired, clear them
        authApi.clearTokens();
        setUser(null);
        return;
      }

      if (authApi.isTokenExpired()) {
        console.log('Access token expired, attempting refresh');
        // Access token expired, try to refresh
        await refreshAuth();
        return;
      }

      console.log('Tokens valid, getting user profile');
      // Tokens are valid, get user profile
      const response = await authApi.getProfile();
      setUser(response.user);
      console.log('User profile loaded:', response.user.username);
      
    } catch (error) {
      console.error('Auth status check failed:', error);
      // Clear invalid tokens
      authApi.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
      console.log('Auth status check completed');
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      const response = await authApi.login(credentials);
      
      // Store tokens
      authApi.setTokens(response.tokens);
      
      // Set user
      setUser(response.user);
      
      toast.success('Login successful!');
      
      // Redirect to admin dashboard
      router.push('/admin');
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed';
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('too many login attempts') || message.includes('account locked')) {
          errorMessage = 'Account is temporarily locked due to too many failed attempts. Please try again later.';
        } else if (message.includes('invalid credentials') || message.includes('invalid username or password')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (message.includes('401')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (message.includes('csrf') || message.includes('session expired')) {
          errorMessage = 'Session expired. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
      // This is expected if tokens are already expired or cleared
    } finally {
      // Always clear local state regardless of API call success
      authApi.clearTokens();
      setUser(null);
      
      toast.success('Logged out successfully');
      
      // Use window.location for more reliable redirect
      window.location.href = '/admin/login';
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = authApi.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(refreshToken);
      
      // Store new tokens
      authApi.setTokens(response.tokens);
      
      // Get updated user profile
      const profileResponse = await authApi.getProfile();
      setUser(profileResponse.user);
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login
      authApi.clearTokens();
      setUser(null);
      router.push('/admin/login');
      throw error;
    }
  };

  const updateUser = (updatedUser: AdminUser) => {
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading: loading || !isHydrated, // Show loading until hydrated
    login,
    logout,
    refreshAuth,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 