import { useState, useEffect } from 'react';
import { useBrands } from '@/lib/hooks/use-brands';
import { useCategories } from '@/lib/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [priceInputs, setPriceInputs] = useState({ min: '', max: '' });

  // Initialize price range from filters
  useEffect(() => {
    const min = filters.min_price || 0;
    const max = filters.max_price || 50000;
    setPriceRange([min, max]);
    setPriceInputs({ 
      min: min > 0 ? min.toString() : '', 
      max: max < 50000 ? max.toString() : '' 
    });
  }, [filters.min_price, filters.max_price]);

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setPriceInputs({
      min: value[0] > 0 ? value[0].toString() : '',
      max: value[1] < 50000 ? value[1].toString() : ''
    });
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setPriceInputs(prev => ({ ...prev, [type]: value }));
    
    if (type === 'min') {
      setPriceRange([numValue, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], numValue]);
    }
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
    setPriceInputs({ min: '', max: '' });
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

  const activeFiltersCount = getActiveFiltersCount();

  // Minimalist Filter Section
  const FilterSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="py-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );

  // New Custom Checkbox Component
  const CustomCheckbox = ({ 
    label, 
    checked, 
    onChange 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <button
      className={cn(
        "flex items-center justify-between w-full py-3 px-0 text-left transition-colors duration-200",
        checked 
          ? "text-gray-900" 
          : "text-gray-600 hover:text-gray-900"
      )}
      onClick={() => onChange(!checked)}
    >
      <span className="text-sm">{label}</span>
      
      {/* Custom Checkbox */}
      <div className="relative">
        <div className={cn(
          "w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center",
          checked 
            ? "bg-black border-black" 
            : "border-gray-300 bg-white"
        )}>
          {/* Checkmark using CSS */}
          {checked && (
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          )}
        </div>
      </div>
    </button>
  );

  // Native Checkbox Option
  const NativeCheckbox = ({
    label,
    checked,
    onChange
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="flex items-center gap-3 w-full py-3 px-0 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        className="form-checkbox h-5 w-5 accent-green-600 rounded border-gray-300 focus:ring-green-500 transition"
      />
      <span className="text-sm text-gray-900">{label}</span>
    </label>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Minimalist Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <div>
              <h2 className="text-base font-medium text-gray-900">Filters</h2>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">{activeFiltersCount} active</p>
              )}
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Main Scrollable Filter Content */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="px-6">
          {/* Product Status */}
          <FilterSection title="Product Status">
            <div className="space-y-1 max-h-48 overflow-y-auto">
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
          </FilterSection>

          {/* Categories */}
          <FilterSection title="Categories">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
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
          </FilterSection>

          {/* Brands */}
          <FilterSection title="Brands">
            {brandsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
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
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="space-y-4">
              {/* Price Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Min Price</label>
                  <Input
                    type="number"
                    value={priceInputs.min}
                    onChange={(e) => handlePriceInputChange('min', e.target.value)}
                    placeholder="0"
                    className="h-9 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Max Price</label>
                  <Input
                    type="number"
                    value={priceInputs.max}
                    onChange={(e) => handlePriceInputChange('max', e.target.value)}
                    placeholder="50,000"
                    className="h-9 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900/20"
                  />
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={50000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>KES {priceRange[0].toLocaleString()}</span>
                  <span>KES {priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Sticky Apply Button */}
              <div className="sticky bottom-0 bg-white pt-2 pb-2 z-10">
                <Button
                  onClick={handleApplyPriceFilters}
                  className="w-full h-9 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors shadow"
                >
                  Apply Price Filter
                </Button>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  );
} 