"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingCart, Heart, Phone, Package, User, Facebook, Instagram, Twitter, Home, ShoppingBag, Search, X, LogOut, Settings, Info, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { productsApi } from "@/lib/products"
import { Product } from "@/shared/types"

interface Category {
  name: string;
  href: string;
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Check if we're already on the products page
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      
      if (currentPath === '/products') {
        // We're already on products page, update the URL with search
        const params = new URLSearchParams(currentSearch);
        params.set('search', searchQuery.trim());
        params.delete('page'); // Reset to page 1 when searching
        router.push(`/products?${params.toString()}`, { scroll: false });
      } else {
        // Navigate from other pages to products page with search query
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`, { scroll: false });
      }
      setIsSearchOpen(false);
      setSearchQuery(''); // Clear search input after search
    } else {
      // If search is empty, just go to products page
      router.push('/products', { scroll: false });
      setIsSearchOpen(false);
    }
  }

  const categories: Category[] = [
    { name: "Cookware", href: "/products?category=cookware" },
    { name: "Appliances", href: "/products?category=appliances" },
    { name: "Utensils", href: "/products?category=utensils" },
    { name: "Storage", href: "/products?category=storage" },
    { name: "Home Essentials", href: "/products?category=home-essentials" }
  ]

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products?limit=100", icon: ShoppingBag },
  ]

  return (
    <>
      {/* Top Bar - Scrollable */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <Phone className="h-3 w-3 mr-1" />
            <span>Call us: 0769899432</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <Twitter className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - Fixed */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 bg-white",
          isScrolled ? "shadow-md" : "",
        )}
      >
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
                <span className="ml-2 text-xl font-semibold text-gray-800">WEGA Kitchenware</span>
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full flex gap-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  Search
                </Button>
              </form>
            </div>

            {/* All Icons */}
            <div className="flex items-center space-x-3">
              {/* Home */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Home className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Products */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/products?limit=100"
                      className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Products</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Track Order */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/track-order"
                      className="text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Package className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Track My Order</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Wishlist */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/wishlist"
                      className="text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
                    >
                      <Heart className="h-5 w-5" />
                      {wishlistItems.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {wishlistItems.length}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Cart */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/cart"
                      className="text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {cartCount}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Mobile Search Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                      {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSearchOpen ? 'Close Search' : 'Search'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <Link
                        href="/admin"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                      >
                        Admin Dashboard
                      </Link>
                    </div>
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

              {/* Admin Dashboard */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin"
                      className="text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Admin Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Mobile Search Bar (Conditional) */}
          {isSearchOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch} className="relative w-full flex gap-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  Search
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
