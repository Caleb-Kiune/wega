"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User, Heart, Search, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cartCount } = useCart()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = [
    { name: "Cookware", href: "/products?category=cookware" },
    { name: "Utensils", href: "/products?category=utensils" },
    { name: "Appliances", href: "/products?category=appliances" },
    { name: "Home Essentials", href: "/products?category=home-essentials" },
    { name: "Storage Solutions", href: "/products?category=storage" },
  ]

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-white",
      )}
    >
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <Phone className="h-3 w-3 mr-1" />
            <span>Call us: 0769899432</span>
          </div>
          <div>Free delivery on orders above KES 5,000</div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
                alt="WEGA Kitchenware Logo"
                width={120}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input type="text" placeholder="Search for products..." className="w-full pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-gray-700 hover:text-green-600 font-medium transition-colors",
                  pathname === link.href && "text-green-600 font-semibold",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Search (Mobile) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden sm:flex text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn("text-lg font-medium", pathname === link.href && "text-green-600")}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4">
                    <p className="font-medium mb-2">Shop by Category</p>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block py-2 text-gray-600 hover:text-green-600"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex flex-col space-y-2">
                    <Link href="/account" className="text-gray-600 hover:text-green-600">
                      My Account
                    </Link>
                    <Link href="/wishlist" className="text-gray-600 hover:text-green-600">
                      Wishlist
                    </Link>
                    <Link href="/cart" className="text-gray-600 hover:text-green-600">
                      Cart
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar (Conditional) */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative w-full">
              <Input type="text" placeholder="Search for products..." className="w-full pr-10" autoFocus />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Categories Navigation (Desktop) */}
        <div className="hidden md:block border-t">
          <div className="flex justify-center space-x-8 py-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-gray-600 hover:text-green-600 font-medium text-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
