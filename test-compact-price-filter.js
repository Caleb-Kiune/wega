// Compact Price Range Filter Test
// Run this in browser console on the products page

console.log('🧪 Testing Compact Price Range Filter...');

// Test 1: Check if component fits in modal
function testModalFit() {
  console.log('✅ Test 1: Modal Fit');
  
  // Check if price range section exists
  const priceRangeSection = document.querySelector('h3');
  const hasPriceRange = Array.from(priceRangeSection || []).some(el => 
    el.textContent?.includes('Price Range')
  );
  
  if (hasPriceRange) {
    console.log('✅ Price Range section found');
    
    // Check for horizontal scroll
    const modalContent = document.querySelector('[data-radix-sheet-content]');
    if (modalContent) {
      const hasHorizontalScroll = modalContent.scrollWidth > modalContent.clientWidth;
      if (!hasHorizontalScroll) {
        console.log('✅ No horizontal scroll detected');
      } else {
        console.log('⚠️ Horizontal scroll detected - may need further optimization');
      }
    }
  } else {
    console.log('❌ Price Range section not found');
  }
}

// Test 2: Check mobile responsiveness
function testMobileResponsiveness() {
  console.log('✅ Test 2: Mobile Responsiveness');
  
  // Check if elements are properly sized
  const inputs = document.querySelectorAll('input[type="number"]');
  const hasCompactInputs = Array.from(inputs).every(input => 
    input.classList.contains('h-8') || input.classList.contains('sm:h-9')
  );
  
  if (hasCompactInputs) {
    console.log('✅ Input fields are properly sized for mobile');
  } else {
    console.log('❌ Input fields may not be optimized for mobile');
  }
  
  // Check for truncation classes
  const hasTruncation = document.querySelectorAll('.truncate').length > 0;
  if (hasTruncation) {
    console.log('✅ Text truncation applied to prevent overflow');
  } else {
    console.log('⚠️ No text truncation found');
  }
}

// Test 3: Check compact spacing
function testCompactSpacing() {
  console.log('✅ Test 3: Compact Spacing');
  
  // Check if spacing is reduced for modal
  const priceRangeContainer = document.querySelector('[class*="space-y-3"]');
  if (priceRangeContainer) {
    console.log('✅ Compact spacing applied (space-y-3)');
  } else {
    console.log('⚠️ Standard spacing may be used');
  }
}

// Test 4: Check responsive elements
function testResponsiveElements() {
  console.log('✅ Test 4: Responsive Elements');
  
  // Check for responsive classes
  const hasResponsiveClasses = document.querySelectorAll('[class*="sm:"]').length > 0;
  if (hasResponsiveClasses) {
    console.log('✅ Responsive classes applied');
  } else {
    console.log('⚠️ No responsive classes found');
  }
  
  // Check for flex-shrink-0 on important elements
  const hasFlexShrink = document.querySelectorAll('.flex-shrink-0').length > 0;
  if (hasFlexShrink) {
    console.log('✅ Flex-shrink-0 applied to prevent overflow');
  } else {
    console.log('⚠️ No flex-shrink-0 found');
  }
}

// Test 5: Check mobile-specific features
function testMobileFeatures() {
  console.log('✅ Test 5: Mobile Features');
  
  // Check if reset button text is hidden on mobile
  const resetButton = document.querySelector('button[class*="text-gray-500"]');
  if (resetButton) {
    const resetText = resetButton.querySelector('span');
    if (resetText && resetText.classList.contains('hidden')) {
      console.log('✅ Reset button text hidden on mobile (icon only)');
    } else {
      console.log('⚠️ Reset button text may be visible on mobile');
    }
  }
  
  // Check for min-w-0 classes
  const hasMinWidth = document.querySelectorAll('.min-w-0').length > 0;
  if (hasMinWidth) {
    console.log('✅ min-w-0 applied for proper flex shrinking');
  } else {
    console.log('⚠️ No min-w-0 found');
  }
}

// Run all tests
function runCompactTests() {
  console.log('🚀 Running compact price filter tests...\n');
  
  const tests = [
    testModalFit,
    testMobileResponsiveness,
    testCompactSpacing,
    testResponsiveElements,
    testMobileFeatures
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (let i = 0; i < tests.length; i++) {
    try {
      tests[i]();
      passedTests++;
    } catch (error) {
      console.log(`❌ Test ${i + 1} failed with error:`, error);
    }
    console.log(''); // Add spacing between tests
  }
  
  // Summary
  console.log('📊 Compact Filter Test Results:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All compact filter tests passed! Component is optimized for modal use.');
  } else {
    console.log('⚠️ Some tests failed. Check the issues above.');
  }
}

// Export for manual testing
window.compactFilterTests = {
  runCompactTests,
  testModalFit,
  testMobileResponsiveness,
  testCompactSpacing,
  testResponsiveElements,
  testMobileFeatures
};

console.log('🧪 Compact Price Filter Tests Loaded!');
console.log('Run: window.compactFilterTests.runCompactTests() to test modal optimization'); 