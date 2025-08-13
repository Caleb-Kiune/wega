'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { customerAuthApi, CustomerUser, CustomerLoginCredentials, CustomerRegisterCredentials } from '@/lib/customer-auth';
import { toast } from 'sonner';

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: CustomerLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: CustomerRegisterCredentials) => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (updatedUser: CustomerUser) => void;
  isTokenExpired: boolean;
  isRefreshing: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

interface CustomerAuthProviderProps {
  children: React.ReactNode;
}

export function CustomerAuthProvider({ children }: CustomerAuthProviderProps) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Check if token is expired
  const isTokenExpired = customerAuthApi.isTokenExpired();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check if we have valid tokens
        const accessToken = customerAuthApi.getAccessToken();
        const refreshToken = customerAuthApi.getRefreshToken();
        
        if (accessToken && !customerAuthApi.isTokenExpired()) {
          // Token is valid, get user profile
          try {
            const response = await customerAuthApi.getProfile();
            setUser(response.user);
          } catch (error) {
            console.error('Failed to get profile with valid token:', error);
            // Token might be invalid, try to refresh
            if (refreshToken && !customerAuthApi.isRefreshTokenExpired()) {
              try {
                await refreshAuth();
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear invalid tokens
                customerAuthApi.clearTokens();
              }
            } else {
              // Clear invalid tokens
              customerAuthApi.clearTokens();
            }
          }
        } else if (refreshToken && !customerAuthApi.isRefreshTokenExpired()) {
          // Access token expired but refresh token is valid
          await refreshAuth();
        } else {
          // No valid tokens, clear everything
          customerAuthApi.clearTokens();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        customerAuthApi.clearTokens();
      } finally {
        setLoading(false);
        setIsHydrated(true);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (user && isHydrated) {
      const checkTokenExpiry = () => {
        if (customerAuthApi.isTokenExpired() && !customerAuthApi.isRefreshTokenExpired()) {
          refreshAuth();
        }
      };

      // Check every 5 minutes
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
      
      // Also check immediately
      checkTokenExpiry();

      return () => clearInterval(interval);
    }
  }, [user, isHydrated]);

  const refreshAuth = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const refreshToken = customerAuthApi.getRefreshToken();
      
      if (!refreshToken || customerAuthApi.isRefreshTokenExpired()) {
        throw new Error('No valid refresh token');
      }

      const response = await customerAuthApi.refreshToken(refreshToken);
      
      // Store new tokens
      customerAuthApi.setTokens(response.tokens);
      
      // Get updated user profile
      const profileResponse = await customerAuthApi.getProfile();
      setUser(profileResponse.user);
      
      console.log('Token refreshed successfully');
      
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // Clear tokens and redirect to login
      customerAuthApi.clearTokens();
      setUser(null);
      
      // Only show error if user was previously logged in
      if (user) {
        toast.error('Session expired. Please log in again.');
        router.push('/customer/login');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [user, router]);

  const login = useCallback(async (credentials: CustomerLoginCredentials) => {
    try {
      setLoading(true);
      const response = await customerAuthApi.login(credentials);
      
      // Store tokens
      customerAuthApi.setTokens(response.tokens);
      
      // Set user
      setUser(response.user);
      
      toast.success('Login successful!');
      
      // Redirect to home or intended page
      router.push('/');
      
    } catch (error: any) {
      console.error('Customer login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (credentials: CustomerRegisterCredentials) => {
    try {
      setLoading(true);
      const response = await customerAuthApi.register(credentials);
      
      // Don't store tokens or set user - let them log in explicitly
      // customerAuthApi.setTokens(response.tokens);
      // setUser(response.user);
      
      toast.success('Registration successful! Please log in to continue.');
      
      // Redirect to login page instead of home
      router.push('/customer/login');
      
    } catch (error: any) {
      console.error('Customer registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if we have a valid token
      if (customerAuthApi.getAccessToken()) {
        await customerAuthApi.logout();
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.message.includes('Customer authentication required') || error.message.includes('Unauthorized')) {
        // This is expected when account is deleted - user no longer exists
        console.log('Logout skipped - user account was deleted');
      } else {
        console.error('Logout error:', error);
      }
    } finally {
      // Clear tokens and user state regardless of API call success
      customerAuthApi.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    }
  }, [router]);

  const updateUser = useCallback((updatedUser: CustomerUser) => {
    setUser(updatedUser);
  }, []);

  const isAuthenticated = !!user;

  return (
    <CustomerAuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      register,
      refreshAuth,
      updateUser,
      isTokenExpired,
      isRefreshing
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};
