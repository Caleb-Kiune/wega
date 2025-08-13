// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check for explicit environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check if we're in production (deployed)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If not localhost, we're in production
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // Default production backend URL - update this to your actual backend URL
      return 'https://wega-backend.onrender.com/api';
    }
  }

  // Default to localhost for development
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Hostname:', window.location.hostname);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

// Validate API URL format
const validateApiUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!validateApiUrl(API_BASE_URL)) {
  console.error('Invalid API_BASE_URL:', API_BASE_URL);
}

export { API_BASE_URL }; 