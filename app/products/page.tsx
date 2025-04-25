"use client"

import { Suspense, useState, use } from "react"
import Link from "next/link"
import { Grid3X3, List, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ProductsLoading from "@/components/products-loading"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"

// Mock products data
const products = [
  {
    id: 1,
    name: "Premium Non-Stick Frying Pan",
    price: 2499,
    rating: 4.8,
    reviewCount: 124,
    image: "/images/kitchenware1.jpeg",
    isNew: true,
    isSale: false,
    category: "Cookware",
    brand: "WEGA",
  },
  {
    id: 2,
    name: "Stainless Steel Cooking Pot Set",
    price: 5999,
    originalPrice: 7499,
    rating: 4.9,
    reviewCount: 86,
    image: "/images/appliances1.jpeg",
    isNew: false,
    isSale: true,
    category: "Cookware",
    brand: "KitchenAid",
  },
  {
    id: 3,
    name: "Electric Coffee Maker",
    price: 3499,
    rating: 4.7,
    reviewCount: 52,
    image: "/images/appliances2.jpeg",
    isNew: false,
    isSale: false,
    category: "Appliances",
    brand: "Cuisinart",
  },
  {
    id: 4,
    name: "Kitchen Utensil Set",
    price: 1899,
    originalPrice: 2499,
    rating: 4.6,
    reviewCount: 38,
    image: "/images/tableware1.jpeg",
    isNew: true,
    isSale: true,
    category: "Utensils",
    brand: "WEGA",
  },
  {
    id: 5,
    name: "Glass Food Storage Containers (Set of 5)",
    price: 1299,
    rating: 4.5,
    reviewCount: 42,
    image: "/images/homeessentials1.jpeg",
    isNew: true,
    category: "Storage Solutions",
    brand: "Pyrex",
  },
  {
    id: 6,
    name: "Ceramic Dinner Plates (Set of 4)",
    price: 1899,
    rating: 4.7,
    reviewCount: 29,
    image: "/images/homeessentials2.jpeg",
    isNew: false,
    category: "Home Essentials",
    brand: "WEGA",
  },
  {
    id: 7,
    name: "Professional Chef Knife",
    price: 2999,
    rating: 4.9,
    reviewCount: 67,
    image: "/images/kitchenware1.jpeg",
    isNew: false,
    category: "Utensils",
    brand: "WEGA",
  },
  {
    id: 8,
    name: "Electric Hand Mixer",
    price: 2499,
    originalPrice: 2999,
    rating: 4.6,
    reviewCount: 31,
    image: "/images/appliances2.jpeg",
    isNew: false,
    isSale: true,
    category: "Appliances",
    brand: "Tefal",
  },
]

export default function ProductsPage({
  searchParams,
}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("featured")
  const searchQuery = use(searchParams).search as string

  // Mock categories for filter
  const categories = [
    { id: "cookware", name: "Cookware" },
    { id: "utensils", name: "Utensils" },
    { id: "appliances", name: "Appliances" },
    { id: "home-essentials", name: "Home Essentials" },
    { id: "storage", name: "Storage Solutions" },
  ]

  // Mock brands for filter
  const brands = [
    { id: "wega", name: "WEGA" },
    { id: "kitchenaid", name: "KitchenAid" },
    { id: "cuisinart", name: "Cuisinart" },
    { id: "tefal", name: "Tefal" },
    { id: "pyrex", name: "Pyrex" },
  ]

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setPriceRange([value, priceRange[1]])
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 10000
    setPriceRange([priceRange[0], value])
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([500, 5000])
  }

  // Filter products based on selected filters and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category.toLowerCase())
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    // Add search filter
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesBrand && matchesPrice && matchesSearch
  })

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      case "rating":
        return b.rating - a.rating
      default: // featured
        return 0
    }
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Products</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-600 hover:text-green-700"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-600 cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={handleMinPriceChange}
                  className="w-24"
                  min={0}
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={handleMaxPriceChange}
                  className="w-24"
                  min={priceRange[0]}
                />
              </div>
              <Slider 
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                min={0} 
                max={10000} 
                step={100}
                className="mt-2"
              />
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center">
                    <Checkbox 
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => handleBrandChange(brand.id)}
                    />
                    <label htmlFor={`brand-${brand.id}`} className="ml-2 text-sm text-gray-600 cursor-pointer">
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Apply Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700"
                        onClick={clearFilters}
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox 
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryChange(category.id)}
                            />
                            <label
                              htmlFor={`mobile-category-${category.id}`}
                              className="ml-2 text-sm text-gray-600 cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={handleMinPriceChange}
                          className="w-24"
                          min={0}
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={handleMaxPriceChange}
                          className="w-24"
                          min={priceRange[0]}
                        />
                      </div>
                      <Slider 
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        min={0} 
                        max={10000} 
                        step={100}
                        className="mt-2"
                      />
                    </div>

                    {/* Brands */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3">Brands</h3>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <div key={brand.id} className="flex items-center">
                            <Checkbox 
                              id={`mobile-brand-${brand.id}`}
                              checked={selectedBrands.includes(brand.id)}
                              onCheckedChange={() => handleBrandChange(brand.id)}
                            />
                            <label
                              htmlFor={`mobile-brand-${brand.id}`}
                              className="ml-2 text-sm text-gray-600 cursor-pointer"
                            >
                              {brand.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Filters Button */}
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Sort and View Options */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-600 mr-3">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">View:</span>
                <div className="flex border rounded-md overflow-hidden">
                  <button className="p-2 bg-green-600 text-white">
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white text-gray-600 hover:bg-gray-100">
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <Suspense fallback={<ProductsLoading />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Suspense>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-green-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
