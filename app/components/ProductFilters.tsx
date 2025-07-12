import { useState, useEffect } from 'react';
import { useBrands } from '@/lib/hooks/use-brands';
import { useCategories } from '@/lib/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X, Loader2, Sparkles, Star, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
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
    setIsMobileFiltersOpen(false);
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
    setIsMobileFiltersOpen(false);
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
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2 -mx-2"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-gray-600" />}
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        {collapsedSections[sectionKey] ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {!collapsedSections[sectionKey] && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
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
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200 cursor-pointer group">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-gray-600" />}
        <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors duration-200">
          {label}
        </span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-green-600"
      />
    </div>
  );

  return (
    <>
      {/* Mobile Filters Trigger */}
      <div className="lg:hidden mb-6">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full min-h-[48px] text-base font-medium shadow-sm hover:shadow-md transition-all duration-200">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] overflow-y-auto">
            <SheetHeader className="pb-4 border-b border-gray-200">
              <SheetTitle className="text-lg font-semibold">Product Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {/* Mobile Filters Content */}
              <FilterSection title="Categories" sectionKey="categories">
                  <div className="space-y-2">
                    {categoriesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                      </div>
                    ) : (
                      categories.map((category) => (
                      <FilterPill
                        key={category.id}
                        label={category.name}
                            checked={filters.categories?.includes(category.name) || false}
                        onChange={(checked) => handleCategoryChange(category.name, checked)}
                      />
                    ))
                  )}
                </div>
              </FilterSection>

              <FilterSection title="Brands" sectionKey="brands">
                  <div className="space-y-2">
                    {brandsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                      </div>
                    ) : (
                      brands.map((brand) => (
                      <FilterPill
                        key={brand.id}
                        label={brand.name}
                            checked={filters.brands?.includes(brand.name) || false}
                        onChange={(checked) => handleBrandChange(brand.name, checked)}
                      />
                    ))
                  )}
                </div>
              </FilterSection>

              <FilterSection title="Price Range" sectionKey="price">
                  <div className="space-y-4">
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={50000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>KES {priceRange[0].toLocaleString()}</span>
                      <span>KES {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleApplyPriceFilters} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg hover:scale-105 transition-all duration-200 min-h-[44px] font-medium shadow-lg hover:shadow-xl"
                  >
                    Apply Price Filter
                  </Button>
                </div>
              </FilterSection>

              <FilterSection title="Product Status" sectionKey="status">
                  <div className="space-y-2">
                  <FilterPill
                    label="Featured"
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

                {/* Clear Filters */}
              <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  className="w-full min-h-[44px] text-base font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    Clear All Filters
                  </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-6">
            <FilterSection title="Categories" sectionKey="categories">
              <div className="space-y-2">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                ) : (
                  categories.map((category) => (
                    <FilterPill
                      key={category.id}
                      label={category.name}
                        checked={filters.categories?.includes(category.name) || false}
                      onChange={(checked) => handleCategoryChange(category.name, checked)}
                    />
                  ))
                )}
              </div>
            </FilterSection>

            <FilterSection title="Brands" sectionKey="brands">
              <div className="space-y-2">
                {brandsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                ) : (
                  brands.map((brand) => (
                    <FilterPill
                      key={brand.id}
                      label={brand.name}
                        checked={filters.brands?.includes(brand.name) || false}
                      onChange={(checked) => handleBrandChange(brand.name, checked)}
                    />
                  ))
                )}
              </div>
            </FilterSection>

            <FilterSection title="Price Range" sectionKey="price">
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={50000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-3 text-sm text-gray-600">
                    <span>KES {priceRange[0].toLocaleString()}</span>
                    <span>KES {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleApplyPriceFilters} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg hover:scale-105 transition-all duration-200 min-h-[44px] font-medium shadow-lg hover:shadow-xl"
                >
                  Apply Price Filter
                </Button>
              </div>
            </FilterSection>

            <FilterSection title="Product Status" sectionKey="status">
              <div className="space-y-2">
                <FilterPill
                  label="Featured"
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
        </div>
      </div>
    </>
  );
} 