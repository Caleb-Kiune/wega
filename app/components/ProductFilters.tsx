import { useState, useEffect } from 'react';
import { useBrands } from '../hooks/useBrands';
import { useCategories } from '../hooks/useCategories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Filter, X, Loader2 } from 'lucide-react';
import { ProductsParams } from '../lib/api/products';
import { useDebounce } from 'use-debounce';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ProductsFilters {
  page: number;
  limit: number;
  sort: 'featured' | 'newest' | 'offers' | 'price_asc' | 'price_desc';
  min_price?: number;
  max_price?: number;
  brand?: string;
  category?: string;
  search?: string;
}

interface ProductFiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
  loading?: boolean;
}

export default function ProductFilters({ filters, onFiltersChange, loading }: ProductFiltersProps) {
  const { brands } = useBrands();
  const { categories } = useCategories();

  // Local state for price inputs as strings
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  useEffect(() => {
    setMinPriceInput(filters.min_price?.toString() || '');
    setMaxPriceInput(filters.max_price?.toString() || '');
  }, [filters]);

  useEffect(() => {
    onFiltersChange({
      ...filters,
      search: debouncedSearch || undefined,
      page: 1,
    });
  }, [debouncedSearch]);

  const handleCheckboxChange = (
    key: 'brand' | 'category',
    value: string,
    checked: boolean
  ) => {
    onFiltersChange({
      ...filters,
      [key]: checked ? value : undefined,
      page: 1,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFiltersChange({
        ...filters,
        search: searchInput || undefined,
        page: 1,
      });
    } else if (e.key === 'Escape') {
      setSearchInput('');
      onFiltersChange({
        ...filters,
        search: undefined,
        page: 1,
      });
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    onFiltersChange({
      ...filters,
      search: undefined,
      page: 1,
    });
  };

  const handleApplyPriceFilters = () => {
    const updatedFilters = {
      ...filters,
      min_price: minPriceInput ? Number(minPriceInput) : undefined,
      max_price: maxPriceInput ? Number(maxPriceInput) : undefined,
      page: 1,
    };
    onFiltersChange(updatedFilters);
    setIsMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    onFiltersChange({ 
      page: 1, 
      limit: 12,
      brand: undefined,
      category: undefined,
      min_price: undefined,
      max_price: undefined,
      sort: 'featured',
      search: undefined
    });
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchInput('');
  };

  const SearchBar = () => (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for shoes, phones, TVs..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        className="w-full pl-3 pr-10"
        aria-label="Search products"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      {!loading && searchInput && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Bar - Always visible on mobile */}
      <div className="lg:hidden">
        <h3 className="font-medium text-gray-800 mb-3">Search</h3>
        <SearchBar />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.category === category.name}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('category', category.name, !!checked)
                }
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">Price Range</h3>
          <Button
            onClick={handleApplyPriceFilters}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            Apply
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="w-24"
          />
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={filters.brand === brand.name}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('brand', brand.name, !!checked)
                }
              />
              <label
                htmlFor={`brand-${brand.id}`}
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Search</h3>
          <SearchBar />
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
