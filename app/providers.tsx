"use client"

import type React from "react"
import { SWRConfig } from 'swr'

import { CartProvider } from "@/lib/hooks/use-cart"
import { WishlistProvider } from "@/lib/hooks/use-wishlist"
import { CustomerAuthProvider } from "@/lib/hooks/use-customer-auth"
import { swrConfig } from "@/lib/swr-config"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      <CustomerAuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </CustomerAuthProvider>
    </SWRConfig>
  )
}
