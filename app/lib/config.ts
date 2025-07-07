const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wega-backend.onrender.com/api';

// Debug logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

export { API_BASE_URL }; 