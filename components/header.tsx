"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingCart, Heart, Search, X, Phone, Package, User, Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { productsApi } from "@/app/lib/api/products"
import { Product } from "@/app/lib/api/products"

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
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
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

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setShowResults(false)
      setIsSearchOpen(false)
    }
  }

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim()) {
      try {
        // Fetch products from API with search query
        const response = await productsApi.getAll({ search: query })
        setSearchResults(response.products)
        setShowResults(true)
      } catch (error) {
        console.error('Error searching products:', error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleResultClick = (productId: number) => {
    router.push(`/products/${productId}`)
    setShowResults(false)
    setIsSearchOpen(false)
  }

  const categories: Category[] = [
    { name: "Cookware", href: "/products?category=cookware" },
    { name: "Appliances", href: "/products?category=appliances" },
    { name: "Utensils", href: "/products?category=utensils" },
    { name: "Storage", href: "/products?category=storage" },
    { name: "Home Essentials", href: "/products?category=home-essentials" }
  ]

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products?limit=100" },
    { name: "About", href: "/about" },
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
              <div ref={searchRef} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleResultClick(product.id)}
                      >
                        <div className="relative w-12 h-12 mr-3">
                          <Image
                            src={product.images[0]?.image_url || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">KES {product.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-green-600"
              >
                {item.name}
              </Link>
            ))}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/track-order"
                    className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <Package className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track My Order</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <Phone className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Contact Us</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

            {/* Track Order (Mobile) */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/track-order"
                    className="md:hidden text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <Package className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track My Order</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Contact (Mobile) */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/contact"
                    className="md:hidden text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <Phone className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Contact Us</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Wishlist */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/wishlist"
                    className="hidden sm:flex text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 relative"
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
                    className="text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 relative"
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
          </div>
        </div>

        {/* Mobile Search Bar (Conditional) */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative w-full flex gap-2">
              <div ref={searchRef} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                  autoFocus
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleResultClick(product.id)}
                      >
                        <div className="relative w-12 h-12 mr-3">
                          <Image
                            src={product.images[0]?.image_url || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">KES {product.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                Search
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
