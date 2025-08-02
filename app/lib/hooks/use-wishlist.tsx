"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/lib/hooks/use-toast"
import { guestWishlistApi, Wishlist, WishlistItem } from "@/lib/wishlist"

interface WishlistContextType {
  wishlist: Wishlist | null
  wishlistCount: number
  isInWishlist: (productId: number) => boolean
  addToWishlist: (product: any) => void
  removeFromWishlist: (productId: number) => void
  clearWishlist: () => void
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true)
        const wishlistData = guestWishlistApi.getWishlist()
        setWishlist(wishlistData)
        setWishlistCount(wishlistData.items.length)
      } catch (error) {
        console.error("Failed to load wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to load wishlist. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [toast])

  const addToWishlist = (product: any) => {
    try {
      const updatedWishlist = guestWishlistApi.addItem(product)
      setWishlist(updatedWishlist)
      setWishlistCount(updatedWishlist.items.length)
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    } catch (error) {
      console.error("Failed to add item to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromWishlist = (productId: number) => {
    try {
      const updatedWishlist = guestWishlistApi.removeItem(productId)
      setWishlist(updatedWishlist)
      setWishlistCount(updatedWishlist.items.length)
      
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearWishlist = () => {
    try {
      const updatedWishlist = guestWishlistApi.clearWishlist()
      setWishlist(updatedWishlist)
      setWishlistCount(0)
      
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to clear wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isInWishlist = (productId: number): boolean => {
    return guestWishlistApi.isInWishlist(productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        loading,
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