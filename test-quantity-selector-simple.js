const { exec } = require('child_process');
const fs = require('fs');

console.log('🧪 Starting Simple QuantitySelector Tests...\n');

// Test 1: Check if all files exist
console.log('📁 Test 1: File Existence Check');
const requiredFiles = [
  'app/components/ui/quantity-selector.tsx',
  'app/components/product-card.tsx',
  'app/products/[id]/page.tsx',
  'app/cart/page.tsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Test 2: Check TypeScript compilation
console.log('\n🔧 Test 2: TypeScript Compilation');
exec('npx tsc --noEmit', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ TypeScript compilation failed:');
    console.log(stderr);
  } else {
    console.log('✅ TypeScript compilation successful');
  }
});

// Test 3: Check Next.js build
console.log('\n🏗️ Test 3: Next.js Build Check');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Build failed:');
    console.log(stderr);
  } else {
    console.log('✅ Build successful');
    
    // Test 4: Check for specific patterns in built files
    console.log('\n🔍 Test 4: Component Integration Check');
    
    // Check if QuantitySelector is imported in product-card.tsx
    const productCardContent = fs.readFileSync('app/components/product-card.tsx', 'utf8');
    if (productCardContent.includes('QuantitySelector')) {
      console.log('✅ QuantitySelector imported in product-card.tsx');
    } else {
      console.log('❌ QuantitySelector not found in product-card.tsx');
    }
    
    // Check if QuantitySelector is imported in product detail page
    const productDetailContent = fs.readFileSync('app/products/[id]/page.tsx', 'utf8');
    if (productDetailContent.includes('QuantitySelector')) {
      console.log('✅ QuantitySelector imported in product detail page');
    } else {
      console.log('❌ QuantitySelector not found in product detail page');
    }
    
    // Check if QuantitySelector is imported in cart page
    const cartContent = fs.readFileSync('app/cart/page.tsx', 'utf8');
    if (cartContent.includes('QuantitySelector')) {
      console.log('✅ QuantitySelector imported in cart page');
    } else {
      console.log('❌ QuantitySelector not found in cart page');
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Manual Testing Checklist:');
    console.log('1. Start dev server: npm run dev');
    console.log('2. Test Product Detail Page: http://localhost:3000/products/1');
    console.log('3. Test Cart Page: http://localhost:3000/cart');
    console.log('4. Test Mobile Modal: Use mobile viewport in dev tools');
    console.log('5. Test Quick View: Hover over products on desktop');
  }
});

console.log('\n⏳ Running tests... (this may take a moment)'); 