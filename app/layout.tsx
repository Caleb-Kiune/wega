import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import WhatsAppChat from "@/components/whatsapp-chat"
import { Providers } from "./providers"
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: true,
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  preload: true,
})

export const metadata: Metadata = {
  title: "WEGA Kitchenware - Premium Kitchen Essentials",
  description: "Discover premium kitchenware and cooking essentials. Quality cookware, appliances, and kitchen tools for the modern home chef.",
  keywords: "kitchenware, cookware, kitchen appliances, cooking tools, premium kitchen essentials",
  authors: [{ name: "WEGA Kitchenware" }],
  creator: "WEGA Kitchenware",
  publisher: "WEGA Kitchenware",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wega-kitchenware.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wega-kitchenware.vercel.app",
    title: "WEGA Kitchenware - Premium Kitchen Essentials",
    description: "Discover premium kitchenware and cooking essentials. Quality cookware, appliances, and kitchen tools for the modern home chef.",
    siteName: "WEGA Kitchenware",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WEGA Kitchenware - Premium Kitchen Essentials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WEGA Kitchenware - Premium Kitchen Essentials",
    description: "Discover premium kitchenware and cooking essentials. Quality cookware, appliances, and kitchen tools for the modern home chef.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              storageKey="wega-theme"
            >
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <WhatsAppChat />
              <Toaster 
                position="top-right"
                richColors
                closeButton
                duration={4000}
              />
            </ThemeProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
