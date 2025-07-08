// Environment-based API configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Determine the API base URL
let API_BASE_URL: string;

if (isDevelopment && isLocalhost) {
  // Use localhost in development (override any env vars)
  API_BASE_URL = 'http://localhost:5000/api';
} else if (process.env.NEXT_PUBLIC_API_URL) {
  // Use environment variable if set (for production/staging)
  API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
} else {
  // Fallback to production
  API_BASE_URL = 'https://wega-backend.onrender.com/api';
}

// Debug logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Is Localhost:', isLocalhost);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

export { API_BASE_URL }; 