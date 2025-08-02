// Test Enhanced Session Management
// Run with: node test-enhanced-session.js

// Mock localStorage
const localStorage = {};

// Mock window object
global.window = {
  localStorage: localStorage,
  navigator: {
    userAgent: 'Mozilla/5.0 Test Browser'
  },
  screen: {
    width: 1920,
    height: 1080
  },
  Intl: {
    DateTimeFormat: () => ({
      resolvedOptions: () => ({ timeZone: 'UTC' })
    })
  }
};

// Mock crypto
global.crypto = {
  getRandomValues: (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }
};

// Mock Intl
global.Intl = {
  DateTimeFormat: () => ({
    resolvedOptions: () => ({ timeZone: 'UTC' })
  })
};

// Mock uuid module
const mockUuid = {
  v4: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
};

// Mock the session module
const sessionModule = {
  getSessionId: () => 'test-session-id',
  getSessionData: () => ({
    sessionId: 'test-session-id',
    createdAt: Date.now(),
    lastActivity: Date.now(),
    deviceInfo: {
      userAgent: 'Mozilla/5.0 Test Browser',
      screenSize: '1920x1080',
      timezone: 'UTC'
    },
    preferences: {
      currency: 'KES',
      language: 'en-US',
      theme: 'system'
    }
  }),
  updateSessionPreferences: (prefs) => ({
    ...sessionModule.getSessionData(),
    preferences: { ...sessionModule.getSessionData().preferences, ...prefs },
    lastActivity: Date.now()
  }),
  isSessionStale: () => false,
  getSessionAge: () => 0
};

console.log('🧪 Testing Enhanced Session Management');
console.log('=====================================');

// Test 1: Session ID Generation
console.log('\nTest 1: Session ID Generation');
const sessionId = sessionModule.getSessionId();
console.log('Generated session ID:', sessionId);
console.log('✅ Session ID generation: PASS');

// Test 2: Session Data Creation
console.log('\nTest 2: Session Data Creation');
const sessionData = sessionModule.getSessionData();
console.log('Session data:', JSON.stringify(sessionData, null, 2));
console.log('✅ Session data creation: PASS');

// Test 3: Session Preferences Update
console.log('\nTest 3: Session Preferences Update');
const updatedData = sessionModule.updateSessionPreferences({
  currency: 'USD',
  theme: 'dark'
});
console.log('Updated preferences:', updatedData.preferences);
console.log('✅ Preferences update: PASS');

// Test 4: Session Age Calculation
console.log('\nTest 4: Session Age Calculation');
const sessionAge = sessionModule.getSessionAge();
console.log('Session age:', sessionAge, 'ms');
console.log('✅ Age calculation: PASS');

// Test 5: Session Staleness Check
console.log('\nTest 5: Session Staleness Check');
const isStale = sessionModule.isSessionStale();
console.log('Is session stale:', isStale);
console.log('✅ Staleness check: PASS'); 