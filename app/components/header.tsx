"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingCart, Heart, Phone, Package, User, Facebook, Instagram, Twitter, Home, ShoppingBag, Search, X, LogOut, Settings, Info, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { productsApi } from "@/lib/products"
import { Product } from "@/lib/types"
import { useDebounce } from "use-debounce"
import { getImageUrl } from "@/lib/products"
import { useSearchAnalytics } from "./search-analytics"

interface Category {
  name: string;
  href: string;
}

// Enhanced search function with ranking
const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  
  return products
    .map(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      const description = product.description?.toLowerCase() || '';
      const sku = product.sku?.toLowerCase() || '';
      
      // Exact name match (highest priority)
      if (name === searchTerm) score += 100;
      // Name starts with search term
      else if (name.startsWith(searchTerm)) score += 50;
      // Name contains search term
      else if (name.includes(searchTerm)) score += 30;
      // SKU exact match
      else if (sku === searchTerm) score += 40;
      // SKU contains search term
      else if (sku.includes(searchTerm)) score += 20;
      // Description contains search term
      else if (description.includes(searchTerm)) score += 10;
      
      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
};

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 150) // Reduced from 300ms
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { trackSearch } = useSearchAnalytics()
  
  // Enhanced search state
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Handle scroll effect - shrink header after 100px
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load all products for client-side search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productsApi.getAll({ limit: 200 }); // Load more products for better search
        setAllProducts(response.products);
      } catch (error) {
        console.error('Error loading products for search:', error);
      }
    };
    
    loadProducts();
  }, []);

  // Real-time search with enhanced logic
  useEffect(() => {
    if (debouncedSearchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const performSearch = async () => {
      setIsSearching(true);
      try {
        // Use client-side search for better performance
        const results = searchProducts(allProducts, debouncedSearchQuery);
        setSearchResults(results.slice(0, 5)); // Show top 5 results
        setShowResults(true);
        
        // Track search analytics
        trackSearch(debouncedSearchQuery, results.length);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchQuery, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (debouncedSearchQuery.trim()) {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      if (currentPath === '/products') {
        const params = new URLSearchParams(currentSearch);
        params.set('search', debouncedSearchQuery.trim());
        params.delete('page');
        router.push(`/products?${params.toString()}`, { scroll: false });
      } else {
        router.push(`/products?search=${encodeURIComponent(debouncedSearchQuery.trim())}`, { scroll: false });
      }
      setIsSearchOpen(false);
      setSearchQuery('');
      setShowResults(false);
      setIsMobileMenuOpen(false); // Close mobile menu after search
    } else {
      router.push('/products', { scroll: false });
      setIsSearchOpen(false);
      setShowResults(false);
      setIsMobileMenuOpen(false); // Close mobile menu after search
    }
  }

  const handleNavigationClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu when navigation item is clicked
  }

  const handleSearchResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

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
      {/* Top Bar - Mobile Optimized */}
      <div className="bg-green-600 text-white py-3 px-4 text-center text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center justify-center mb-2 sm:mb-0">
            <Phone className="h-4 w-4 mr-2" />
            <a 
              href="tel:0769899432" 
              className="underline hover:text-green-200 focus-visible:ring-2 focus-visible:ring-white transition-colors p-2 -m-2 rounded-lg" 
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
                    className="hover:text-green-200 transition-colors focus-visible:ring-2 focus-visible:ring-white rounded-full p-2 -m-2"
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
                    className="hover:text-green-200 transition-colors focus-visible:ring-2 focus-visible:ring-white rounded-full p-2 -m-2"
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
                    className="hover:text-green-200 transition-colors focus-visible:ring-2 focus-visible:ring-white rounded-full p-2 -m-2"
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - Mobile Optimized */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group focus-visible:ring-2 focus-visible:ring-green-600 rounded-full p-2 -m-2">
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
              <div className="relative w-full search-container">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="rounded-full border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus-visible:ring-2 focus-visible:ring-green-400 px-5 py-2 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                      aria-label="Search for products"
                    />
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 flex items-center justify-center border-0 focus-visible:ring-2 focus-visible:ring-green-400"
                      aria-label="Search products"
                    >
                      <Search className="h-6 w-6" />
                    </Button>
                  </div>
                </form>
                
                {/* Real-time search results dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
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
                              className="w-10 h-10 object-cover rounded mr-3"
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
                            className="w-full text-xs"
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
                        className="text-gray-600 hover:text-green-600 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                        className="text-gray-600 hover:text-green-600 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                        className="text-gray-600 hover:text-green-600 p-3 rounded-full hover:bg-gray-100 relative transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                        {wishlistItems.length > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
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
                        className="text-gray-600 hover:text-green-600 p-3 rounded-full hover:bg-gray-100 relative transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                        className="text-gray-600 hover:text-green-600 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Track My Order</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Mobile Search Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] p-3"
                      aria-label={isSearchOpen ? 'Close Search' : 'Search'}
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                      {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isSearchOpen ? 'Close Search' : 'Search'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Mobile Menu Button - Hamburger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px] p-3" 
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm focus:outline-none" aria-modal="true" role="dialog">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wega%20kitchenware%20website..jpg-WrrItNFb2yW5TLOQ4Ax5GY0Sv0YPew.jpeg"
                        alt="WEGA Kitchenware Logo"
                        width={80}
                        height={40}
                        className="h-8 w-auto"
                        priority
                      />
                      <span className="ml-2 text-lg font-semibold text-gray-800">WEGA</span>
                    </div>
                  </div>
                  {/* Enhanced Mobile Search in Drawer */}
                  <div className="mb-6">
                    <div className="relative search-container">
                      <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center gap-2 w-full">
                          <Input
                            type="text"
                            placeholder="Search products..."
                            className="rounded-full border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus-visible:ring-2 focus-visible:ring-green-400 px-5 py-2 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                            aria-label="Search for products"
                          />
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 flex items-center justify-center border-0 focus-visible:ring-2 focus-visible:ring-green-400"
                            aria-label="Search products"
                          >
                            <Search className="h-6 w-6" />
                          </Button>
                        </div>
                      </form>
                      
                      {/* Mobile search results dropdown */}
                      {showResults && (
                        <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-3 text-center flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Searching...</span>
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
                                    className="w-8 h-8 object-cover rounded mr-3"
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
                                  className="w-full text-xs"
                                >
                                  View all results
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 text-center text-gray-500 text-sm">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</h3>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleNavigationClick}
                          className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400"
                          aria-label={item.name}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Account</h3>
                      <Link 
                        href="/wishlist" 
                        onClick={handleNavigationClick}
                        className="flex items-center px-3 py-3 text-base text-gray-600 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 relative"
                        aria-label="Wishlist"
                      >
                        <Heart className="h-5 w-5 mr-3" />
                        Wishlist
                        {wishlistItems.length > 0 && (
                          <Badge className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                            {wishlistItems.length}
                          </Badge>
                        )}
                      </Link>
                      <Link 
                        href="/cart" 
                        onClick={handleNavigationClick}
                        className="flex items-center px-3 py-3 text-base text-gray-600 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 relative"
                        aria-label="Cart"
                      >
                        <ShoppingCart className="h-5 w-5 mr-3" />
                        Cart
                        {cartCount > 0 && (
                          <Badge className="ml-auto bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                            {cartCount}
                          </Badge>
                        )}
                      </Link>
                      <Link 
                        href="/track-order" 
                        onClick={handleNavigationClick}
                        className="flex items-center px-3 py-3 text-base text-gray-600 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400"
                        aria-label="Track Order"
                      >
                        <Package className="h-5 w-5 mr-3" />
                        Track Order
                      </Link>
                    </div>

                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {/* Enhanced Mobile Search Bar (Conditional) */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 mt-4">
              <div className="relative w-full search-container">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="rounded-full border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus-visible:ring-2 focus-visible:ring-green-400 px-4 py-3 w-full text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                      autoFocus
                      aria-label="Search for products"
                    />
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-3 flex items-center justify-center border-0 focus-visible:ring-2 focus-visible:ring-green-400 min-h-[44px] min-w-[44px]"
                      aria-label="Search products"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
                
                {/* Mobile search results dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Searching...</span>
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
                              className="w-8 h-8 object-cover rounded mr-3"
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
                            className="w-full text-xs"
                          >
                            View all results
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
} 