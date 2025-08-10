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
  UserPlus,
  Sparkles,
  ChevronRight,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { motion, AnimatePresence } from "framer-motion"
import WishlistModal from "@/components/wishlist-modal"
import CartModal from "@/components/cart-modal"
import MobileMenuModal from "@/components/mobile-menu-modal"
import SearchModal from "@/components/search-modal"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{
    text: string
    type: 'product' | 'category' | 'brand'
    count: number
    priority: number
  }>>([])
  const [showResults, setShowResults] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  
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

  // Global keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Focus the search input in the header
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
    
  // Debounced search with suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSearchSuggestions(searchQuery.trim())
        setShowSuggestions(true)
        setShowResults(false)
      } else if (searchQuery.trim().length === 0 && isSearchFocused && recentSearches.length > 0) {
        setShowSuggestions(true)
        setShowResults(false)
        setSearchSuggestions([])
      } else {
        setShowSuggestions(false)
        setShowResults(false)
      }
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isSearchFocused, recentSearches])

  // Debounced search results
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch()
      } else {
        setShowResults(false)
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const fetchSearchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/products/search-suggestions?q=${encodeURIComponent(query)}&limit=6`)
      if (response.ok) {
        const data = await response.json()
        if (data.detailed_suggestions) {
          setSearchSuggestions(data.detailed_suggestions)
        } else {
          setSearchSuggestions([])
        }
      } else {
        setSearchSuggestions([])
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSearchSuggestions([])
    }
  }

  const performSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return

    setIsSearching(true)
    setShowResults(true)
    setShowSuggestions(false)

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=6`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.products || [])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = (suggestion: { text: string; type: string; count: number; priority: number }) => {
    const query = suggestion.text.replace(' (Category)', '').replace(' (Brand)', '')
    setSearchQuery(query)
    // Navigate to products page with search query (matching desktop behavior)
    window.location.href = `/products?search=${encodeURIComponent(query)}`
  }

  // Enhanced clear search function
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowSuggestions(false)
    setShowResults(false)
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
  }

  const handleSearchResultClick = () => {
    setShowResults(false)
    setShowSuggestions(false)
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
        setShowSuggestions(false)
        setIsSearchFocused(false)
      }
      
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false)
      }
      
      // Removed mobile search functionality - no longer needed
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getImageUrl = (url?: string) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`
  }

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query || query.length < 2) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold rounded px-1">
          {part}
        </mark>
      ) : part
    )
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
            <div className="md:hidden flex items-center gap-2">
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
                          // Only show suggestions if there's a query or if we have recent searches
                          if (searchQuery.trim().length >= 2) {
                            setShowSuggestions(true)
                            setShowResults(false)
                          } else if (searchQuery.trim().length === 0 && recentSearches.length > 0) {
                            setShowSuggestions(true)
                            setShowResults(false)
                          }
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
                  {showSuggestions && !showResults && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 mt-2 max-h-96 overflow-y-auto md:max-w-none max-w-[calc(100vw-2rem)]"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {searchQuery.trim().length >= 2 && searchSuggestions.length > 0 ? (
                        <div className="p-2">
                          {/* Search Suggestions */}
                          <div className="mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-green-500" />
                              Suggestions ({searchSuggestions.length})
                            </h3>
                            {searchSuggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                              >
                                <button
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="w-full text-left flex items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                                      {highlightText(suggestion.text, searchQuery)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} • {suggestion.count} items
                                    </div>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : searchQuery.trim().length === 0 ? (
                        <div className="p-4 space-y-4">
                          {/* Recent Searches */}
                          {recentSearches.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-green-500" />
                                  Recent Searches
                                </h3>
                                <button
                                  onClick={clearRecentSearches}
                                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  Clear All
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {recentSearches.map((search, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSearchClick(search)}
                                    className="p-2 text-center bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium flex items-center gap-2 justify-center"
                                  >
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">Type at least 2 characters to see suggestions</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {showResults && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 mt-2 max-h-96 overflow-y-auto md:max-w-none max-w-[calc(100vw-2rem)]"
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
                            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2">Products ({searchResults.length})</h3>
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
                                    <div className="font-semibold text-gray-900 truncate">
                                      {highlightText(product.name, searchQuery)}
                                    </div>
                                    <div className="text-sm text-green-600 font-medium">KES {product.price.toLocaleString()}</div>
                                    {product.category && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {highlightText(product.category, searchQuery)}
                                      </div>
                                    )}
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
                                View All Results
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : searchQuery.trim().length >= 2 ? (
                        <div className="text-center py-8">
                          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-gray-600 font-medium mb-2">No products found</h3>
                          <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
                        </div>
                      ) : null}
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
                <CartModal>
                  <div className="text-gray-600 hover:text-orange-500 p-3 rounded-xl hover:bg-orange-50 relative transition-all duration-300 focus-visible:ring-4 focus-visible:ring-orange-200 min-h-[48px] min-w-[48px] flex items-center justify-center group cursor-pointer">
                    <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                        {cartCount}
                      </Badge>
                    )}
                  </div>
                </CartModal>
              </div>

              {/* Mobile Search Icon - Right */}
              <div className="md:hidden">
                <SearchModal>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl hover:bg-gray-100 transition-all duration-300"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </SearchModal>
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

              {/* Mobile Account & Cart Icons - Right */}
              <div className="md:hidden flex items-center gap-2">
                {/* Mobile Account Button */}
                <Link
                  href="/customer/login"
                  className="text-gray-600 hover:text-green-600 p-2 rounded-xl hover:bg-green-50 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-green-200 min-h-[40px] min-w-[40px] flex items-center justify-center group"
                  aria-label="Account"
                >
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                
                {/* Mobile Cart Icon */}
                <CartModal>
                  <div className="text-gray-600 hover:text-orange-500 p-2 rounded-xl hover:bg-orange-50 relative transition-all duration-300 focus-visible:ring-4 focus-visible:ring-orange-200 min-h-[40px] min-w-[40px] flex items-center justify-center group cursor-pointer">
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full border-2 border-white">
                        {cartCount}
                      </Badge>
                    )}
                  </div>
                </CartModal>
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
                          
                          {/* Divider */}
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          {/* Customer Authentication Links */}
                          <Link
                            href="/customer/login"
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <UserCheck className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Sign In</span>
                          </Link>
                          
                          <Link
                            href="/customer/register"
                            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Create Account</span>
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



        
      </header>
    </>
  )
} 