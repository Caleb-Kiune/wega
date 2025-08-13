import { WHATSAPP_CONFIG, generateWhatsAppUrl } from "./whatsapp-config"

export interface WhatsAppOrderData {
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
  }
  cartItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  deliveryLocation?: string
  subtotal: number
  shipping: number
  total: number
  notes?: string
}

export const generateWhatsAppOrderMessage = (orderData: WhatsAppOrderData): string => {
  const { customerInfo, cartItems, deliveryLocation, subtotal, shipping, total, notes } = orderData
  
  let message = `🛒 *NEW ORDER REQUEST*\n\n`
  
  // Customer Information
  message += `👤 *Customer Details:*\n`
  message += `Name: ${customerInfo.firstName} ${customerInfo.lastName}\n`
  message += `Email: ${customerInfo.email}\n`
  message += `Phone: ${customerInfo.phone}\n`
  message += `Address: ${customerInfo.address}\n`
  message += `City: ${customerInfo.city}\n\n`
  
  // Delivery Information
  if (deliveryLocation && deliveryLocation !== "none") {
    message += `🚚 *Delivery Location:* ${deliveryLocation}\n\n`
  } else {
    message += `🏪 *Pickup at Store*\n\n`
  }
  
  // Order Items
  message += `📦 *Order Items:*\n`
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    message += `   Quantity: ${item.quantity}\n`
    message += `   Price: KES ${item.price.toLocaleString()}\n`
    message += `   Subtotal: KES ${(item.price * item.quantity).toLocaleString()}\n\n`
  })
  
  // Order Summary
  message += `💰 *Order Summary:*\n`
  message += `Subtotal: KES ${subtotal.toLocaleString()}\n`
  if (shipping > 0) {
    message += `Shipping: KES ${shipping.toLocaleString()}\n`
  } else {
    message += `Shipping: Free (Pickup)\n`
  }
  message += `*Total: KES ${total.toLocaleString()}*\n\n`
  
  // Notes
  if (notes && notes.trim()) {
    message += `📝 *Additional Notes:*\n${notes}\n\n`
  }
  
  message += `---\n`
  message += `Order placed via website checkout WhatsApp option`
  
  return message
}

export const openWhatsAppOrder = async (orderData: WhatsAppOrderData) => {
  const message = generateWhatsAppOrderMessage(orderData)
  const whatsappUrl = generateWhatsAppUrl(message)
  
  // Track WhatsApp order attempt (optional)
  try {
    await fetch('/api/whatsapp-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerInfo: orderData.customerInfo,
        total: orderData.total,
        itemCount: orderData.cartItems.length,
        timestamp: new Date().toISOString()
      }),
    })
  } catch (error) {
    console.log('WhatsApp order tracking failed:', error)
    // Don't block the user if tracking fails
  }
  
  window.open(whatsappUrl, "_blank")
}
