#!/usr/bin/env python3
"""
Simple script to seed delivery locations for testing
"""

import os
import sys
# Add the parent directory to the path so we can import from the backend root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app_factory import create_app
from models import db, DeliveryLocation

def seed_delivery_locations():
    """Seed delivery locations for testing"""
    
    print("🌱 Seeding delivery locations...")
    
    app = create_app('development')
    
    with app.app_context():
        # Clear existing locations
        DeliveryLocation.query.delete()
        
        # Define test locations
        locations = [
            {
                'name': 'Nairobi',
                'slug': 'nairobi',
                'city': 'Nairobi',
                'shipping_price': 500.00,
                'is_active': True
            },
            {
                'name': 'Mombasa',
                'slug': 'mombasa',
                'city': 'Mombasa',
                'shipping_price': 800.00,
                'is_active': True
            },
            {
                'name': 'Kisumu',
                'slug': 'kisumu',
                'city': 'Kisumu',
                'shipping_price': 600.00,
                'is_active': True
            },
            {
                'name': 'Nakuru',
                'slug': 'nakuru',
                'city': 'Nakuru',
                'shipping_price': 400.00,
                'is_active': True
            },
            {
                'name': 'Eldoret',
                'slug': 'eldoret',
                'city': 'Eldoret',
                'shipping_price': 700.00,
                'is_active': True
            }
        ]
        
        # Add locations
        for location_data in locations:
            location = DeliveryLocation(**location_data)
            db.session.add(location)
            print(f"  ✅ Added: {location.name} - KES {location.shipping_price}")
        
        # Commit changes
        db.session.commit()
        print(f"\n🎉 Successfully seeded {len(locations)} delivery locations!")

if __name__ == '__main__':
    seed_delivery_locations() 