import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLoginPage from '../../admin/login/page';
import { useAuth } from '@/contexts/auth-context';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

const mockRouter = {
  push: jest.fn(),
};

const mockAuth = {
  login: jest.fn(),
  isAuthenticated: false,
};

describe('Login Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  describe('Form Validation', () => {
    it('shows validation errors for empty fields', async () => {
      render(<AdminLoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/username or email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('validates username length', async () => {
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.getByText(/username must be at least 3 characters long/i)).toBeInTheDocument();
      });
    });

    it('validates password length', async () => {
      render(<AdminLoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
      });
    });

    it('clears validation errors when user starts typing', async () => {
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.getByText(/username must be at least 3 characters long/i)).toBeInTheDocument();
      });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      
      await waitFor(() => {
        expect(screen.queryByText(/username must be at least 3 characters long/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Toggle', () => {
    it('toggles password visibility', async () => {
      render(<AdminLoginPage />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
      
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Remember Me', () => {
    it('toggles remember me checkbox', async () => {
      render(<AdminLoginPage />);
      
      const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
      
      expect(rememberMeCheckbox).not.toBeChecked();
      
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
      
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      mockAuth.login.mockResolvedValue(undefined);
      
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockAuth.login).toHaveBeenCalledWith({
          username: 'admin',
          password: 'password123',
          remember_me: false,
        });
      });
    });

    it('shows loading state during submission', async () => {
      mockAuth.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('handles login success', async () => {
      mockAuth.login.mockResolvedValue(undefined);
      
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Login successful!');
        expect(mockRouter.push).toHaveBeenCalledWith('/admin');
      });
    });

    it('handles login error', async () => {
      const error = new Error('Invalid credentials');
      mockAuth.login.mockRejectedValue(error);
      
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid username or password. Please check your credentials and try again.');
      });
    });

    it('handles account lockout', async () => {
      const error = new Error('Too many login attempts');
      mockAuth.login.mockRejectedValue(error);
      
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/account temporarily locked/i)).toBeInTheDocument();
        expect(screen.getByText(/too many failed attempts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<AdminLoginPage />);
      
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('noValidate');
    });

    it('has proper field labels and associations', () => {
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('has proper help text', () => {
      render(<AdminLoginPage />);
      
      expect(screen.getByText(/enter your username or email address/i)).toBeInTheDocument();
      expect(screen.getByText(/enter your password/i)).toBeInTheDocument();
      expect(screen.getByText(/keep me signed in for 30 days/i)).toBeInTheDocument();
    });

    it('has proper focus management', () => {
      render(<AdminLoginPage />);
      
      const usernameInput = screen.getByLabelText(/username or email/i);
      expect(usernameInput).toHaveFocus();
    });
  });

  describe('Forgot Password', () => {
    it('shows info message when forgot password is clicked', () => {
      render(<AdminLoginPage />);
      
      const forgotPasswordLink = screen.getByText(/forgot your password/i);
      fireEvent.click(forgotPasswordLink);
      
      expect(toast.info).toHaveBeenCalledWith('Please contact your system administrator to reset your password.');
    });
  });
}); 