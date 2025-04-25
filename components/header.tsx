"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingCart, User, Heart, Search, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { cn } from "@/lib/utils"

// Mock products data for search
const products = [
  {
    id: "1",
    name: "Premium Non-Stick Frying Pan",
    price: 2499,
    image: "/images/kitchenware1.jpeg",
    category: "Cookware",
  },
  {
    id: "2",
    name: "Stainless Steel Cooking Pot Set",
    price: 5999,
    image: "/images/appliances1.jpeg",
    category: "Cookware",
  },
  {
    id: "3",
    name: "Electric Coffee Maker",
    price: 3499,
    image: "/images/appliances2.jpeg",
    category: "Appliances",
  },
  {
    id: "4",
    name: "Kitchen Utensil Set",
    price: 1899,
    image: "/images/tableware1.jpeg",
    category: "Utensils",
  },
  {
    id: "5",
    name: "Glass Food Storage Containers (Set of 5)",
    price: 1299,
    image: "/images/homeessentials1.jpeg",
    category: "Storage Solutions",
  },
  {
    id: "6",
    name: "Ceramic Dinner Plates (Set of 4)",
    price: 1899,
    image: "/images/homeessentials2.jpeg",
    category: "Home Essentials",
  },
  {
    id: "7",
    name: "Professional Chef Knife",
    price: 2999,
    image: "/images/kitchenware1.jpeg",
    category: "Utensils",
  },
  {
    id: "8",
    name: "Electric Hand Mixer",
    price: 2499,
    image: "/images/appliances2.jpeg",
    category: "Appliances",
  },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { cartCount } = useCart()

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim()) {
      // Filter products based on search query
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setSearchQuery("")
    setShowResults(false)
    setIsSearchOpen(false)
  }

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
                            src={product.image}
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
                            src={product.image}
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
