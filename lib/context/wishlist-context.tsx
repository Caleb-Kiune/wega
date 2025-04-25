"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
}

interface WishlistContextType {
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const { toast } = useToast()

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        setTimeout(() => {
          toast({
            title: "Already in Wishlist",
            description: "This product is already in your wishlist.",
          })
        }, 0)
        return prev
      }
      setTimeout(() => {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }, 0)
      return [...prev, product]
    })
  }, [toast])

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
    setTimeout(() => {
      toast({
        title: "Removed from Wishlist",
        description: "The product has been removed from your wishlist.",
      })
    }, 0)
  }, [toast])

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }, [wishlist])

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
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