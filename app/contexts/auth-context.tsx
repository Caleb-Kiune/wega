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
      
      // Check if we have tokens
      const accessToken = authApi.getAccessToken();
      const refreshToken = authApi.getRefreshToken();
      
      if (!accessToken || !refreshToken) {
        setUser(null);
        return;
      }

      // Check if tokens are expired
      if (authApi.isRefreshTokenExpired()) {
        // Both tokens expired, clear them
        authApi.clearTokens();
        setUser(null);
        return;
      }

      if (authApi.isTokenExpired()) {
        // Access token expired, try to refresh
        await refreshAuth();
        return;
      }

      // Tokens are valid, get user profile
      const response = await authApi.getProfile();
      setUser(response.user);
      
    } catch (error) {
      console.error('Auth status check failed:', error);
      // Clear invalid tokens
      authApi.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
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
        
        if (message.includes('invalid credentials') || message.includes('invalid username or password')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (message.includes('401')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
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
    } finally {
      // Clear local state
      authApi.clearTokens();
      setUser(null);
      
      toast.success('Logged out successfully');
      
      // Redirect to login page
      router.push('/admin/login');
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