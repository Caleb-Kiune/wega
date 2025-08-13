// Test script to verify registration flow
const API_BASE_URL = 'http://localhost:5000/api';

async function testRegistrationFlow() {
  console.log('🧪 Testing Registration Flow...');
  
  try {
    // Step 1: Test registration
    console.log('\n1. Testing registration...');
    const csrfResponse = await fetch(`${API_BASE_URL}/customer/auth/csrf-token`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!csrfResponse.ok) {
      throw new Error('Failed to get CSRF token');
    }
    
    const csrfData = await csrfResponse.json();
    console.log('✅ CSRF token obtained');
    
    // Register a test user
    const registerResponse = await fetch(`${API_BASE_URL}/customer/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.csrf_token,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'Test123!',
        first_name: 'Test',
        last_name: 'User'
      }),
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful');
      console.log('   User ID:', registerData.user.id);
      console.log('   Email:', registerData.user.email);
      
      // Step 2: Verify user is NOT automatically logged in
      console.log('\n2. Verifying user is not automatically logged in...');
      
      // Try to access a protected endpoint without tokens
      const profileResponse = await fetch(`${API_BASE_URL}/customer/auth/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (profileResponse.status === 401) {
        console.log('✅ User correctly NOT logged in (401 Unauthorized)');
      } else {
        console.log('❌ User should not be logged in but got:', profileResponse.status);
      }
      
      // Step 3: Test login with the new account
      console.log('\n3. Testing login with new account...');
      const loginResponse = await fetch(`${API_BASE_URL}/customer/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          email: registerData.user.email,
          password: 'Test123!'
        }),
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        console.log('   Access token received:', loginData.tokens.access_token ? 'Yes' : 'No');
        
        // Step 4: Verify user can now access protected endpoints
        console.log('\n4. Verifying user can access protected endpoints...');
        const protectedResponse = await fetch(`${API_BASE_URL}/customer/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.tokens.access_token}`
          },
          credentials: 'include',
          mode: 'cors'
        });
        
        if (protectedResponse.ok) {
          console.log('✅ Protected endpoint accessible after login');
        } else {
          console.log('❌ Protected endpoint not accessible:', protectedResponse.status);
        }
      } else {
        console.log('❌ Login failed:', loginResponse.status);
      }
      
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Registration failed:', registerResponse.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRegistrationFlow();
