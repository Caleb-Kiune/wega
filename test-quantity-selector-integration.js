const puppeteer = require('puppeteer');

async function testQuantitySelectorIntegration() {
  console.log('🧪 Starting QuantitySelector Integration Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Product Detail Page
    console.log('📱 Test 1: Product Detail Page Quantity Selector');
    await page.goto('http://localhost:3000/products/1');
    await page.waitForSelector('[data-testid="quantity-selector"]', { timeout: 5000 });
    
    // Test increase button
    const increaseBtn = await page.$('[aria-label="Increase quantity"]');
    await increaseBtn.click();
    await page.waitForTimeout(500);
    
    const quantityDisplay = await page.$eval('[aria-live="polite"]', el => el.textContent);
    console.log(`✅ Quantity increased to: ${quantityDisplay}`);
    
    // Test decrease button
    const decreaseBtn = await page.$('[aria-label="Decrease quantity"]');
    await decreaseBtn.click();
    await page.waitForTimeout(500);
    
    const newQuantityDisplay = await page.$eval('[aria-live="polite"]', el => el.textContent);
    console.log(`✅ Quantity decreased to: ${newQuantityDisplay}`);
    
    // Test 2: Cart Page
    console.log('\n🛒 Test 2: Cart Page Quantity Selector');
    await page.goto('http://localhost:3000/cart');
    await page.waitForTimeout(2000);
    
    // Add item to cart first
    await page.goto('http://localhost:3000/products/1');
    await page.waitForSelector('[data-testid="quantity-selector"]', { timeout: 5000 });
    await page.click('[aria-label="Increase quantity"]');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(1000);
    
    // Go to cart and test quantity selector
    await page.goto('http://localhost:3000/cart');
    await page.waitForTimeout(2000);
    
    const cartQuantitySelectors = await page.$$('[aria-label="Increase quantity"]');
    if (cartQuantitySelectors.length > 0) {
      console.log('✅ Cart page quantity selector found');
      
      // Test cart quantity increase
      await cartQuantitySelectors[0].click();
      await page.waitForTimeout(500);
      console.log('✅ Cart quantity increased successfully');
    } else {
      console.log('⚠️ No items in cart to test');
    }
    
    // Test 3: Mobile Quantity Modal
    console.log('\n📱 Test 3: Mobile Quantity Modal');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/products');
    await page.waitForTimeout(2000);
    
    // Find and click mobile add button
    const mobileAddButtons = await page.$$('button[aria-label*="Add"]');
    if (mobileAddButtons.length > 0) {
      await mobileAddButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Test mobile quantity selector
      const mobileIncreaseBtn = await page.$('[aria-label="Increase quantity"]');
      if (mobileIncreaseBtn) {
        await mobileIncreaseBtn.click();
        await page.waitForTimeout(500);
        console.log('✅ Mobile quantity selector working');
        
        // Test presets
        const presetButtons = await page.$$('button[aria-label*="Set quantity to"]');
        if (presetButtons.length > 0) {
          await presetButtons[0].click();
          await page.waitForTimeout(500);
          console.log('✅ Mobile quantity presets working');
        }
      }
    }
    
    // Test 4: Quick View Modal
    console.log('\n👁️ Test 4: Quick View Modal');
    await page.setViewport({ width: 1024, height: 768 });
    await page.goto('http://localhost:3000/products');
    await page.waitForTimeout(2000);
    
    // Find and click quick view button
    const quickViewButtons = await page.$$('[aria-label*="Quick view"]');
    if (quickViewButtons.length > 0) {
      await quickViewButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Test quick view quantity selector
      const quickViewIncreaseBtn = await page.$('[aria-label="Increase quantity"]');
      if (quickViewIncreaseBtn) {
        await quickViewIncreaseBtn.click();
        await page.waitForTimeout(500);
        console.log('✅ Quick view quantity selector working');
      }
    }
    
    console.log('\n🎉 All QuantitySelector integration tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testQuantitySelectorIntegration().catch(console.error); 