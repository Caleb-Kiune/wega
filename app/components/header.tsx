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
  Loader2,
  ChevronDown,
  Star,
  Truck,
  Shield,
  Clock,
  Clock as ClockIcon,
  X as XIcon,
  LogOut,
  Settings,
  UserCheck,
  UserPlus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { motion, AnimatePresence } from "framer-motion"
import WishlistModal from "@/components/wishlist-modal"
import MobileMenuModal from "@/components/mobile-menu-modal"

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  rating?: number;
  review_count?: number;
  images?: Array<{
    image_url: string;
    is_primary?: boolean;
  }>;
}


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()
  const wishlistItems = wishlist?.items || []

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load recent searches from localStorage:', error)
    }
  }, [])
    
  // Perform search with improved clearing logic
  useEffect(() => {
    const performSearch = async () => {
      // Clear results immediately when query is empty
      if (!searchQuery.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      // Only search if query has at least 2 characters
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      
      try {
        // Make API call to search the full database
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=6`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.products || [])
        } else {
          console.error('Search API call failed')
          setSearchResults([])
        }
      } catch (error) {
        console.error('Search API call error:', error)
        setSearchResults([])
      }
      
      setIsSearching(false)
    }

    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Enhanced clear search function
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
    // Focus back to input for better UX
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Handle keyboard shortcuts
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear search with Escape key
    if (e.key === 'Escape') {
      clearSearch()
      setShowResults(false)
      e.preventDefault()
    }
    
    // Clear search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      if (searchQuery) {
        clearSearch()
      } else {
        searchInputRef.current?.focus()
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecent = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5)
      setRecentSearches(newRecent)
      
      try {
        localStorage.setItem('recentSearches', JSON.stringify(newRecent))
      } catch (error) {
        console.error('Failed to save recent searches to localStorage:', error)
      }
      
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleSearchClick = (query: string) => {
    setSearchQuery(query)
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(newRecent)
    
    try {
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    } catch (error) {
      console.error('Failed to save recent searches to localStorage:', error)
    }
    
    window.location.href = `/products?search=${encodeURIComponent(query)}`
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem('recentSearches')
    } catch (error) {
      console.error('Failed to remove recent searches from localStorage:', error)
    }
  }

  const handleNavigationClick = () => {
    setIsAccountDropdownOpen(false)
    setIsMobileSearchOpen(false)
  }

  const handleSearchResultClick = () => {
    setShowResults(false)
    setSearchQuery("")
  }

  const handleAccountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAccountDropdownOpen(false)
    }
  }

  // Close search results and account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setIsSearchFocused(false)
      }
      
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false)
      }
      
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchOpen(false)
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
    { name: "Shop", href: "/products", icon: ShoppingBag },
  ]

  const trustSignals = [
    { icon: Truck, text: "Free Delivery", color: "text-green-600" },
    { icon: Shield, text: "Secure Payment", color: "text-blue-600" },
    { icon: Clock, text: "24/7 Support", color: "text-orange-600" },
  ]

  return (
    <>
      {/* Enhanced Top Bar with Trust Signals */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-1 sm:py-2 px-2 sm:px-4">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Contact Info */}
          <div className="flex items-center justify-center mb-2 sm:mb-0">
          </div>

            {/* Trust Signals */}
            <div className="hidden md:flex items-center space-x-6">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <signal.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{signal.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                      className="text-white hover:text-blue-300 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                      <Facebook className="h-4 w-4" />
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
                      className="text-white hover:text-pink-300 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                      <Instagram className="h-4 w-4" />
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
                      className="text-white hover:text-blue-300 transition-colors duration-200 hover:scale-110 transform p-2 -m-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                      <Twitter className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Twitter</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Modern Design */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 bg-white/95 backdrop-blur-md",
          isScrolled ? "shadow-xl py-2" : "py-4",
        )}
        style={{ 
          boxShadow: isScrolled 
            ? '0 6px 25px 0 rgba(0,0,0,0.12), 0 4px 12px 0 rgba(15, 23, 42, 0.15)' 
            : '0 4px 18px 0 rgba(15, 23, 42, 0.12)',
          background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          backgroundImage: isScrolled 
            ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))' 
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))'
        }}
      >
        {/* Enhanced shadow effect for depth */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-300/40 to-transparent"
          style={{
            background: isScrolled 
              ? 'linear-gradient(90deg, transparent 0%, rgba(203, 213, 225, 0.3) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(203, 213, 225, 0.25) 50%, transparent 100%)'
          }}
        />
        <div className="container-responsive">
          <div className="flex items-center justify-between pr-2 md:pr-0">
            {/* Mobile Menu Button - Left */}
            <div className="md:hidden">
              <MobileMenuModal>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl hover:bg-gray-100 transition-all duration-300"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </MobileMenuModal>
            </div>

            {/* Enhanced Logo - Left on Mobile, Center on Desktop */}
            <motion.div 
              className="flex-shrink-0 flex items-center justify-start md:justify-center flex-1 md:flex-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center group focus-visible:ring-2 focus-visible:ring-green-600 rounded-xl p-2 -m-2 transition-all duration-300 hover:scale-105">
                <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
                  alt="WEGA Kitchenware Logo"
                    width={100}
                    height={50}
                  className={cn(
                      "w-auto transition-all duration-300 drop-shadow-sm h-10 sm:h-10",
                      isScrolled ? "h-9 sm:h-8" : "h-10 sm:h-10"
                  )}
                  priority
                />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-green-500/10 rounded-lg blur-sm"></div>
                </div>
                <div className="ml-3">
                <span className={cn(
                    "font-bold text-gray-800 transition-all duration-300 hidden sm:block brand-name",
                    isScrolled ? "text-lg" : "text-xl"
                )}>
                  WEGA Kitchenware
                </span>
                <span className={cn(
                    "font-bold text-gray-800 transition-all duration-300 sm:hidden brand-name text-lg",
                  isScrolled ? "text-base" : "text-lg"
                )}>
                  WEGA
                </span>
                  <div className="text-xs text-green-600 font-medium hidden sm:block nav-text">Premium Kitchen Essentials</div>
                </div>
              </Link>
            </motion.div>

            {/* Enhanced Search Bar - Desktop Only */}
            <motion.div 
              className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-6 items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-full search-container" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative w-full">
                    {/* Search Input with Status Display - Green Style */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search our collection"
                        className={cn(
                          "rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 text-center placeholder:text-center px-4 py-3 pl-12 pr-4 w-full text-sm transition-all duration-300 shadow-sm",
                          isSearchFocused ? "border-green-500 ring-2 ring-green-200 shadow-md" : "hover:border-gray-300 hover:shadow-md"
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          setIsSearchFocused(true)
                          setShowResults(true)
                        }}
                        onBlur={() => setIsSearchFocused(false)}
                        onKeyDown={handleSearchKeyDown}
                        ref={searchInputRef}
                        aria-label="Search for products"
                      />
                      
                      {/* Search Icon on Left */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-400">
                        <Search className="h-5 w-5" />
                      </div>
                      
                      {/* Clear Button - Only show when typing */}
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Clear search"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
                
                                {/* Enhanced search results dropdown */}
                <AnimatePresence>
                {showResults && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 mt-2 max-h-96 overflow-y-auto"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >

                      
                      {isSearching ? (
                        <div className="p-6 text-center flex items-center justify-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                          <span className="text-gray-600 font-medium">Searching...</span>
                      </div>
                      ) : searchQuery.trim().length >= 2 && searchResults.length > 0 ? (
                        <div className="p-2">
                          {/* Search Results */}
                          <div className="mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2">Products {searchResults.length}</h3>
                            {searchResults.map((product, index) => (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                              >
                          <Link
                            href={`/products/${product.id}`}
                                  className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                            onClick={handleSearchResultClick}
                          >
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-100">
                            <img 
                              src={getImageUrl(product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url) || "/placeholder.svg"} 
                              alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                                  </div>
                            <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                                    <div className="text-sm text-green-600 font-medium">KES {product.price.toLocaleString()}</div>
                                  </div>
                                  {product.rating && product.rating > 0 && (
                                    <div className="flex items-center text-yellow-400">
                                      <Star className="h-4 w-4 fill-current" />
                                      <span className="text-xs text-gray-500 ml-1">
                                        {product.rating.toFixed(1)}
                                        {product.review_count && (
                                          <span className="text-gray-400"> ({product.review_count})</span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                          </Link>
                              </motion.div>
                        ))}
                            <div className="px-3 py-2 border-t border-gray-100">
                          <button
                            onClick={handleSearch}
                            className="w-full text-sm font-medium text-green-600 hover:text-green-700 transition-colors py-2"
                          >
                            View all results ({searchResults.length})
                          </button>
                            </div>
                          </div>
                        </div>
                      ) : searchQuery.trim().length >= 2 ? (
                        <div className="p-6 text-center text-gray-500">
                          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="font-medium">No products found</p>
                          <p className="text-sm">Try different keywords</p>
                      </div>
                    ) : searchQuery.trim().length > 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                            <span className="text-sm text-gray-600">Searching...</span>
                          </div>
                          <p className="text-xs text-gray-400">Type at least 2 characters</p>
                      </div>
                    ) : (
                        <div className="p-4">
                          {/* Recent Searches */}
                          {recentSearches.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                                <button
                                  onClick={clearRecentSearches}
                                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  Clear all
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {recentSearches.map((search, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSearchClick(search)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-full text-sm transition-all duration-200"
                                  >
                                    <ClockIcon className="h-3 w-3" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                      </div>
                    )}




                  </div>
                )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Enhanced Right side icons */}
            <motion.div 
              className="flex items-center space-x-2 md:space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Desktop Wishlist Icon */}
              <div className="hidden md:flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <WishlistModal>
                        <div
                          aria-label="Wishlist"
                          className="text-gray-600 hover:text-red-500 p-3 rounded-xl hover:bg-red-50 relative transition-all duration-300 focus-visible:ring-4 focus-visible:ring-red-200 min-h-[48px] min-w-[48px] flex items-center justify-center group cursor-pointer"
                        >
                          <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                          {wishlistItems.length > 0 && (
                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                              {wishlistItems.length}
                            </Badge>
                          )}
                        </div>
                      </WishlistModal>
                    </TooltipTrigger>
                    <TooltipContent>Wishlist</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Desktop Cart Icon */}
              <div className="hidden md:flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/cart"
                        aria-label="Cart"
                        className="text-gray-600 hover:text-orange-500 p-3 rounded-xl hover:bg-orange-50 relative transition-all duration-300 focus-visible:ring-4 focus-visible:ring-orange-200 min-h-[48px] min-w-[48px] flex items-center justify-center group"
                      >
                        <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                        {cartCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                            {cartCount}
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Cart</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Mobile Search Icon - Right */}
              <div className="md:hidden">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className="rounded-xl hover:bg-gray-100 transition-all duration-300"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                          </Button>
                        </div>

              {/* Mobile Wishlist Icon - Right */}
              <div className="md:hidden">
                <WishlistModal>
                  <div className="text-gray-600 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 relative transition-all duration-300 focus-visible:ring-4 focus-visible:ring-red-200 min-h-[40px] min-w-[40px] flex items-center justify-center group cursor-pointer">
                    <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    {wishlistItems.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full border-2 border-white">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </div>
                </WishlistModal>
              </div>

              {/* Mobile Cart Icon - Right */}
              <div className="md:hidden">
                <Link
                  href="/cart"
                  className="text-gray-600 hover:text-orange-500 p-2 rounded-xl hover:bg-orange-50 relative transition-all duration-300 focus-visible:ring-4 focus-visible:ring-orange-200 min-h-[40px] min-w-[40px] flex items-center justify-center group"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full border-2 border-white">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </div>

              {/* Desktop Account Dropdown */}
              <div className="hidden md:block relative" ref={accountDropdownRef}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsAccountDropdownOpen(!isAccountDropdownOpen)
                        }}
                        onKeyDown={handleAccountKeyDown}
                        className="text-gray-600 hover:text-green-600 p-3 rounded-xl hover:bg-green-50 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-green-200 min-h-[48px] min-w-[48px] flex items-center justify-center group"
                        aria-label="Account"
                        aria-expanded={isAccountDropdownOpen}
                      >
                        <User className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Account</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Account Dropdown */}
                <AnimatePresence>
                  {isAccountDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-2">
                        {/* Guest Menu Items */}
                        <div className="px-3 py-2">
                          <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Home</span>
                          </Link>
                          
                          <Link
                            href="/products"
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Shop</span>
                          </Link>
                          
                          <Link
                            href="/track-order"
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <Package className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Track Order</span>
                          </Link>
                          

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>



        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-gray-200 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              ref={mobileSearchRef}
            >
              <div className="container-responsive py-4">
                <div className="relative">
                  {/* Close Button - Top Right */}
                  <button
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <form onSubmit={handleSearch} className="relative">
                    <div className="relative w-full">
                      <Input
                        type="text"
                        placeholder="Search our collection"
                        className={cn(
                          "rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 px-4 py-3 pl-12 pr-4 w-full text-sm transition-all duration-300 shadow-sm",
                          isSearchFocused ? "border-green-500 ring-2 ring-green-200 shadow-md" : "hover:border-gray-300 hover:shadow-md"
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          setIsSearchFocused(true)
                          setShowResults(true)
                        }}
                        onBlur={() => setIsSearchFocused(false)}
                        onKeyDown={handleSearchKeyDown}
                        ref={searchInputRef}
                        aria-label="Search for products"
                      />
                      
                      {/* Search Icon on Left */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-400">
                        <Search className="h-5 w-5" />
                      </div>
                      
                      {/* Clear Button - Only show when typing */}
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Clear search"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                  
                  {/* Mobile Search Results */}
                  <AnimatePresence>
                    {showResults && (
                      <motion.div 
                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 mt-2 max-h-96 overflow-y-auto"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-2">
                          {/* Search Results */}
                          <div className="mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2">Products {searchResults.length}</h3>
                            {searchResults.map((product, index) => (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                              >
                                <Link
                                  href={`/products/${product.id}`}
                                  className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                                  onClick={handleSearchResultClick}
                                >
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-100">
                                    <img 
                                      src={getImageUrl(product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url) || "/placeholder.svg"} 
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                                    <div className="text-sm text-green-600 font-medium">KES {product.price.toLocaleString()}</div>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Recent Searches */}
                          {recentSearches.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
                                <button
                                  onClick={clearRecentSearches}
                                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  Clear all
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {recentSearches.map((search, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSearchClick(search)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-full text-sm transition-all duration-200"
                                  >
                                    <ClockIcon className="h-3 w-3" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
} 