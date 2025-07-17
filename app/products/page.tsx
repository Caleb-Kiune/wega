"use client"

import { useState, useEffect } from 'react';
import { useProducts } from '@/lib/hooks/use-products';
import ProductFilters from '@/components/ProductFilters';
import ProductCard from '@/components/product-card';
import { ProductsLoading } from '@/components/products-loading';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductsParams } from '@/lib/products';
import { Search, Grid3X3, List, Filter, X, Sparkles, Star, TrendingUp, SlidersHorizontal, SortAsc, ChevronDown, Loader2, Tag, Building2, DollarSign } from 'lucide-react';
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

  // Get all active filters with their details for individual removal
  const getActiveFilters = () => {
    const activeFilters: Array<{
      id: string;
      label: string;
      type: 'category' | 'brand' | 'price' | 'featured' | 'new' | 'sale';
      value: string;
    }> = [];

    // Categories
    if (filters.categories?.length) {
      filters.categories.forEach(category => {
        activeFilters.push({
          id: `category-${category}`,
          label: category,
          type: 'category',
          value: category
        });
      });
    }

    // Brands
    if (filters.brands?.length) {
      filters.brands.forEach(brand => {
        activeFilters.push({
          id: `brand-${brand}`,
          label: brand,
          type: 'brand',
          value: brand
        });
      });
    }

    // Price range
    if (filters.min_price || filters.max_price) {
      const minPrice = filters.min_price || 0;
      const maxPrice = filters.max_price || 50000;
      activeFilters.push({
        id: 'price-range',
        label: `KES ${minPrice.toLocaleString()} - KES ${maxPrice.toLocaleString()}`,
        type: 'price',
        value: 'price-range'
      });
    }

    // Featured
    if (filters.is_featured) {
      activeFilters.push({
        id: 'featured',
        label: 'Featured Products',
        type: 'featured',
        value: 'featured'
      });
    }

    // New
    if (filters.is_new) {
      activeFilters.push({
        id: 'new',
        label: 'New Arrivals',
        type: 'new',
        value: 'new'
      });
    }

    // Sale
    if (filters.is_sale) {
      activeFilters.push({
        id: 'sale',
        label: 'On Sale',
        type: 'sale',
        value: 'sale'
      });
    }

    return activeFilters;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const activeFilters = getActiveFilters();

  // Handle individual filter removal with toast feedback
  const handleRemoveFilter = (filterType: string, filterValue: string) => {
    let filterLabel = '';
    
    switch (filterType) {
      case 'category':
        filterLabel = filterValue;
        const updatedCategories = filters.categories?.filter(cat => cat !== filterValue);
        handleFiltersChange({
          ...filters,
          categories: updatedCategories?.length ? updatedCategories : undefined,
          page: 1
        });
        break;
      
      case 'brand':
        filterLabel = filterValue;
        const updatedBrands = filters.brands?.filter(brand => brand !== filterValue);
        handleFiltersChange({
          ...filters,
          brands: updatedBrands?.length ? updatedBrands : undefined,
          page: 1
        });
        break;
      
      case 'price':
        filterLabel = 'Price range';
        handleFiltersChange({
          ...filters,
          min_price: undefined,
          max_price: undefined,
          page: 1
        });
        break;
      
      case 'featured':
        filterLabel = 'Featured Products';
        handleFiltersChange({
          ...filters,
          is_featured: undefined,
          page: 1
        });
        break;
      
      case 'new':
        filterLabel = 'New Arrivals';
        handleFiltersChange({
          ...filters,
          is_new: undefined,
          page: 1
        });
        break;
      
      case 'sale':
        filterLabel = 'On Sale';
        handleFiltersChange({
          ...filters,
          is_sale: undefined,
          page: 1
        });
        break;
    }
    
    // Optional: Add toast notification for filter removal
    // toast.success(`${filterLabel} filter removed`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Hero Section with Modern Design */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">Premium Collection</span>
              </div>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Premium Kitchenware
              </span>
              <br />
              <span className="text-green-400">Collection</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Discover handcrafted kitchen essentials that transform your cooking experience. 
              From professional-grade cookware to elegant serving pieces, every item is designed 
              with precision and style.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-400" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span>Best Sellers</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Products Section (full width) */}
          <div className="flex-1">
            {/* Enhanced Header Controls */}
            <div className="mb-8 sm:mb-12">
              {/* Results, Search Status, and Active Filters */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  
                  {/* Enhanced Active Filters Display */}
                  {activeFiltersCount > 0 && (
                    <div className="flex flex-col gap-3">
                      {/* Summary Badge */}
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-green-700 font-medium">
                          {products.length} products
                        </span>
                        <div className="w-px h-3 bg-green-300"></div>
                        <span className="text-xs text-green-700">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => handleFiltersChange({
                            page: 1,
                            limit: 30,
                            categories: undefined,
                            brands: undefined,
                            min_price: undefined,
                            max_price: undefined,
                            is_featured: undefined,
                            is_new: undefined,
                            is_sale: undefined,
                            search: undefined,
                          })}
                          disabled={loading}
                          className="text-green-500 hover:text-green-700 transition-colors p-0.5 rounded-full hover:bg-green-100 disabled:opacity-50"
                          aria-label="Clear all filters"
                        >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      
                      {/* Individual Filter Tags */}
                      {activeFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                          {activeFilters.map((filter) => {
                            // Get appropriate icon for filter type
                            const getFilterIcon = (type: string) => {
                              switch (type) {
                                case 'category':
                                  return <Tag className="h-3 w-3 text-blue-500" />;
                                case 'brand':
                                  return <Building2 className="h-3 w-3 text-purple-500" />;
                                case 'price':
                                  return <DollarSign className="h-3 w-3 text-green-500" />;
                                case 'featured':
                                  return <Star className="h-3 w-3 text-yellow-500" />;
                                case 'new':
                                  return <Sparkles className="h-3 w-3 text-blue-500" />;
                                case 'sale':
                                  return <TrendingUp className="h-3 w-3 text-red-500" />;
                                default:
                                  return <Filter className="h-3 w-3 text-gray-500" />;
                              }
                            };

                                                          return (
                                <motion.div
                                  key={filter.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-200 group hover:border-gray-300"
                                >
                                  {getFilterIcon(filter.type)}
                                  <span className="text-xs text-gray-700 font-medium truncate max-w-[120px] sm:max-w-[150px]">
                                    {filter.label}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveFilter(filter.type, filter.value)}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-red-500 transition-all duration-200 p-0.5 rounded-full hover:bg-red-50 disabled:opacity-50 group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1"
                                    aria-label={`Remove ${filter.label} filter`}
                                    title={`Remove ${filter.label} filter`}
                                  >
                                    {loading ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <X className="h-3 w-3" />
                                    )}
                                  </button>
                                </motion.div>
                              );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Filter, Sort, and View Controls */}
              <div className="flex items-center gap-3 sm:gap-4">
                  {/* Enhanced Filter Sheet */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-11 px-4 sm:px-5 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Filters</span>
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] sm:w-[420px] p-0 border-r border-gray-200">
                      <SheetHeader className="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
                        <SheetTitle className="text-xl font-semibold text-gray-900">Filters</SheetTitle>
                        <p className="text-sm text-gray-600 mt-1">Refine your search</p>
                      </SheetHeader>
                      <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
                        <ProductFilters 
                          filters={filters} 
                          onFiltersChange={handleFiltersChange} 
                          loading={loading} 
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  {/* Enhanced Sort Menu */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center gap-2 h-11 px-4 sm:px-5 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                    >
                      <SortAsc className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">Sort</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`} />
                    </Button>
                    <AnimatePresence>
                      {showSortMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                        >
                          <div className="py-2">
                            {[
                              { value: 'featured', label: 'Featured', icon: Star },
                              { value: 'newest', label: 'Newest', icon: Sparkles },
                              { value: 'price-low', label: 'Price: Low to High', icon: TrendingUp },
                              { value: 'price-high', label: 'Price: High to Low', icon: TrendingUp },
                              { value: 'name', label: 'Name: A to Z', icon: List },
                            ].map((option) => {
                              const IconComponent = option.icon;
                              return (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowSortMenu(false);
                                }}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                  sortBy === option.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                }`}
                              >
                                  <IconComponent className="h-4 w-4" />
                                {option.label}
                              </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Enhanced View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-9 w-9 p-0 rounded-md transition-all duration-200"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-9 w-9 p-0 rounded-md transition-all duration-200"
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
                      ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8' 
                      : 'space-y-6 sm:space-y-8'
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

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 sm:mt-16"
                    >
                      <div className="flex flex-col items-center gap-6 sm:gap-8">
                        <div className="text-sm text-gray-600 font-medium">
                          Page {currentPage} of {totalPages}
                        </div>
                        <nav className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(1)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200"
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
                                      className={`min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                        currentPage === page 
                                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                                          : 'hover:bg-gray-50'
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
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            Next
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all duration-200"
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
