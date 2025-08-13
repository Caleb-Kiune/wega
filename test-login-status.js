// Test script to verify login status indication
const API_BASE_URL = 'http://localhost:5000/api';

async function testLoginStatus() {
  console.log('🧪 Testing Login Status Indication...');
  
  try {
    // Step 1: Test login
    console.log('\n1. Testing login...');
    const loginResponse = await fetch(`${API_BASE_URL}/customer/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!'
      }),
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('   User:', loginData.user.first_name, loginData.user.last_name);
      console.log('   Email:', loginData.user.email);
      console.log('   Access token received:', loginData.tokens.access_token ? 'Yes' : 'No');
      
      // Step 2: Test profile access with token
      console.log('\n2. Testing profile access...');
      const profileResponse = await fetch(`${API_BASE_URL}/customer/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.tokens.access_token}`
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile accessible');
        console.log('   User ID:', profileData.user.id);
        console.log('   Name:', profileData.user.first_name, profileData.user.last_name);
        console.log('   Email:', profileData.user.email);
        console.log('   Is Active:', profileData.user.is_active);
      } else {
        console.log('❌ Profile not accessible:', profileResponse.status);
      }
      
      // Step 3: Test logout
      console.log('\n3. Testing logout...');
      const logoutResponse = await fetch(`${API_BASE_URL}/customer/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.tokens.access_token}`
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (logoutResponse.ok) {
        console.log('✅ Logout successful');
        
        // Step 4: Verify user is logged out
        console.log('\n4. Verifying user is logged out...');
        const verifyLogoutResponse = await fetch(`${API_BASE_URL}/customer/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.tokens.access_token}`
          },
          credentials: 'include',
          mode: 'cors'
        });
        
        if (verifyLogoutResponse.status === 401) {
          console.log('✅ User correctly logged out (401 Unauthorized)');
        } else {
          console.log('❌ User should be logged out but got:', verifyLogoutResponse.status);
        }
      } else {
        console.log('❌ Logout failed:', logoutResponse.status);
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', loginResponse.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLoginStatus();
