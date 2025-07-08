"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type WishlistItem = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

interface WishlistProviderProps {
  children: ReactNode
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist))
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      if (!prev.find((i) => i.id === item.id)) {
        return [...prev, item]
      }
      return prev
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  const value: WishlistContextType = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
} 