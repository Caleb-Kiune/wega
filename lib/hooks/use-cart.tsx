"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { cartApi, Cart, CartItem } from "@/app/lib/api/cart"

interface Product {
  id: number
  name: string
  price: number
  image: string
  quantity?: number
}

interface CartContextType {
  cart: Cart | null
  cartCount: number
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const { toast } = useToast()

  // Load cart from server on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await cartApi.getCart()
        setCart(cartData)
        setCartCount(cartData.items.reduce((total, item) => total + item.quantity, 0))
      } catch (error) {
        console.error("Failed to load cart:", error)
        // Show user-friendly error message for connection issues
        if (error instanceof Error) {
          if (error.message.includes('Cannot connect to server')) {
            toast({
              title: "Connection Error",
              description: "Cannot connect to the server. Please ensure the backend is running.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to load cart. Please refresh the page.",
              variant: "destructive",
            })
          }
        }
      }
    }
    loadCart()
  }, [toast])

  const addToCart = async (product: Product) => {
    try {
      const updatedCart = await cartApi.addItem(product.id, product.quantity || 1)
      setCart(updatedCart)
      setCartCount(updatedCart.items.reduce((total, item) => total + item.quantity, 0))
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = async (productId: number) => {
    try {
      const updatedCart = await cartApi.removeItem(productId)
      setCart(updatedCart)
      setCartCount(updatedCart.items.reduce((total, item) => total + item.quantity, 0))
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return
    try {
      const updatedCart = await cartApi.updateItem(productId, quantity)
      setCart(updatedCart)
      setCartCount(updatedCart.items.reduce((total, item) => total + item.quantity, 0))
    } catch (error) {
      console.error("Failed to update cart item quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      const updatedCart = await cartApi.clearCart()
      setCart(updatedCart)
      setCartCount(0)
    } catch (error) {
      console.error("Failed to clear cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
