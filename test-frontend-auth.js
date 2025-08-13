// Test frontend authentication state
console.log('🔍 Testing Frontend Authentication State...');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('✅ Browser environment detected');
  
  // Check localStorage for tokens
  const accessToken = localStorage.getItem('customer_access_token');
  const refreshToken = localStorage.getItem('customer_refresh_token');
  
  console.log('Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('Refresh Token:', refreshToken ? 'Present' : 'Missing');
  
  if (accessToken) {
    // Decode JWT token (basic decode, not verification)
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('Token Payload:', {
        user_id: payload.user_id,
        username: payload.username,
        role: payload.role,
        exp: new Date(payload.exp * 1000).toISOString()
      });
    } catch (e) {
      console.log('❌ Could not decode token:', e.message);
    }
  }
} else {
  console.log('❌ Not in browser environment');
}

// Test API call simulation
async function testFrontendAPI() {
  console.log('\n🧪 Testing Frontend API Call...');
  
  try {
    const accessToken = localStorage.getItem('customer_access_token');
    
    if (!accessToken) {
      console.log('❌ No access token found');
      return;
    }
    
    const response = await fetch('http://localhost:5000/api/customer/auth/test-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Frontend API call successful:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Frontend API call failed:', response.status, errorText);
    }
  } catch (error) {
    console.log('❌ Frontend API call error:', error.message);
  }
}

// Run the test if in browser
if (typeof window !== 'undefined') {
  testFrontendAPI();
}
