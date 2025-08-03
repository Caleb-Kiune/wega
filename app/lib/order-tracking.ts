import { API_BASE_URL } from './config'

export interface Order {
  id: number
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postal_code: string
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  updated_at: string
  items: any[]
}

// Order Tracking API
export const orderTrackingApi = {
  // Track specific order by email and order number
  trackOrder: async (data: {
    email: string
    order_number: string
  }): Promise<{ order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/orders/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to track order')
    }

    return response.json()
  },
} 