#!/usr/bin/env python3
"""
Deployment Validation Script for Wega Kitchenware
Validates all Cloudinary URLs and ensures seed script is production-ready
"""

import sys
import os
import requests
import time
from datetime import datetime

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def validate_cloudinary_urls():
    """Validate all Cloudinary URLs are accessible"""
    print("🔍 Validating Cloudinary URLs for Production Deployment...")
    print("=" * 60)
    
    from wega_cloudinary_mapping import LOCAL_TO_CLOUDINARY_MAPPING
    
    failed_urls = []
    successful_urls = []
    total_urls = len(LOCAL_TO_CLOUDINARY_MAPPING)
    
    for i, (local_name, cloudinary_url) in enumerate(LOCAL_TO_CLOUDINARY_MAPPING.items(), 1):
        try:
            print(f"[{i}/{total_urls}] Testing: {local_name}")
            response = requests.head(cloudinary_url, timeout=15)
            
            if response.status_code == 200:
                successful_urls.append((local_name, cloudinary_url))
                print(f"   ✅ SUCCESS: {response.status_code}")
            else:
                failed_urls.append((local_name, cloudinary_url, response.status_code))
                print(f"   ❌ FAILED: {response.status_code}")
                
        except requests.exceptions.Timeout:
            failed_urls.append((local_name, cloudinary_url, "Timeout"))
            print(f"   ❌ TIMEOUT")
        except requests.exceptions.ConnectionError:
            failed_urls.append((local_name, cloudinary_url, "Connection Error"))
            print(f"   ❌ CONNECTION ERROR")
        except Exception as e:
            failed_urls.append((local_name, cloudinary_url, f"Error: {str(e)}"))
            print(f"   ❌ ERROR: {str(e)}")
        
        # Small delay to be respectful to Cloudinary
        time.sleep(0.1)
    
    print("\n" + "=" * 60)
    print("📊 VALIDATION RESULTS:")
    print(f"   Total URLs: {total_urls}")
    print(f"   Successful: {len(successful_urls)}")
    print(f"   Failed: {len(failed_urls)}")
    print(f"   Success Rate: {(len(successful_urls)/total_urls)*100:.1f}%")
    
    if failed_urls:
        print(f"\n❌ FAILED URLS ({len(failed_urls)}):")
        for local_name, url, error in failed_urls:
            print(f"   - {local_name}: {error}")
        return False
    else:
        print(f"\n✅ ALL {total_urls} CLOUDINARY URLS ARE VALID!")
        return True

def validate_seed_script():
    """Validate the seed script can be imported and run"""
    print("\n🔍 Validating Seed Script...")
    print("=" * 60)
    
    try:
        # Test import
        from seed_56_products_cloudinary import seed_database, get_product_data
        print("✅ Seed script imports successfully")
        
        # Test product data
        products_data = get_product_data()
        print(f"✅ Product data loaded: {len(products_data)} products")
        
        # Validate product structure
        required_fields = ['name', 'description', 'price', 'sku', 'stock', 'category', 'brand', 'images']
        for i, product in enumerate(products_data):
            missing_fields = [field for field in required_fields if field not in product]
            if missing_fields:
                print(f"❌ Product {i+1} missing fields: {missing_fields}")
                return False
        
        print("✅ All products have required fields")
        
        # Validate image mappings
        from wega_cloudinary_mapping import LOCAL_TO_CLOUDINARY_MAPPING
        missing_images = []
        
        for product in products_data:
            for image in product['images']:
                if image not in LOCAL_TO_CLOUDINARY_MAPPING:
                    missing_images.append((product['name'], image))
        
        if missing_images:
            print(f"❌ Missing image mappings ({len(missing_images)}):")
            for product_name, image in missing_images:
                print(f"   - {product_name}: {image}")
            return False
        
        print("✅ All product images have Cloudinary mappings")
        return True
        
    except Exception as e:
        print(f"❌ Seed script validation failed: {e}")
        return False

def validate_database_models():
    """Validate database models can be imported"""
    print("\n🔍 Validating Database Models...")
    print("=" * 60)
    
    try:
        from models import db, Category, Brand, Product, ProductImage, ProductFeature, ProductSpecification, Review
        print("✅ All database models import successfully")
        return True
    except Exception as e:
        print(f"❌ Database models validation failed: {e}")
        return False

def main():
    """Main validation function"""
    print("🚀 WEGA KITCHENWARE - PRODUCTION DEPLOYMENT VALIDATION")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run all validations
    validations = [
        ("Database Models", validate_database_models),
        ("Seed Script", validate_seed_script),
        ("Cloudinary URLs", validate_cloudinary_urls),
    ]
    
    results = []
    for name, validation_func in validations:
        try:
            result = validation_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ {name} validation crashed: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 VALIDATION SUMMARY:")
    print("=" * 60)
    
    all_passed = True
    for name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL VALIDATIONS PASSED!")
        print("✅ READY FOR PRODUCTION DEPLOYMENT")
        print("\nNext steps:")
        print("1. Run: python scripts/seed_56_products_cloudinary.py --production")
        print("2. Deploy to production server")
        print("3. Verify images load correctly in production")
    else:
        print("❌ VALIDATIONS FAILED!")
        print("⚠️  FIX ISSUES BEFORE PRODUCTION DEPLOYMENT")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
