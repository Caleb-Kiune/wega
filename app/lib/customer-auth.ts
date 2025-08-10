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
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
      
    } catch (error: any) {
      // Retry logic for network errors
      if (this.isRetryableError(error) && retryCount < this.retryAttempts) {
        console.log(`Retrying request (${retryCount + 1}/${this.retryAttempts})...`);
        await this.delay(this.retryDelay * (retryCount + 1));
        return this.request(endpoint, options, retryCount + 1);
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
      const response: CsrfResponse = await this.request('/api/customer/auth/csrf-token');
      this.csrfToken = response.csrf_token;
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
      // Get CSRF token first
      await this.getCsrfToken();
      
      return await this.request<CustomerAuthResponse>('/api/customer/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: CustomerLoginCredentials): Promise<CustomerAuthResponse> {
    try {
      return await this.request<CustomerAuthResponse>('/api/customer/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
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

      return await this.request<{ message: string }>('/api/customer/auth/logout', {
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

      return await this.request<CustomerProfileResponse>('/api/customer/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<CustomerUser>): Promise<{ message: string; user: CustomerUser }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Get CSRF token first
      await this.getCsrfToken();

      return await this.request<{ message: string; user: CustomerUser }>('/api/customer/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<CustomerRefreshResponse> {
    try {
      return await this.request<CustomerRefreshResponse>('/api/customer/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Token refresh error:', error);
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
