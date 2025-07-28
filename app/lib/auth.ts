import { toast } from 'sonner';
import { API_BASE_URL } from './config';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}

export interface AuthResponse {
  message: string;
  user: AdminUser;
  tokens: AuthTokens;
}

export interface CsrfResponse {
  csrf_token: string;
}

class AuthAPI {
  private baseURL: string;
  private csrfToken: string | null = null;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('AuthAPI initialized with URL:', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Making request to:', url);
    
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
          throw new Error('Too many login attempts. Please try again later.');
        } else if (response.status === 403) {
          // CSRF token invalid
          await this.refreshCsrfToken();
          throw new Error('Session expired. Please try again.');
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Auth API request failed:', error);
      
      // Retry logic for network errors
      if (retryCount < this.retryAttempts && this.isRetryableError(error)) {
        console.log(`Retrying request (${retryCount + 1}/${this.retryAttempts})...`);
        await this.delay(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, not on authentication or validation errors
    return error.name === 'TypeError' || 
           error.message.includes('fetch') ||
           error.message.includes('network') ||
           error.message.includes('Failed to fetch');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCsrfToken(): Promise<string> {
    try {
      const response = await this.request<CsrfResponse>('/auth/csrf-token', {
        method: 'GET',
      });
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Get CSRF token before login
    await this.getCsrfToken();
    
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    return this.request<{ tokens: AuthTokens }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async logout(): Promise<{ message: string }> {
    const token = this.getAccessToken();
    if (!token) {
      // If no token, just return success since we're already logged out
      return { message: 'Logged out successfully' };
    }

    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getProfile(): Promise<{ user: AdminUser }> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    return this.request<{ user: AdminUser }>('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(data: Partial<AdminUser>): Promise<{ message: string; user: AdminUser }> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    return this.request<{ message: string; user: AdminUser }>('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  // Token management
  setTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('access_expires_in', tokens.access_expires_in.toString());
      localStorage.setItem('refresh_expires_in', tokens.refresh_expires_in.toString());
      localStorage.setItem('token_created_at', Date.now().toString());
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_expires_in');
      localStorage.removeItem('refresh_expires_in');
      localStorage.removeItem('token_created_at');
    }
  }

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const tokenCreatedAt = localStorage.getItem('token_created_at');
    const accessExpiresIn = localStorage.getItem('access_expires_in');
    
    if (!tokenCreatedAt || !accessExpiresIn) return true;
    
    const createdAt = parseInt(tokenCreatedAt);
    const expiresIn = parseInt(accessExpiresIn);
    const now = Date.now();
    
    return (now - createdAt) / 1000 > expiresIn;
  }

  isRefreshTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const tokenCreatedAt = localStorage.getItem('token_created_at');
    const refreshExpiresIn = localStorage.getItem('refresh_expires_in');
    
    if (!tokenCreatedAt || !refreshExpiresIn) return true;
    
    const createdAt = parseInt(tokenCreatedAt);
    const expiresIn = parseInt(refreshExpiresIn);
    const now = Date.now();
    
    return (now - createdAt) / 1000 > expiresIn;
  }
}

// Create a singleton instance
const authApiInstance = new AuthAPI();
export const authApi = authApiInstance; 