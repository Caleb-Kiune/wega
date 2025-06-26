import requests
import json

def test_product_update():
    print('Testing product update...')
    
    # Get products
    response = requests.get('http://localhost:5000/api/products')
    data = response.json()
    
    if not data.get('products'):
        print('No products found')
        return
    
    product = data['products'][0]
    print(f'Testing update for product {product["id"]}: {product["name"]}')
    
    # Fix features data structure - ensure they are objects with 'feature' property
    features = []
    for feature in product.get('features', []):
        if isinstance(feature, str):
            # If feature is a string, convert to object
            features.append({
                'feature': feature,
                'display_order': 0
            })
        else:
            # If feature is already an object, use it as is
            features.append(feature)
    
    # Add new test items
    new_image = {
        'image_url': 'http://localhost:5000/static/uploads/test_new_image.jpg',
        'is_primary': False,
        'display_order': len(product.get('images', []))
    }
    
    new_specification = {
        'name': 'Test New Spec',
        'value': 'Test New Value',
        'display_order': len(product.get('specifications', []))
    }
    
    new_feature = {
        'feature': 'Test New Feature',
        'display_order': len(features)
    }
    
    # Prepare update data with new items
    update_data = {
        'name': product['name'] + ' (TEST)',
        'price': product['price'],
        'stock': product['stock'],
        'description': product.get('description', ''),
        'sku': product.get('sku', ''),
        'is_new': product.get('is_new', False),
        'is_sale': product.get('is_sale', False),
        'is_featured': product.get('is_featured', False),
        'images': product.get('images', []) + [new_image],
        'specifications': product.get('specifications', []) + [new_specification],
        'features': features + [new_feature]
    }
    
    print(f'Update data: {json.dumps(update_data, indent=2)}')
    
    # Test update
    update_response = requests.put(
        f'http://localhost:5000/api/products/{product["id"]}', 
        json=update_data
    )
    
    print(f'Update status: {update_response.status_code}')
    print(f'Update response: {update_response.text}')
    
    if update_response.status_code != 200:
        print('❌ Update failed!')
    else:
        print('✅ Update successful!')
        
        # Verify the new items were added
        response_data = update_response.json()
        print(f'\nVerification:')
        print(f'Images count: {len(response_data.get("images", []))}')
        print(f'Specifications count: {len(response_data.get("specifications", []))}')
        print(f'Features count: {len(response_data.get("features", []))}')
        
        # Check if new items are present
        new_image_found = any(img.get('image_url') == new_image['image_url'] for img in response_data.get('images', []))
        new_spec_found = any(spec.get('name') == new_specification['name'] for spec in response_data.get('specifications', []))
        new_feature_found = any(feat.get('feature') == new_feature['feature'] for feat in response_data.get('features', []))
        
        print(f'New image added: {new_image_found}')
        print(f'New specification added: {new_spec_found}')
        print(f'New feature added: {new_feature_found}')

if __name__ == '__main__':
    test_product_update() 