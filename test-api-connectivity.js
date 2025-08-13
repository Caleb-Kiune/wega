// Test script to verify API connectivity
const API_BASE_URL = 'http://localhost:5000/api';

async function testApiConnectivity() {
  console.log('Testing API connectivity...');
  console.log('API_BASE_URL:', API_BASE_URL);
  
  try {
    // Test CSRF token endpoint
    console.log('\n1. Testing CSRF token endpoint...');
    const csrfResponse = await fetch(`${API_BASE_URL}/customer/auth/csrf-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      console.log('✅ CSRF token endpoint working:', csrfData);
      
      // Test registration endpoint
      console.log('\n2. Testing registration endpoint...');
      const registerResponse = await fetch(`${API_BASE_URL}/customer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfData.csrf_token,
        },
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'Test123!',
          first_name: 'Test2',
          last_name: 'User2'
        }),
      });
      
      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        console.log('✅ Registration endpoint working:', registerData);
      } else {
        const errorData = await registerResponse.text();
        console.log('❌ Registration endpoint failed:', registerResponse.status, errorData);
      }
    } else {
      console.log('❌ CSRF token endpoint failed:', csrfResponse.status);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run the test
testApiConnectivity();
