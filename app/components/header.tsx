"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  Package, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"

interface Product {
  id: string;
  name: string;
  price: number;
  images?: Array<{
    image_url: string;
    is_primary?: boolean;
  }>;
}



const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.name.toLowerCase().split(' ').some(word => word.startsWith(searchTerm))
  ).slice(0, 5) // Limit to 5 results for dropdown
}



export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  
  const { cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load products for search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=100')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Failed to load products for search:', error)
      }
    }
    loadProducts()
  }, [])
    
  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      const results = searchProducts(products, searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }

    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, products])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleNavigationClick = () => {
    setIsMobileMenuOpen(false)
  }

  const handleSearchResultClick = () => {
    setShowResults(false)
    setSearchQuery("")
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getImageUrl = (url?: string) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`
  }

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products?limit=100", icon: ShoppingBag },
  ]

  return (
    <>
      {/* Top Bar - Mobile Optimized */}
      <div className="bg-green-600 text-white py-3 px-4 text-center text-sm">
        <div className="container-responsive flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center justify-center mb-2 sm:mb-0">
            <Phone className="h-4 w-4 mr-2" />
            <a 
              href="tel:0769899432" 
              className="underline hover:text-green-200 focus-visible:ring-2 focus-visible:ring-white transition-colors p-2 -m-2 rounded-2xl" 
              aria-label="Call us: 0769899432"
            >
              0769899432
            </a>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                    className="text-white hover:text-blue-500 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-2xl min-h-[44px] min-w-[44px] flex items-center justify-center bg-green-700 hover:bg-green-600"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Facebook</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram" 
                    className="text-white hover:text-pink-500 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-2xl min-h-[44px] min-w-[44px] flex items-center justify-center bg-green-700 hover:bg-green-600"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Instagram</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Twitter" 
                    className="text-white hover:text-blue-400 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-2xl min-h-[44px] min-w-[44px] flex items-center justify-center bg-green-700 hover:bg-green-600"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Twitter</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Header - Mobile Optimized */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 bg-white border-b border-gray-100",
          isScrolled ? "shadow-lg py-2" : "py-3 sm:py-4",
        )}
        style={{ boxShadow: isScrolled ? '0 2px 12px 0 rgba(0,0,0,0.08)' : undefined }}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between">
            {/* Logo - Mobile Optimized */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group focus-visible:ring-2 focus-visible:ring-green-600 rounded-2xl p-2 -m-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
                  alt="WEGA Kitchenware Logo"
                  width={100}
                  height={50}
                  className={cn(
                    "w-auto transition-all duration-300",
                    isScrolled ? "h-7 sm:h-8" : "h-8 sm:h-10"
                  )}
                  priority
                />
                <span className={cn(
                  "ml-2 font-semibold text-gray-800 transition-all duration-300 hidden sm:block",
                  isScrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                )}>
                  WEGA Kitchenware
                </span>
                <span className={cn(
                  "ml-2 font-semibold text-gray-800 transition-all duration-300 sm:hidden",
                  isScrolled ? "text-sm" : "text-base"
                )}>
                  WEGA
                </span>
              </Link>
            </div>

            {/* Enhanced Search Bar (Desktop) - with real-time results */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 items-center">
              <div className="relative w-full search-container" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus-visible:ring-2 focus-visible:ring-green-400 px-5 py-3 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                      aria-label="Search for products"
                    />
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-4 py-3 flex items-center justify-center border-0 focus-visible:ring-2 focus-visible:ring-green-400"
                      aria-label="Search products"
                    >
                      <Search className="h-6 w-6" />
                    </Button>
                  </div>
                </form>
                
                {/* Real-time search results dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-2xl shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        {searchResults.map(product => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={handleSearchResultClick}
                          >
                            <img 
                              src={getImageUrl(product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url) || "/placeholder.svg"} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-2xl mr-3"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{product.name}</div>
                              <div className="text-xs text-gray-500">KES {product.price.toLocaleString()}</div>
                            </div>
                          </Link>
                        ))}
                        <div className="p-2 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSearch}
                            className="w-full text-xs rounded-2xl"
                          >
                            View all results
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side icons - Mobile Optimized */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Desktop Navigation Icons */}
              <div className="hidden md:flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        aria-label="Home"
                        className="text-gray-600 hover:text-green-600 p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Home className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Home</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/products?limit=100"
                        aria-label="Products"
                        className="text-gray-600 hover:text-green-600 p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Products</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/wishlist"
                        aria-label="Wishlist"
                        className="text-gray-600 hover:text-green-600 p-3 rounded-2xl hover:bg-gray-100 relative transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                        {wishlistItems.length > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                            {wishlistItems.length}
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Wishlist</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/cart"
                        aria-label="Cart"
                        className="text-gray-600 hover:text-green-600 p-3 rounded-2xl hover:bg-gray-100 relative transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                        {cartCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                            {cartCount}
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Cart</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/track-order"
                        aria-label="Track My Order"
                        className="text-gray-600 hover:text-green-600 p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Track My Order</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Mobile Search Button */}
              <div className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-2xl"
                  aria-label="Toggle mobile menu"
                >
                  <Search className="h-5 w-5" />
                    </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-2xl"
                  aria-label="Toggle mobile menu"
                  >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                          </Button>
                        </div>

              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                                <Link
                        href="/account"
                        aria-label="Account"
                        className="text-gray-600 hover:text-green-600 p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <User className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Account</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                  </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container-responsive py-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus-visible:ring-2 focus-visible:ring-green-400 px-4 py-3 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search for products"
                    />
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-4 py-3 flex items-center justify-center border-0 focus-visible:ring-2 focus-visible:ring-green-400"
                      aria-label="Search products"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleNavigationClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-2xl transition-colors duration-200"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/wishlist"
                    onClick={handleNavigationClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-2xl transition-colors duration-200"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                    {wishlistItems.length > 0 && (
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={handleNavigationClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-2xl transition-colors duration-200"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </div>



                {/* Mobile Account Link */}
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    href="/account"
                    onClick={handleNavigationClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-2xl transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </Link>
                </div>
              </nav>
              </div>
            </div>
          )}
      </header>
    </>
  )
} 