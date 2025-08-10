'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { customerAuthApi, CustomerUser, CustomerLoginCredentials, CustomerAuthTokens } from '@/lib/customer-auth';
import { toast } from 'sonner';

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: CustomerLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: CustomerRegisterCredentials) => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (user: CustomerUser) => void;
}

interface CustomerRegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

interface CustomerAuthProviderProps {
  children: ReactNode;
}

export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = customerAuthApi.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await customerAuthApi.refreshToken(refreshToken);
      customerAuthApi.setTokens(response.tokens);
      
      // Get updated user profile
      const profileResponse = await customerAuthApi.getProfile();
      setUser(profileResponse.user);
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login
      customerAuthApi.clearTokens();
      setUser(null);
      router.push('/login');
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Checking customer auth status...');
      
      // Check if we have tokens
      const accessToken = customerAuthApi.getAccessToken();
      const refreshToken = customerAuthApi.getRefreshToken();
      
      console.log('Customer tokens found:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken 
      });
      
      if (!accessToken || !refreshToken) {
        console.log('No customer tokens found, setting user to null');
        setUser(null);
        return;
      }

      // Check if tokens are expired
      if (customerAuthApi.isRefreshTokenExpired()) {
        console.log('Customer refresh token expired, clearing tokens');
        customerAuthApi.clearTokens();
        setUser(null);
        return;
      }

      if (customerAuthApi.isTokenExpired()) {
        console.log('Customer access token expired, attempting refresh');
        await refreshAuth();
        return;
      }

      console.log('Customer tokens valid, getting user profile');
      // Tokens are valid, get user profile
      const response = await customerAuthApi.getProfile();
      setUser(response.user);
      
    } catch (error) {
      console.error('Error checking customer auth status:', error);
      // Clear invalid tokens
      customerAuthApi.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refreshAuth]);

  // Check authentication status on mount (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      checkAuthStatus();
    }
  }, [isHydrated, checkAuthStatus]);

  // Set up token refresh interval
  useEffect(() => {
    if (user && isHydrated) {
      const interval = setInterval(() => {
        if (customerAuthApi.isTokenExpired() && !customerAuthApi.isRefreshTokenExpired()) {
          refreshAuth();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [user, isHydrated, refreshAuth]);

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
  }, []);

  const register = useCallback(async (credentials: CustomerRegisterCredentials) => {
    try {
      setLoading(true);
      const response = await customerAuthApi.register(credentials);
      
      // Store tokens
      customerAuthApi.setTokens(response.tokens);
      
      // Set user
      setUser(response.user);
      
      toast.success('Registration successful! Welcome to Wega Kitchenware!');
      
      // Redirect to home
      router.push('/');
      
    } catch (error: any) {
      console.error('Customer registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if we have a valid token
      if (customerAuthApi.getAccessToken()) {
        await customerAuthApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user state regardless of API call success
      customerAuthApi.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    }
  }, []);

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
      updateUser
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};
