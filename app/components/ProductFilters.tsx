import { useState, useEffect } from 'react';
import { useBrands } from '@/lib/hooks/use-brands';
import { useCategories } from '@/lib/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Filter, Loader2, Sparkles, Star, TrendingUp, ChevronDown, Tag, Building2, DollarSign, Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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

export default function ProductFilters({ filters, onFiltersChange, loading }: ProductFiltersProps) {
  const { brands, loading: brandsLoading } = useBrands();
  const { categories, loading: categoriesLoading } = useCategories();
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    categories: false,
    brands: false,
    price: false,
    status: false,
  });

  // Initialize price range from filters
  useEffect(() => {
    setPriceRange([
      filters.min_price || 0,
      filters.max_price || 50000
    ]);
  }, [filters.min_price, filters.max_price]);

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleApplyPriceFilters = () => {
    onFiltersChange({
      ...filters,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 50000 ? priceRange[1] : undefined,
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
    setPriceRange([0, 50000]);
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

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  const FilterSection = ({ 
    title, 
    children, 
    sectionKey, 
    icon: Icon 
  }: { 
    title: string; 
    children: React.ReactNode; 
    sectionKey: string;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <motion.div 
      className="border-b border-gray-100 last:border-b-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg px-3 -mx-3 group min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-gray-500 group-hover:text-green-600 transition-colors" />}
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: collapsedSections[sectionKey] ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {!collapsedSections[sectionKey] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const FilterPill = ({ 
    label, 
    checked, 
    onChange, 
    icon: Icon 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <motion.div 
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer group min-h-[56px]",
        checked 
          ? "border-green-200 bg-green-50 shadow-sm" 
          : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-gray-500 group-hover:text-green-600 transition-colors" />}
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
      </div>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 transition-all duration-200",
        checked 
          ? "bg-green-600 border-green-600" 
          : "border-gray-300 group-hover:border-green-400"
      )}>
        {checked && (
          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge className="bg-green-600 text-white text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-6 space-y-6">
        {/* Categories */}
        <FilterSection title="Categories" sectionKey="categories" icon={Tag}>
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {categories?.map((category) => (
                <FilterPill
                  key={category.name}
                  label={category.name}
                  checked={filters.categories?.includes(category.name) || false}
                  onChange={(checked) => handleCategoryChange(category.name, checked)}
                />
              ))}
            </div>
          )}
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands" sectionKey="brands" icon={Building2}>
          {brandsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {brands?.map((brand) => (
                <FilterPill
                  key={brand.name}
                  label={brand.name}
                  checked={filters.brands?.includes(brand.name) || false}
                  onChange={(checked) => handleBrandChange(brand.name, checked)}
                />
              ))}
            </div>
          )}
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price" icon={DollarSign}>
          <div className="space-y-6">
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={50000}
                min={0}
                step={1000}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>KES {priceRange[0].toLocaleString()}</span>
              <span>KES {priceRange[1].toLocaleString()}</span>
            </div>
            <Button
              onClick={handleApplyPriceFilters}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
            >
              Apply Price Filter
            </Button>
          </div>
        </FilterSection>

        {/* Product Status */}
        <FilterSection title="Product Status" sectionKey="status" icon={Zap}>
          <div className="space-y-3">
            <FilterPill
              label="Featured Products"
              checked={filters.is_featured || false}
              onChange={(checked) => onFiltersChange({ ...filters, is_featured: checked, page: 1 })}
              icon={Sparkles}
            />
            <FilterPill
              label="New Arrivals"
              checked={filters.is_new || false}
              onChange={(checked) => onFiltersChange({ ...filters, is_new: checked, page: 1 })}
              icon={Star}
            />
            <FilterPill
              label="On Sale"
              checked={filters.is_sale || false}
              onChange={(checked) => onFiltersChange({ ...filters, is_sale: checked, page: 1 })}
              icon={TrendingUp}
            />
          </div>
        </FilterSection>
      </div>

      {/* Mobile Action Buttons - Only show in mobile context */}
      <div className="lg:hidden p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button
            onClick={() => {
              // This will be handled by the parent component's Sheet close
              // The filters are already applied when changed
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
} 