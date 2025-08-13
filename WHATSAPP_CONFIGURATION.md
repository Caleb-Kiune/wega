# WhatsApp Configuration Guide

## Overview

This document explains how WhatsApp integration is configured in the WEGA Kitchenware e-commerce application.

## Current Configuration

### Phone Number
- **Primary WhatsApp Number**: `+254774639253`
- **Format**: International format without `+` (254774639253)
- **Country**: Kenya

### Configuration Files

#### Frontend Configuration
- **File**: `app/lib/whatsapp-config.ts`
- **Purpose**: Centralized WhatsApp configuration for frontend components
- **Features**:
  - Phone number management
  - Message templates
  - Business hours
  - Helper functions

#### Backend Configuration
- **File**: `backend/config.py`
- **Purpose**: Server-side WhatsApp configuration
- **Environment Variable**: `WHATSAPP_PHONE_NUMBER`

## Components Using WhatsApp

### 1. WhatsApp Chat Component
- **File**: `app/components/whatsapp-chat.tsx`
- **Purpose**: Floating chat button for general inquiries
- **Usage**: Customer support and general questions

### 2. WhatsApp Order Button
- **File**: `app/components/whatsapp-order-button.tsx`
- **Purpose**: Product-specific order buttons
- **Usage**: Individual product orders

### 3. WhatsApp Checkout Button
- **File**: `app/components/whatsapp-checkout-button.tsx`
- **Purpose**: Complete cart orders via WhatsApp
- **Usage**: Full checkout process alternative

### 4. WhatsApp Utils
- **File**: `app/lib/whatsapp-utils.ts`
- **Purpose**: Order message generation and WhatsApp integration
- **Usage**: Checkout page order processing

## How to Update WhatsApp Number

### Method 1: Update Configuration File (Recommended)

1. **Frontend**: Update `app/lib/whatsapp-config.ts`
   ```typescript
   export const WHATSAPP_CONFIG = {
     PHONE_NUMBER: "254774639253", // Change this number
     // ... other config
   }
   ```

2. **Backend**: Update `backend/config.py`
   ```python
   WHATSAPP_PHONE_NUMBER = os.environ.get('WHATSAPP_PHONE_NUMBER') or '254774639253'
   ```

3. **Environment Variable** (Optional):
   ```bash
   export WHATSAPP_PHONE_NUMBER="254774639253"
   ```

### Method 2: Environment Variable (Production)

Set the environment variable in your deployment platform:

```bash
WHATSAPP_PHONE_NUMBER=254774639253
```

## Message Templates

### General Inquiry
```
Hello! I have a question about your products.
```

### Product Order
```
Hello, I would like to order:

Product: [Product Name]
Quantity: [Quantity]
Price: KES [Price]

Total: KES [Total]
```

### Complete Cart Order
```
🛒 NEW ORDER REQUEST

👤 Customer Details:
Name: [Customer Name]
Email: [Email]
Phone: [Phone]
Address: [Address]
City: [City]

🚚 Delivery Location: [Location]

📦 Order Items:
1. [Product Name]
   Quantity: [Quantity]
   Price: KES [Price]
   Subtotal: KES [Subtotal]

💰 Order Summary:
Subtotal: KES [Subtotal]
Shipping: KES [Shipping]
Total: KES [Total]

📝 Additional Notes: [Notes]
```

## Business Hours

- **Start**: 8:00 AM
- **End**: 6:00 PM
- **Timezone**: EAT (East Africa Time)

## Helper Functions

### `generateWhatsAppUrl(message, phoneNumber?)`
Generates a WhatsApp URL with the specified message.

### `validatePhoneNumber(phoneNumber)`
Validates Kenyan phone number format.

### `formatPhoneForWhatsApp(phoneNumber)`
Formats phone number for WhatsApp API.

## Testing

### Test WhatsApp Integration

1. **Add items to cart**
2. **Go to checkout page**
3. **Fill customer information**
4. **Click "Order via WhatsApp"**
5. **Verify WhatsApp opens with correct message**

### Test Individual Product Orders

1. **Go to product page**
2. **Click "Order via WhatsApp"**
3. **Verify product details in message**

### Test General Chat

1. **Click floating WhatsApp button**
2. **Verify general inquiry message**

## Troubleshooting

### Common Issues

1. **WhatsApp doesn't open**
   - Check if phone number format is correct
   - Ensure no spaces or special characters

2. **Message not formatted correctly**
   - Check message template in `whatsapp-config.ts`
   - Verify encoding in URL generation

3. **Wrong phone number**
   - Update `WHATSAPP_CONFIG.PHONE_NUMBER`
   - Clear browser cache
   - Restart development server

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Verify network requests** in browser dev tools
3. **Test WhatsApp URL** manually in browser
4. **Check environment variables** in production

## Security Considerations

- Phone numbers are stored in configuration files
- No sensitive data is transmitted via WhatsApp URLs
- Messages are URL-encoded for security
- Environment variables should be used in production

## Future Enhancements

### Planned Features

1. **WhatsApp Business API Integration**
   - Automated order processing
   - Order status updates
   - Payment confirmations

2. **Multi-language Support**
   - Swahili message templates
   - Localized business hours

3. **Analytics Dashboard**
   - WhatsApp order tracking
   - Conversion rates
   - Customer engagement metrics

4. **Auto-reply System**
   - Business hours detection
   - Automated responses
   - Queue management

## Support

For questions or issues with WhatsApp configuration:

1. Check this documentation
2. Review configuration files
3. Test with different phone numbers
4. Contact development team

---

**Last Updated**: December 2024
**Version**: 1.0
