import { toast } from 'sonner';
import { API_BASE_URL } from './config';

export interface CustomerUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  updated_at?: string;
}

export interface CustomerLoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface CustomerRegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface CustomerAuthTokens {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}

export interface CustomerAuthResponse {
  message: string;
  user: CustomerUser;
  tokens: CustomerAuthTokens;
}

export interface CustomerProfileResponse {
  user: CustomerUser;
}

export interface CustomerRefreshResponse {
  message: string;
  tokens: CustomerAuthTokens;
}

export interface CsrfResponse {
  csrf_token: string;
}

class CustomerAuthAPI {
  private baseURL: string;
  private csrfToken: string | null = null;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('CustomerAuthAPI initialized with URL:', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Making customer auth request to:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for CSRF
      mode: 'cors', // Explicitly set CORS mode
      ...options,
    };

    // Add CSRF token if available
    if (this.csrfToken && options.method !== 'GET') {
      config.headers = {
        ...config.headers,
        'X-CSRF-Token': this.csrfToken,
      };
    }

    try {
      const response = await fetch(url, config);
      
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        
        // Handle specific error cases
        if (response.status === 429) {
          // Rate limited
          throw new Error('Too many attempts. Please try again later.');
        } else if (response.status === 403) {
          // CSRF token invalid
          await this.refreshCsrfToken();
          throw new Error('Session expired. Please try again.');
        } else if (response.status === 401) {
          // Unauthorized - token is invalid
          this.clearTokens();
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 500) {
          // Server error - might be due to invalid user
          if (errorMessage.includes('User not found') || errorMessage.includes('Failed to update profile')) {
            this.clearTokens();
            throw new Error('Session expired. Please log in again.');
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      // Check for specific error types in the response
      if (data.error === 'Account deleted') {
        throw new Error('This account has been deleted and cannot be accessed. Please create a new account.');
      }
      
      // For invalid credentials, provide a more helpful message
      if (data.error === 'Invalid credentials') {
        throw new Error('Invalid email or password. If you recently deleted your account, you will need to create a new one.');
      }
      
      return data;
      
    } catch (error: any) {
      console.error('Request failed:', error);
      
      // Enhanced error handling for network issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        if (retryCount < this.retryAttempts) {
          console.log(`Network error, retrying (${retryCount + 1}/${this.retryAttempts})...`);
          await this.delay(this.retryDelay * (retryCount + 1));
          return this.request(endpoint, options, retryCount + 1);
        } else {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
        }
      }
      
      // Handle CORS errors
      if (error.name === 'TypeError' && error.message.includes('CORS')) {
        throw new Error('CORS error: Unable to make request due to browser security restrictions.');
      }
      
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    return error.name === 'TypeError' && error.message.includes('fetch');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCsrfToken(): Promise<string> {
    try {
      console.log('Getting CSRF token...');
      const response: CsrfResponse = await this.request('/customer/auth/csrf-token');
      this.csrfToken = response.csrf_token;
      console.log('CSRF token obtained:', this.csrfToken ? 'success' : 'failed');
      return response.csrf_token;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      throw error;
    }
  }

  private async refreshCsrfToken(): Promise<void> {
    try {
      await this.getCsrfToken();
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
  }

  async register(credentials: CustomerRegisterCredentials): Promise<CustomerAuthResponse> {
    try {
      console.log('Starting registration process...');
      
      // Get CSRF token first
      await this.getCsrfToken();
      
      console.log('Making registration request...');
      const response = await this.request<CustomerAuthResponse>('/customer/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      console.log('Registration successful');
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: CustomerLoginCredentials): Promise<CustomerAuthResponse> {
    try {
      console.log('Starting login process...');
      
      const response = await this.request<CustomerAuthResponse>('/customer/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      console.log('Login successful');
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { message: 'Already logged out' };
      }

      return await this.request<{ message: string }>('/customer/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<CustomerProfileResponse> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      return await this.request<CustomerProfileResponse>('/customer/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      // If we get a 401 or 500 error, the token is likely invalid
      if (error.message.includes('Authentication required') || 
          error.message.includes('Session expired') ||
          error.message.includes('User not found')) {
        this.clearTokens();
      }
      throw error;
    }
  }

  async updateProfile(data: Partial<CustomerUser>): Promise<{ message: string; user: CustomerUser }> {
    try {
      const accessToken = this.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      return await this.request<{ message: string; user: CustomerUser }>('/customer/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      // If we get a 401 or 500 error, the token is likely invalid
      if (error.message.includes('Authentication required') || 
          error.message.includes('Session expired') ||
          error.message.includes('User not found')) {
        this.clearTokens();
      }
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      return await this.request<{ message: string }>('/customer/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<CustomerRefreshResponse> {
    try {
      return await this.request<CustomerRefreshResponse>('/customer/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async deleteAccount(data: { reason?: string } = {}): Promise<{ message: string; note: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      return await this.request<{ message: string; note: string }>('/customer/auth/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      // Check if the error is due to user already being deleted
      if (error.message.includes('User not found') || error.message.includes('already deleted')) {
        throw new Error('Your account has already been deleted. You will be logged out.');
      }
      
      // Check if the error is due to account already being deleted
      if (error.message.includes('Account already deleted')) {
        throw new Error('Your account has already been deleted. You will be logged out.');
      }
      
      throw error;
    }
  }

  async testDelete(): Promise<{ message: string; user_id: number; user_found: boolean; user_email: string | null }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      return await this.request<{ message: string; user_id: number; user_found: boolean; user_email: string | null }>('/customer/auth/test-delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Test delete error:', error);
      throw error;
    }
  }

  async exportData(): Promise<{ message: string; data: any }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      return await this.request<{ message: string; data: any }>('/customer/auth/export-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }

  // Token management methods
  setTokens(tokens: CustomerAuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customer_access_token', tokens.access_token);
      localStorage.setItem('customer_refresh_token', tokens.refresh_token);
      localStorage.setItem('customer_token_expires', (Date.now() + tokens.access_expires_in * 1000).toString());
      localStorage.setItem('customer_refresh_expires', (Date.now() + tokens.refresh_expires_in * 1000).toString());
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('customer_access_token');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('customer_refresh_token');
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_access_token');
      localStorage.removeItem('customer_refresh_token');
      localStorage.removeItem('customer_token_expires');
      localStorage.removeItem('customer_refresh_expires');
    }
  }

  isTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem('customer_token_expires');
      if (!expiresAt) return true;
      
      return Date.now() > parseInt(expiresAt);
    }
    return true;
  }

  isRefreshTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem('customer_refresh_expires');
      if (!expiresAt) return true;
      
      return Date.now() > parseInt(expiresAt);
    }
    return true;
  }
}

// Export singleton instance
export const customerAuthApi = new CustomerAuthAPI();
