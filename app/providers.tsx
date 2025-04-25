"use client"

import type React from "react"

import { CartProvider } from "@/lib/hooks/use-cart"
import { WishlistProvider } from "@/lib/context/wishlist-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  )
}
