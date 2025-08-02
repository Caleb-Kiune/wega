import { v4 as uuidv4 } from 'uuid';

// Enhanced session management for guest users
export interface GuestSession {
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  deviceInfo: {
    userAgent: string;
    screenSize: string;
    timezone: string;
  };
  preferences: {
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
  };
}

// Get or create enhanced session ID with device info
export const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return 'server-session';
  }
  
  try {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('cart_session_id', sessionId);
      
      // Store enhanced session data
      const sessionData: GuestSession = {
        sessionId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        preferences: {
          currency: 'KES',
          language: navigator.language || 'en-US',
          theme: 'system',
        },
      };
      
      localStorage.setItem('guest_session_data', JSON.stringify(sessionData));
    } else {
      // Update last activity
      const sessionData = getSessionData();
      if (sessionData) {
        sessionData.lastActivity = Date.now();
        localStorage.setItem('guest_session_data', JSON.stringify(sessionData));
      }
    }
    return sessionId;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'fallback-session';
  }
};

// Get enhanced session data
export const getSessionData = (): GuestSession | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem('guest_session_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading session data:', error);
    return null;
  }
};

// Update session preferences
export const updateSessionPreferences = (preferences: Partial<GuestSession['preferences']>) => {
  if (typeof window === 'undefined') return;
  
  try {
    const sessionData = getSessionData();
    if (sessionData) {
      sessionData.preferences = { ...sessionData.preferences, ...preferences };
      sessionData.lastActivity = Date.now();
      localStorage.setItem('guest_session_data', JSON.stringify(sessionData));
    }
  } catch (error) {
    console.error('Error updating session preferences:', error);
  }
};

// Check if session is stale (older than 30 days)
export const isSessionStale = (): boolean => {
  const sessionData = getSessionData();
  if (!sessionData) return true;
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  return sessionData.createdAt < thirtyDaysAgo;
};

// Clear session ID and data
export const clearSessionId = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('cart_session_id');
      localStorage.removeItem('guest_session_data');
    } catch (error) {
      console.error('Error clearing session ID:', error);
    }
  }
};

// Get session age in days
export const getSessionAge = (): number => {
  const sessionData = getSessionData();
  if (!sessionData) return 0;
  
  const ageInMs = Date.now() - sessionData.createdAt;
  return Math.floor(ageInMs / (24 * 60 * 60 * 1000));
}; 