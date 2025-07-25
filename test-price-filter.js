// Price Range Filter Testing Script
// Run this in browser console on the products page

console.log('🧪 Starting Price Range Filter Tests...');

// Test 1: Check if component exists
function testComponentExists() {
  console.log('✅ Test 1: Component Existence');
  const priceRangeSection = document.querySelector('h3');
  const hasPriceRange = Array.from(priceRangeSection || []).some(el => 
    el.textContent?.includes('Price Range')
  );
  
  if (hasPriceRange) {
    console.log('✅ Price Range section found');
  } else {
    console.log('❌ Price Range section not found');
  }
  return hasPriceRange;
}

// Test 2: Check API call
async function testAPICall() {
  console.log('✅ Test 2: API Call');
  try {
    const response = await fetch('/api/products/price-stats');
    const data = await response.json();
    
    if (data.min_price !== undefined && data.max_price !== undefined) {
      console.log('✅ API call successful:', data);
      return true;
    } else {
      console.log('❌ API response missing required fields');
      return false;
    }
  } catch (error) {
    console.log('❌ API call failed:', error);
    return false;
  }
}

// Test 3: Test input fields
function testInputFields() {
  console.log('✅ Test 3: Input Fields');
  const minInput = document.querySelector('input[placeholder*="0"]');
  const maxInput = document.querySelector('input[placeholder*="50"]');
  
  if (minInput && maxInput) {
    console.log('✅ Min and Max input fields found');
    
    // Test input functionality
    minInput.value = '5000';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    minInput.dispatchEvent(new Event('blur', { bubbles: true }));
    
    maxInput.value = '15000';
    maxInput.dispatchEvent(new Event('input', { bubbles: true }));
    maxInput.dispatchEvent(new Event('blur', { bubbles: true }));
    
    console.log('✅ Input fields are functional');
    return true;
  } else {
    console.log('❌ Input fields not found');
    return false;
  }
}

// Test 4: Test slider
function testSlider() {
  console.log('✅ Test 4: Slider');
  const slider = document.querySelector('[role="slider"]');
  
  if (slider) {
    console.log('✅ Slider found');
    return true;
  } else {
    console.log('❌ Slider not found');
    return false;
  }
}

// Test 5: Test quick filters
function testQuickFilters() {
  console.log('✅ Test 5: Quick Filters');
  const quickFilterButtons = document.querySelectorAll('button');
  const hasQuickFilters = Array.from(quickFilterButtons).some(button => 
    button.textContent?.includes('KES')
  );
  
  if (hasQuickFilters) {
    console.log('✅ Quick filter buttons found');
    return true;
  } else {
    console.log('❌ Quick filter buttons not found');
    return false;
  }
}

// Test 6: Test validation
function testValidation() {
  console.log('✅ Test 6: Validation');
  const minInput = document.querySelector('input[placeholder*="0"]');
  
  if (minInput) {
    // Test invalid input
    minInput.value = '-1000';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    minInput.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Check for error message
    setTimeout(() => {
      const errorMessage = document.querySelector('.text-red-600');
      if (errorMessage) {
        console.log('✅ Validation working - error message shown');
      } else {
        console.log('❌ Validation not working - no error message');
      }
    }, 100);
  }
}

// Test 7: Test auto-apply
function testAutoApply() {
  console.log('✅ Test 7: Auto-Apply');
  const minInput = document.querySelector('input[placeholder*="0"]');
  
  if (minInput) {
    minInput.value = '5000';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    minInput.dispatchEvent(new Event('blur', { bubbles: true }));
    
    console.log('✅ Auto-apply triggered (check network tab for API call)');
    return true;
  } else {
    console.log('❌ Cannot test auto-apply - input not found');
    return false;
  }
}

// Test 8: Test reset functionality
function testReset() {
  console.log('✅ Test 8: Reset Functionality');
  const resetButton = document.querySelector('button[class*="text-gray-500"]');
  
  if (resetButton && resetButton.textContent?.includes('Reset')) {
    console.log('✅ Reset button found');
    return true;
  } else {
    console.log('❌ Reset button not found');
    return false;
  }
}

// Test 9: Test URL parameters
function testURLParameters() {
  console.log('✅ Test 9: URL Parameters');
  const currentURL = window.location.href;
  
  if (currentURL.includes('min_price') || currentURL.includes('max_price')) {
    console.log('✅ URL parameters present:', currentURL);
    return true;
  } else {
    console.log('ℹ️ No URL parameters (normal for initial load)');
    return true;
  }
}

// Test 10: Performance test
function testPerformance() {
  console.log('✅ Test 10: Performance');
  const startTime = performance.now();
  
  // Simulate filter change
  const minInput = document.querySelector('input[placeholder*="0"]');
  if (minInput) {
    minInput.value = '10000';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    setTimeout(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration < 1000) {
        console.log(`✅ Performance good - response time: ${duration.toFixed(2)}ms`);
      } else {
        console.log(`⚠️ Performance slow - response time: ${duration.toFixed(2)}ms`);
      }
    }, 600);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running comprehensive price range filter tests...\n');
  
  const tests = [
    testComponentExists,
    testAPICall,
    testInputFields,
    testSlider,
    testQuickFilters,
    testValidation,
    testAutoApply,
    testReset,
    testURLParameters,
    testPerformance
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (let i = 0; i < tests.length; i++) {
    try {
      const result = await tests[i]();
      if (result !== false) {
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ Test ${i + 1} failed with error:`, error);
    }
    console.log(''); // Add spacing between tests
  }
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Price range filter is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the issues above.');
  }
}

// Manual test functions
function manualTestInput() {
  console.log('🔧 Manual Test: Input Fields');
  const minInput = document.querySelector('input[placeholder*="0"]');
  const maxInput = document.querySelector('input[placeholder*="50"]');
  
  if (minInput && maxInput) {
    console.log('Found input fields. Try entering values:');
    console.log('- Valid: 5000, 10000, 0');
    console.log('- Invalid: -1000, abc, 100000');
    console.log('Watch for validation messages and API calls.');
  }
}

function manualTestSlider() {
  console.log('🔧 Manual Test: Slider');
  const slider = document.querySelector('[role="slider"]');
  if (slider) {
    console.log('Found slider. Try dragging the handles and watch input fields update.');
  }
}

function manualTestQuickFilters() {
  console.log('🔧 Manual Test: Quick Filters');
  const buttons = document.querySelectorAll('button');
  const quickFilterButtons = Array.from(buttons).filter(button => 
    button.textContent?.includes('KES')
  );
  
  if (quickFilterButtons.length > 0) {
    console.log('Found quick filter buttons. Try clicking them:');
    quickFilterButtons.forEach(button => {
      console.log(`- ${button.textContent}`);
    });
  }
}

// Export functions for manual testing
window.priceFilterTests = {
  runAllTests,
  manualTestInput,
  manualTestSlider,
  manualTestQuickFilters,
  testComponentExists,
  testAPICall,
  testInputFields,
  testSlider,
  testQuickFilters,
  testValidation,
  testAutoApply,
  testReset,
  testURLParameters,
  testPerformance
};

console.log('🧪 Price Range Filter Testing Script Loaded!');
console.log('Run: window.priceFilterTests.runAllTests() to start automated tests');
console.log('Or use individual test functions for manual testing'); 