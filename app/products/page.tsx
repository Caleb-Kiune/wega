"use client"

import { useState, useEffect } from 'react';
import { useProducts } from '@/lib/hooks/use-products';
import ProductFilters from '@/components/ProductFilters';
import ProductCard from '@/components/product-card';
import { ProductsLoading } from '@/components/products-loading';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductsParams } from '@/lib/products';
import { Search, Grid3X3, List, Filter, X, Sparkles, Star, TrendingUp, SlidersHorizontal, SortAsc, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export interface ProductsFilters extends Omit<ProductsParams, 'page' | 'limit'> {
  page: number;
  limit: number;
  search?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  const [filters, setFilters] = useState<ProductsFilters>({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 30,
    categories: searchParams.getAll('categories[]'),
    brands: searchParams.getAll('brands[]'),
    min_price: Number(searchParams.get('min_price')) || undefined,
    max_price: Number(searchParams.get('max_price')) || undefined,
    is_featured: searchParams.get('is_featured') === 'true',
    is_new: searchParams.get('is_new') === 'true',
    is_sale: searchParams.get('is_sale') === 'true',
    search: searchParams.get('search') || undefined,
  });

  // Handle search parameter changes from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: urlSearch || undefined, page: 1 }));
    }
  }, [searchParams.get('search')]);

  const { products, loading, error, totalPages, currentPage } = useProducts(filters);

  const handleFiltersChange = (newFilters: Partial<ProductsFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    if (updatedFilters.page > 1) params.set('page', updatedFilters.page.toString());
    if (updatedFilters.limit !== 30) params.set('limit', updatedFilters.limit.toString());
    if (updatedFilters.categories?.length) {
      updatedFilters.categories.forEach(category => params.append('categories[]', category));
    }
    if (updatedFilters.brands?.length) {
      updatedFilters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (updatedFilters.min_price) params.set('min_price', updatedFilters.min_price.toString());
    if (updatedFilters.max_price) params.set('max_price', updatedFilters.max_price.toString());
    if (updatedFilters.is_featured) params.set('is_featured', 'true');
    if (updatedFilters.is_new) params.set('is_new', 'true');
    if (updatedFilters.is_sale) params.set('is_sale', 'true');
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    // Update URL with new page
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (filters.limit !== 30) params.set('limit', filters.limit.toString());
    if (filters.categories?.length) {
      filters.categories.forEach(category => params.append('categories[]', category));
    }
    if (filters.brands?.length) {
      filters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    if (filters.is_featured) params.set('is_featured', 'true');
    if (filters.is_new) params.set('is_new', 'true');
    if (filters.is_sale) params.set('is_sale', 'true');
    if (filters.search) params.set('search', filters.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleClearSearch = () => {
    const updatedFilters = { ...filters, search: undefined, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL without search parameter
    const params = new URLSearchParams();
    if (updatedFilters.limit !== 30) params.set('limit', updatedFilters.limit.toString());
    if (updatedFilters.categories?.length) {
      updatedFilters.categories.forEach(category => params.append('categories[]', category));
    }
    if (updatedFilters.brands?.length) {
      updatedFilters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (updatedFilters.min_price) params.set('min_price', updatedFilters.min_price.toString());
    if (updatedFilters.max_price) params.set('max_price', updatedFilters.max_price.toString());
    if (updatedFilters.is_featured) params.set('is_featured', 'true');
    if (updatedFilters.is_new) params.set('is_new', 'true');
    if (updatedFilters.is_sale) params.set('is_sale', 'true');
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Enhanced search handling with better UX
  const handleSearchChange = (newSearch: string) => {
    const updatedFilters = { ...filters, search: newSearch || undefined, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL with new search
    const params = new URLSearchParams();
    if (updatedFilters.page > 1) params.set('page', updatedFilters.page.toString());
    if (updatedFilters.limit !== 30) params.set('limit', updatedFilters.limit.toString());
    if (updatedFilters.categories?.length) {
      updatedFilters.categories.forEach(category => params.append('categories[]', category));
    }
    if (updatedFilters.brands?.length) {
      updatedFilters.brands.forEach(brand => params.append('brands[]', brand));
    }
    if (updatedFilters.min_price) params.set('min_price', updatedFilters.min_price.toString());
    if (updatedFilters.max_price) params.set('max_price', updatedFilters.max_price.toString());
    if (updatedFilters.is_featured) params.set('is_featured', 'true');
    if (updatedFilters.is_new) params.set('is_new', 'true');
    if (updatedFilters.is_sale) params.set('is_sale', 'true');
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.min_price || filters.max_price) count += 1;
    if (filters.is_featured) count += 1;
    if (filters.is_new) count += 1;
    if (filters.is_sale) count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile-Optimized Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight">
              Premium Kitchenware Collection
            </h1>
            <p className="text-base sm:text-lg text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Discover handcrafted kitchen essentials that transform your cooking experience. 
              From professional-grade cookware to elegant serving pieces.
            </p>
            

          </motion.div>
        </div>
      </div>

      {/* Main Content - No permanent sidebar */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Products Section (full width) */}
          <div className="flex-1">
            {/* Header Controls */}
            <div className="mb-6 sm:mb-8">
              {/* Results, Search Status, and Active Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="text-sm text-gray-600">
                    {!loading && !error && (
                      <>
                        <span className="font-semibold text-gray-900">{products.length}</span> products
                      </>
                    )}
                  </div>
                  
                  {/* Search Status - Integrated with Product Controls */}
                  {filters.search && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                      <Search className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-700">
                        Search: <span className="font-semibold">"{filters.search}"</span>
                      </span>
                      <button
                        onClick={handleClearSearch}
                        disabled={loading}
                        className="text-green-500 hover:text-green-700 transition-colors p-0.5 rounded-full hover:bg-green-100 disabled:opacity-50"
                        aria-label="Clear search"
                      >
                        {loading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Active Filters Badge */}
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                {/* Filter, Sort, and View Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Filter Sheet - always available */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-10 px-3 sm:px-4 bg-white border-gray-200 hover:bg-gray-50"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0">
                      <SheetHeader className="px-6 py-4 border-b border-gray-200">
                        <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                        <ProductFilters 
                          filters={filters} 
                          onFiltersChange={handleFiltersChange} 
                          loading={loading} 
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  {/* Sort Menu */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center gap-2 h-10 px-3 sm:px-4 bg-white border-gray-200 hover:bg-gray-50"
                    >
                      <SortAsc className="h-4 w-4" />
                      <span className="hidden sm:inline">Sort</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                    </Button>
                    <AnimatePresence>
                      {showSortMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                        >
                          <div className="py-2">
                            {[
                              { value: 'featured', label: 'Featured' },
                              { value: 'newest', label: 'Newest' },
                              { value: 'price-low', label: 'Price: Low to High' },
                              { value: 'price-high', label: 'Price: High to Low' },
                              { value: 'name', label: 'Name: A to Z' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowSortMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                  sortBy === option.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0 rounded-md"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0 rounded-md"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Products Grid/List and Pagination remain unchanged */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductsLoading />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 px-4"
                >
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                    <div className="text-red-600 mb-4">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                    <p className="text-gray-600">{error.message}</p>
                  </div>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 px-4"
                >
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-6">
                      <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {filters.search ? 'No products found' : 'No products available'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filters.search 
                        ? `No products match your search for "${filters.search}". Try adjusting your search terms.`
                        : 'Try adjusting your filters or browse our complete collection.'
                      }
                    </p>
                    {filters.search && (
                      <Button
                        variant="outline"
                        onClick={handleClearSearch}
                        className="text-green-700 border-green-300 hover:bg-green-50"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={`
                    ${viewMode === 'grid' 
                      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6' 
                      : 'space-y-3 sm:space-y-4'
                    }
                  `}>
                    <AnimatePresence>
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                          className={viewMode === 'list' ? 'w-full' : ''}
                        >
                          <ProductCard product={product} viewMode={viewMode} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Mobile-Optimized Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 sm:mt-12"
                    >
                      <div className="flex flex-col items-center gap-4 sm:gap-6">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </div>
                        <nav className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(1)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm"
                          >
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm"
                          >
                            Prev
                          </Button>
                          
                          {/* Mobile-Optimized Page Numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter(page => {
                                return page === 1 || 
                                       page === totalPages || 
                                       Math.abs(currentPage - page) <= 1;
                              })
                              .map((page, index, array) => {
                                const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                                return (
                                  <div key={page} className="flex items-center">
                                    {showEllipsis && (
                                      <span className="px-1 sm:px-2 text-gray-400 text-xs">...</span>
                                    )}
                                    <Button
                                      variant={currentPage === page ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => handlePageChange(page)}
                                      className={`min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm ${
                                        currentPage === page 
                                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                                          : ''
                                      }`}
                                    >
                                      {page}
                                    </Button>
                                  </div>
                                );
                              })}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm"
                          >
                            Next
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm"
                          >
                            Last
                          </Button>
                        </nav>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
