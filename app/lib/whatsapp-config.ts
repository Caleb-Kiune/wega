// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  // Primary WhatsApp number for orders and customer support
  PHONE_NUMBER: "254774639253",
  
  // WhatsApp API URL format
  API_URL: "https://wa.me",
  
  // Default message templates
  MESSAGES: {
    // Default greeting for general inquiries
    GREETING: "Hello! I have a question about your products.",
    
    // Order inquiry template
    ORDER_INQUIRY: "Hello, I would like to place an order.",
    
    // Support inquiry template
    SUPPORT: "Hello! I need help with my order.",
  },
  
  // Business hours (for auto-reply messages)
  BUSINESS_HOURS: {
    START: "8:00 AM",
    END: "6:00 PM",
    TIMEZONE: "EAT", // East Africa Time
  },
  
  // Auto-reply settings
  AUTO_REPLY: {
    ENABLED: true,
    OUT_OF_HOURS_MESSAGE: "Thank you for your message! We're currently closed and will respond during business hours (8:00 AM - 6:00 PM EAT).",
  }
} as const

// Helper function to generate WhatsApp URL
export const generateWhatsAppUrl = (message: string, phoneNumber?: string): string => {
  const number = phoneNumber || WHATSAPP_CONFIG.PHONE_NUMBER
  return `${WHATSAPP_CONFIG.API_URL}/${number}?text=${encodeURIComponent(message)}`
}

// Helper function to validate phone number format
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Kenyan phone number format validation
  const phoneRegex = /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3]))[0-9]{6})$/
  return phoneRegex.test(phoneNumber)
}

// Helper function to format phone number for WhatsApp
export const formatPhoneForWhatsApp = (phoneNumber: string): string => {
  // Remove any non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // If it starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1)
  }
  
  // If it starts with +, remove it
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1)
  }
  
  // If it doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }
  
  return cleaned
}
