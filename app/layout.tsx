import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Providers } from "./providers"
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WEGA Kitchenware | Premium Kitchen Essentials",
  description:
    "Shop high-quality cookware, utensils, appliances, and home essentials at WEGA Kitchenware. Nationwide delivery across Kenya.",
  keywords: "kitchenware, cookware, kitchen utensils, kitchen appliances, Kenya, Nairobi, cooking essentials",
  openGraph: {
    title: "WEGA Kitchenware | Premium Kitchen Essentials",
    description: "Shop high-quality cookware, utensils, appliances, and home essentials at WEGA Kitchenware.",
    url: "https://wegakitchenware.co.ke",
    siteName: "WEGA Kitchenware",
    locale: "en_KE",
    type: "website",
  },
  generator: 'v0.dev',
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Providers>
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex-grow">{children}</div>
                <Footer />
                <WhatsAppChat />
                <Toaster />
              </div>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
