"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Clock as ClockIcon, Loader2, TrendingUp, History, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface Product {
  id: number
  name: string
  price: number
  image?: string
  rating?: number
  category?: string
}

interface SearchModalProps {
  children: React.ReactNode
  className?: string
}

export default function SearchModal({ children, className }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState(["Kitchen Knives", "Cutting Boards", "Cookware", "Bakeware", "Utensils", "Storage"])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse recent searches:', error)
      }
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (!isOpen) return

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim())
      } else {
        setShowResults(false)
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isOpen])

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    setShowResults(true)

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
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

  const clearSearch = () => {
    setSearchQuery("")
    setShowResults(false)
    setSearchResults([])
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
      addToRecentSearches(searchQuery.trim())
    }
  }

  const handleSearchClick = (query: string) => {
    setSearchQuery(query)
    performSearch(query)
    addToRecentSearches(query)
  }

  const addToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const handleSearchResultClick = () => {
    setIsOpen(false)
    setSearchQuery("")
    setShowResults(false)
    setSearchResults([])
  }

  const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith('http')) return url
    return url.startsWith('/') ? url : `/${url}`
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset search state when closing
      setSearchQuery("")
      setShowResults(false)
      setSearchResults([])
    } else {
      // Focus search input when opening
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[85vw] sm:w-[400px] md:w-[450px] lg:w-[500px] p-0 border-l border-gray-200 bg-white flex flex-col search-modal"
      >
        <SheetHeader className="search-modal-header flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex-1">
            <SheetTitle className="text-lg sm:text-xl font-semibold text-gray-900 font-display flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              Search Products
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600 mt-1">
              Search our collection of kitchenware and cooking essentials
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="search-modal-body">
          {/* Search Input Form */}
          <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
            <form onSubmit={handleSearch} className="relative">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-10 h-11 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </form>
          </div>

          {/* Search Results and Suggestions */}
          <div className="search-modal-content flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {showResults && (
                <motion.div
                  key="search-results"
                  className="p-3 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                      <span className="ml-2 text-gray-600">Searching...</span>
                    </div>
                  ) : searchQuery.trim().length >= 2 && searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700">
                          Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearchResultClick()}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          asChild
                        >
                          <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                            View All Results
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="grid gap-3">
                        {searchResults.slice(0, 5).map((product, index) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={handleSearchResultClick}
                            className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-green-700 transition-colors">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-green-600 text-sm">
                                  KES {product.price?.toLocaleString()}
                                </span>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-500">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-gray-600 font-medium mb-2">No products found</h3>
                      <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
                    </div>
                  ) : searchQuery.trim().length > 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">Type at least 2 characters to search</p>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 space-y-6">
                      {/* Popular Searches */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Popular Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearchClick(search)}
                              className="px-3 py-2 text-sm bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <History className="h-4 w-4 text-green-500" />
                              Recent Searches
                            </h3>
                            <button
                              onClick={clearRecentSearches}
                              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearchClick(search)}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                              >
                                <ClockIcon className="h-3 w-3 text-gray-400" />
                                {search}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Categories */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Star className="h-4 w-4 text-green-500" />
                          Quick Categories
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: "Kitchen Knives", href: "/category/knives", icon: "🔪" },
                            { name: "Cutting Boards", href: "/category/cutting-boards", icon: "🪵" },
                            { name: "Cookware", href: "/category/cookware", icon: "🍳" },
                            { name: "Bakeware", href: "/category/bakeware", icon: "🧁" }
                          ].map((category, index) => (
                            <Link
                              key={index}
                              href={category.href}
                              onClick={() => setIsOpen(false)}
                              className="p-3 text-center bg-gray-100 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-105 group"
                            >
                              <div className="text-2xl mb-1">{category.icon}</div>
                              <div className="text-xs font-medium text-gray-700 group-hover:text-green-700">
                                {category.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
