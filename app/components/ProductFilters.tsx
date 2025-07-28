import { useState, useEffect } from 'react';
import { useBrands } from '@/lib/hooks/use-brands';
import { useCategories } from '@/lib/hooks/use-categories';
import { usePriceRange } from '@/lib/hooks/use-price-range';
import PriceRangeFilter, { PriceRange } from '@/components/PriceRangeFilter';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Loader2, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Tag, 
  Building2, 
  DollarSign, 
  RotateCcw,
  Check,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductsFilters {
  page: number;
  limit: number;
  min_price?: number;
  max_price?: number;
  categories?: string[];
  brands?: string[];
  is_featured?: boolean;
  is_new?: boolean;
  is_sale?: boolean;
  search?: string;
}

interface ProductFiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: Partial<ProductsFilters>) => void;
  loading: boolean;
}

// Section configuration with default states
interface FilterSectionConfig {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultExpanded: boolean;
  hasActiveFilters: boolean;
}

export default function ProductFilters({ filters, onFiltersChange, loading }: ProductFiltersProps) {
  const { brands, loading: brandsLoading } = useBrands();
  const { categories, loading: categoriesLoading } = useCategories();
  const { priceRange, priceStats, loading: priceRangeLoading } = usePriceRange();

  // Collapsible sections state - all collapsed by default for user control
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'product-status': false, // Collapsed by default
    'categories': false,     // Collapsed by default
    'brands': false,         // Collapsed by default
    'price-range': false,    // Collapsed by default
  });

  // Current price range from filters
  const currentPriceRange: PriceRange | undefined = filters.min_price || filters.max_price ? {
    min: filters.min_price || priceRange.min,
    max: filters.max_price || priceRange.max
  } : undefined;

  // Handle price range changes
  const handlePriceRangeChange = (range: PriceRange | null) => {
    onFiltersChange({
      ...filters,
      min_price: range?.min,
      max_price: range?.max,
      page: 1,
    });
  };

  const clearFilters = () => {
    onFiltersChange({ 
      page: 1, 
      limit: 36,
      categories: undefined,
      brands: undefined,
      min_price: undefined,
      max_price: undefined,
      is_featured: undefined,
      is_new: undefined,
      is_sale: undefined,
      search: undefined,
    });
  };

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const updatedCategories = checked
      ? [...currentCategories, categoryName]
      : currentCategories.filter(cat => cat !== categoryName);
    
    onFiltersChange({
      ...filters,
      categories: updatedCategories.length > 0 ? updatedCategories : undefined,
      page: 1,
    });
  };

  const handleBrandChange = (brandName: string, checked: boolean) => {
    const currentBrands = filters.brands || [];
    const updatedBrands = checked
      ? [...currentBrands, brandName]
      : currentBrands.filter(brand => brand !== brandName);
    
    onFiltersChange({
      ...filters,
      brands: updatedBrands.length > 0 ? updatedBrands : undefined,
      page: 1,
    });
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

  // Get active filters count for each section
  const getSectionActiveCount = (sectionId: string): number => {
    switch (sectionId) {
      case 'product-status':
        return [filters.is_featured, filters.is_new, filters.is_sale].filter(Boolean).length;
      case 'categories':
        return filters.categories?.length || 0;
      case 'brands':
        return filters.brands?.length || 0;
      case 'price-range':
        return (filters.min_price || filters.max_price) ? 1 : 0;
      default:
        return 0;
    }
  };

  // Check if section has active filters
  const hasActiveFilters = (sectionId: string): boolean => {
    return getSectionActiveCount(sectionId) > 0;
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // No auto-expand logic - sections remain user-controlled

  const activeFiltersCount = getActiveFiltersCount();

  // Collapsible Filter Section Component
  const CollapsibleFilterSection = ({ 
    id,
    title, 
    children,
    icon: Icon
  }: { 
    id: string;
    title: string; 
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }) => {
    const isExpanded = expandedSections[id];
    const activeCount = getSectionActiveCount(id);
    const hasActive = hasActiveFilters(id);

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        {/* Section Header - Clickable */}
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-4 px-0 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg"
          aria-expanded={isExpanded}
          aria-controls={`filter-section-${id}`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4 text-gray-500" />}
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              {title}
            </h3>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full min-w-[20px]">
                {activeCount}
              </span>
            )}
          </div>
          
          {/* Chevron Icon */}
          <div className="flex items-center gap-2">
            {hasActive && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </motion.div>
          </div>
        </button>

        {/* Section Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`filter-section-${id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Compact Native Checkbox Option
  const NativeCheckbox = ({
    label,
    checked,
    onChange
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="flex items-center gap-3 w-full py-3 px-0 cursor-pointer select-none hover:bg-gray-50 rounded-lg transition-colors duration-200 touch-manipulation mobile-touch-target mobile-focus">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        className="form-checkbox h-4 w-4 accent-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-2 transition-all duration-200"
      />
      <span className={`text-sm font-medium transition-colors duration-200 ${checked ? 'text-gray-900' : 'text-gray-700'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className="bg-white">
      {/* Compact Header */}
      {activeFiltersCount > 0 && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm">
          <div className="py-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">{activeFiltersCount} active filters</span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Content - Collapsible Sections */}
      <div>
        {/* Product Status */}
        <CollapsibleFilterSection 
          id="product-status"
          title="Product Status" 
          icon={Star}
        >
          <div className="space-y-1">
            <NativeCheckbox
              label="Featured Products"
              checked={filters.is_featured || false}
              onChange={(checked) => onFiltersChange({ ...filters, is_featured: checked, page: 1 })}
            />
            <NativeCheckbox
              label="New Arrivals"
              checked={filters.is_new || false}
              onChange={(checked) => onFiltersChange({ ...filters, is_new: checked, page: 1 })}
            />
            <NativeCheckbox
              label="On Sale"
              checked={filters.is_sale || false}
              onChange={(checked) => onFiltersChange({ ...filters, is_sale: checked, page: 1 })}
            />
          </div>
        </CollapsibleFilterSection>

        {/* Categories */}
        <CollapsibleFilterSection 
          id="categories"
          title="Categories" 
          icon={Tag}
        >
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-1">
              {categories?.map((category) => (
                <NativeCheckbox
                  key={category.name}
                  label={category.name}
                  checked={filters.categories?.includes(category.name) || false}
                  onChange={(checked) => handleCategoryChange(category.name, checked)}
                />
              ))}
            </div>
          )}
        </CollapsibleFilterSection>

        {/* Brands */}
        <CollapsibleFilterSection 
          id="brands"
          title="Brands" 
          icon={Building2}
        >
          {brandsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-1">
              {brands?.map((brand) => (
                <NativeCheckbox
                  key={brand.name}
                  label={brand.name}
                  checked={filters.brands?.includes(brand.name) || false}
                  onChange={(checked) => handleBrandChange(brand.name, checked)}
                />
              ))}
            </div>
          )}
        </CollapsibleFilterSection>

        {/* Enhanced Price Range Filter */}
        <CollapsibleFilterSection 
          id="price-range"
          title="Price Range" 
          icon={DollarSign}
        >
          {priceRangeLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <PriceRangeFilter
              currentRange={currentPriceRange}
              onRangeChange={handlePriceRangeChange}
              loading={loading}
              availablePriceRange={priceRange}
              autoApply={true}
              debounceMs={500}
              showPriceSuggestions={true}
              showResetButton={true}
              isModal={true}
              className="px-0"
            />
          )}
        </CollapsibleFilterSection>
      </div>
    </div>
  );
} 