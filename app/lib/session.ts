import { v4 as uuidv4 } from 'uuid';

// Get or create session ID
export const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return 'server-session';
  }
  
  try {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'fallback-session';
  }
};

// Clear session ID
export const clearSessionId = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('cart_session_id');
    } catch (error) {
      console.error('Error clearing session ID:', error);
    }
  }
}; 