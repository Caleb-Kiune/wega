"use client"

import { createContext, useContext, useState, useEffect } from "react"

type WishlistItem = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load wishlist from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isClient) return
    
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error)
    }
  }, [isClient])

  // Save wishlist to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (!isClient) return
    
    try {
      localStorage.setItem("wishlist", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error)
    }
  }, [items, isClient])

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

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
} 