import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wega-backend.onrender.com/api';

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
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}

export interface LoginResponse {
  message: string;
  user: AdminUser;
  tokens: AuthTokens;
}

export interface RefreshResponse {
  message: string;
  tokens: AuthTokens;
}

export class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

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
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Auth API request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    return this.request<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async logout(): Promise<{ message: string }> {
    const token = this.getAccessToken();
    if (!token) {
      return { message: 'No active session' };
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