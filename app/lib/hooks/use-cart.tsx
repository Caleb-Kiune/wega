"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cartCount: number
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
        console.log('Cart loaded from localStorage:', parsedCart)
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
    console.log('Cart saved to localStorage:', items)
  }, [items])

  const addToCart = (newItem: CartItem) => {
    console.log('Adding item to cart:', newItem)
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        const updatedItems = prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
        console.log('Updated existing item in cart:', updatedItems)
        return updatedItems
      }
      const updatedItems = [...prev, newItem]
      console.log('Added new item to cart:', updatedItems)
      return updatedItems
    })
  }

  const removeFromCart = (id: number) => {
    console.log('Removing item from cart:', id)
    setItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== id)
      console.log('Removed item from cart:', updatedItems)
      return updatedItems
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    console.log('Updating quantity for item:', id, 'to:', quantity)
    setItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      console.log('Updated quantity in cart:', updatedItems)
      return updatedItems
    })
  }

  const clearCart = () => {
    console.log('Clearing cart')
    setItems([])
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  const value: CartContextType = {
    cartCount,
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
