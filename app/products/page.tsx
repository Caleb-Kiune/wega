"use client"

import { useState, useEffect, useRef } from 'react';
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
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState(() => {
    const urlSortBy = searchParams.get('sort_by');
    const urlSortOrder = searchParams.get('sort_order');
    
    if (urlSortBy === 'price' && urlSortOrder === 'asc') return 'price-low';
    if (urlSortBy === 'price' && urlSortOrder === 'desc') return 'price-high';
    if (urlSortBy === 'name' && urlSortOrder === 'asc') return 'name';
    return 'price-low'; // Default to price low to high
  });
  
  const [filters, setFilters] = useState<ProductsFilters>({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 24, // Changed from 30 to 24 for better UX
    categories: searchParams.getAll('categories[]'),
    brands: searchParams.getAll('brands[]'),
    min_price: Number(searchParams.get('min_price')) || undefined,
    max_price: Number(searchParams.get('max_price')) || undefined,
    is_featured: searchParams.get('is_featured') === 'true',
    is_new: searchParams.get('is_new') === 'true',
    is_sale: searchParams.get('is_sale') === 'true',
    search: searchParams.get('search') || undefined,
    sort_by: searchParams.get('sort_by') || undefined,
    sort_order: (searchParams.get('sort_order') as 'asc' | 'desc' | undefined) || undefined,
  });

  // Debug logging for initial load
  useEffect(() => {
    console.log('Products page loaded with initial filters:', {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      categories: filters.categories,
      brands: filters.brands,
      is_featured: filters.is_featured,
      is_new: filters.is_new,
      is_sale: filters.is_sale
    });
  }, []);

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
    if (updatedFilters.limit !== 24) params.set('limit', updatedFilters.limit.toString());
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
    if (updatedFilters.sort_by) params.set('sort_by', updatedFilters.sort_by);
    if (updatedFilters.sort_order) params.set('sort_order', updatedFilters.sort_order);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleSortChange = (newSortBy: string) => {
    console.log('Sort change requested:', newSortBy);
    setSortBy(newSortBy);
    
    // Map frontend sort options to backend parameters
    let sort_by: string | undefined;
    let sort_order: 'asc' | 'desc' | undefined;
    
    switch (newSortBy) {
      case 'price-low':
        sort_by = 'price';
        sort_order = 'asc';
        break;
      case 'price-high':
        sort_by = 'price';
        sort_order = 'desc';
        break;
      case 'name':
        sort_by = 'name';
        sort_order = 'asc';
        break;
      default:
        sort_by = 'price';
        sort_order = 'asc';
        break;
    }
    
    console.log('Mapped to backend parameters:', { sort_by, sort_order });
    
    const updatedFilters = { 
      ...filters, 
      sort_by, 
      sort_order, 
      page: 1 
    };
    setFilters(updatedFilters);
    
    // Update URL with new sort parameters
    const params = new URLSearchParams();
    if (updatedFilters.page > 1) params.set('page', updatedFilters.page.toString());
    if (updatedFilters.limit !== 24) params.set('limit', updatedFilters.limit.toString());
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
    if (updatedFilters.sort_by) params.set('sort_by', updatedFilters.sort_by);
    if (updatedFilters.sort_order) params.set('sort_order', updatedFilters.sort_order);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    console.log('Updating URL with sort parameters:', newUrl);
    router.replace(newUrl, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    console.log('Page change requested:', { page, currentPage: filters.page, totalPages });
    
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    
    // Update URL with new page
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (filters.limit !== 24) params.set('limit', filters.limit.toString());
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
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_order) params.set('sort_order', filters.sort_order);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    console.log('Updating URL to:', newUrl);
    router.replace(newUrl, { scroll: false });
  };

  // Add ref for main content after hero
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll to just below the hero section when page changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filters.page]);

  const handleClearSearch = () => {
    const updatedFilters = { ...filters, search: undefined, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL without search parameter
    const params = new URLSearchParams();
    if (updatedFilters.limit !== 24) params.set('limit', updatedFilters.limit.toString());
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
    if (updatedFilters.sort_by) params.set('sort_by', updatedFilters.sort_by);
    if (updatedFilters.sort_order) params.set('sort_order', updatedFilters.sort_order);
    
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
    if (updatedFilters.limit !== 24) params.set('limit', updatedFilters.limit.toString());
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
    if (updatedFilters.sort_by) params.set('sort_by', updatedFilters.sort_by);
    if (updatedFilters.sort_order) params.set('sort_order', updatedFilters.sort_order);
    
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

  // Dynamic header height calculation for filter panel positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header, nav, .header, .navbar');
      if (header && header instanceof HTMLElement) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        document.documentElement.style.setProperty('--filter-panel-top-offset', `${headerHeight + 16}px`);
      }
    };

    // Initial calculation
    updateHeaderHeight();

    // Recalculate on resize
    window.addEventListener('resize', updateHeaderHeight);

    // Recalculate after a short delay to ensure all elements are loaded
    const timer = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* CSS for Robust Sticky Filter Panel */}
      <style jsx global>{`
        :root {
          --header-height: 80px;
          --filter-panel-top-offset: calc(var(--header-height) + 1rem);
        }
        
        .sticky-filter-panel {
          position: sticky !important;
          top: var(--filter-panel-top-offset) !important;
          z-index: 10 !important;
          transform: translateZ(0) !important;
          backface-visibility: hidden !important;
          perspective: 1000px !important;
        }
        
        .sticky-filter-panel:hover {
          z-index: 20 !important;
        }
        
        .sticky-filter-header {
          position: sticky !important;
          top: 0 !important;
          z-index: 15 !important;
          background: rgba(249, 250, 251, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 1.25rem 1.5rem 1rem 1.5rem !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        
        .sticky-filter-content {
          padding: 1rem 1.5rem !important;
        }
        
        /* Mobile-specific improvements */
        @media (max-width: 1023px) {
          .sticky-filter-panel {
            position: static !important;
          }
          .sticky-filter-header {
            position: static !important;
          }
          .sticky-filter-content {
            padding: 0 !important;
          }
          
          /* Enhanced touch targets for mobile */
          .mobile-touch-target {
            min-height: 44px !important;
            min-width: 44px !important;
          }
          
          /* Improved mobile scrolling - now handled by single container */
          .mobile-scroll-area {
            -webkit-overflow-scrolling: touch !important;
            scroll-behavior: smooth !important;
          }
          
          /* Better mobile focus states */
          .mobile-focus:focus {
            outline: 2px solid #10b981 !important;
            outline-offset: 2px !important;
          }
        }
      `}</style>
      
      {/* Compact Hero Section - Products Page Style */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden rounded-2xl mx-4 mt-4 mb-6">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-8 sm:py-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs font-medium">Premium Collection</span>
              </div>
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Premium Kitchenware
              </span>
              <br />
              <span className="text-green-400">Collection</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Discover handcrafted kitchen essentials that transform your cooking experience. 
              From professional-grade cookware to elegant serving pieces.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-green-400" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                  <span>Best Sellers</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div ref={mainContentRef} className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Products Section with Side-by-Side Layout */}
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
                        {totalPages > 1 && (
                          <span className="text-gray-500 ml-2">
                            • Page {currentPage} of {totalPages}
                          </span>
                        )}
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
                          onClick={() =>           handleFiltersChange({
                            page: 1,
            limit: 24,
                            categories: undefined,
                            brands: undefined,
                            min_price: undefined,
                            max_price: undefined,
                            is_featured: undefined,
                            is_new: undefined,
                            is_sale: undefined,
                            search: undefined,
                            sort_by: undefined,
                            sort_order: undefined,
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                {/* Left Side - Primary Controls */}
              <div className="flex items-center gap-3 sm:gap-4">
                  {/* Enhanced Filter Sheet - Mobile Only */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-12 px-4 sm:px-5 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all duration-200 shadow-sm lg:hidden mobile-touch-target"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">Filters</span>
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-1 bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-sm">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 border-r border-gray-200 bg-white flex flex-col h-full">
                      {/* Hidden SheetTitle for accessibility */}
                      <SheetTitle className="sr-only">Filter Products</SheetTitle>
                      
                      {/* Enhanced Mobile Header - Sticky */}
                      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
                        <div className="flex items-center justify-between px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                              <p className="text-sm text-gray-600">Refine your search</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(false)}
                            className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        {/* Active Filters Summary */}
                        {activeFiltersCount > 0 && (
                          <div className="px-6 pb-4">
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-green-700 font-medium">
                                  {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                                </span>
                                <div className="w-1 h-4 bg-green-300 rounded-full"></div>
                                <span className="text-sm text-green-600">
                                  {products.length} products found
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFiltersChange({
                                  page: 1,
                                  limit: 24,
                                  categories: undefined,
                                  brands: undefined,
                                  min_price: undefined,
                                  max_price: undefined,
                                  is_featured: undefined,
                                  is_new: undefined,
                                  is_sale: undefined,
                                  search: undefined,
                                  sort_by: undefined,
                                  sort_order: undefined,
                                })}
                                className="text-green-600 hover:text-green-700 hover:bg-green-100 text-sm font-medium"
                              >
                                Clear All
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Single Scroll Container - Main Content */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-4">
                          <ProductFilters 
                            filters={filters} 
                            onFiltersChange={handleFiltersChange} 
                            loading={loading} 
                          />
                        </div>
                      </div>
                      
                      {/* Mobile Action Footer - Sticky */}
                      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 shadow-lg flex-shrink-0">
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setShowFilters(false)}
                            className="flex-1 h-12 text-sm font-medium"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => setShowFilters(false)}
                            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                          >
                            Apply Filters
                          </Button>
                        </div>
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
                          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                        >
                          <div className="py-2">
                            {[
                              { value: 'price-low', label: 'Price: Low to High', icon: TrendingUp },
                              { value: 'price-high', label: 'Price: High to Low', icon: TrendingUp },
                              { value: 'name', label: 'Name: A to Z', icon: List },
                            ].map((option) => {
                              const IconComponent = option.icon;
                              return (
                              <button
                                key={option.value}
                                onClick={() => {
                                  handleSortChange(option.value);
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
                </div>

                {/* Right Side - Secondary Controls */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Products Per Page Selector */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-xs text-gray-600 font-medium">Show:</span>
                    <span className="sm:hidden text-xs text-gray-600 font-medium">Per page:</span>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
                      {[12, 24, 36, 48].map((count) => (
                        <Button
                          key={count}
                          variant={filters.limit === count ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => handleFiltersChange({ limit: count, page: 1 })}
                          className="h-8 w-8 p-0 rounded-md transition-all duration-200 text-xs font-medium"
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
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
            </div>
            {/* Side-by-Side Layout: Filters + Products */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
              {/* Filter Panel - Desktop Only - Robust Sticky Positioning */}
              <div className="hidden lg:block lg:w-56 xl:w-60 2xl:w-64 flex-shrink-0">
                <div className="sticky-filter-panel max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm will-change-transform transform-gpu">
                  <div className="sticky-filter-header">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                    </div>
                    <p className="text-xs text-gray-600">Refine your search</p>
                  </div>
                  <div className="sticky-filter-content">
                    <ProductFilters 
                      filters={filters} 
                      onFiltersChange={handleFiltersChange} 
                      loading={loading} 
                    />
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="flex-1 min-w-0">
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
                      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5' 
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
                      <div className="flex flex-col items-center gap-3 sm:gap-6">
                        <div className="text-xs sm:text-sm text-gray-600 font-medium">
                          Page {currentPage} of {totalPages}
                        </div>
                        <nav className="flex items-center gap-1 sm:gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => {
                              console.log('First button clicked, current page:', currentPage);
                              handlePageChange(1);
                            }}
                            className="min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => {
                              console.log('Prev button clicked, current page:', currentPage);
                              handlePageChange(currentPage - 1);
                            }}
                            className="min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            Prev
                          </Button>
                          
                          {/* Mobile-Optimized Page Numbers */}
                          <div className="flex items-center gap-0.5 sm:gap-1">
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
                                      <span className="px-0.5 sm:px-2 text-gray-400 text-xs">...</span>
                                    )}
                                    <Button
                                      variant={currentPage === page ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => {
                                        console.log('Page number clicked:', page, 'current page:', currentPage);
                                        handlePageChange(page);
                                      }}
                                      className={`min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg text-xs font-medium transition-all duration-200 ${
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
                            onClick={() => {
                              console.log('Next button clicked, current page:', currentPage, 'total pages:', totalPages);
                              handlePageChange(currentPage + 1);
                            }}
                            className="min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            Next
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => {
                              console.log('Last button clicked, current page:', currentPage, 'total pages:', totalPages);
                              handlePageChange(totalPages);
                            }}
                            className="min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-200"
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
      </div>
    </div>
  );
}
