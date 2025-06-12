import { useState, useEffect } from 'react';
import { useBrands } from '../hooks/useBrands';
import { useCategories } from '../hooks/useCategories';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Filter } from 'lucide-react';
import { ProductsParams } from '../lib/api/products';

export interface ProductsFilters extends Omit<ProductsParams, 'page' | 'limit'> {
  page: number;
  limit: number;
  sort: 'featured' | 'newest' | 'offers' | 'price_asc' | 'price_desc';
}

interface ProductFiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { brands } = useBrands();
  const { categories } = useCategories();

  // Local state for price inputs as strings
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setMinPriceInput(filters.minPrice?.toString() || '');
    setMaxPriceInput(filters.maxPrice?.toString() || '');
  }, [filters]);

  const handleCheckboxChange = (
    key: 'brands' | 'categories',
    value: string,
    checked: boolean
  ) => {
    const currentValues: string[] = filters[key] || [];
    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);

    onFiltersChange({
      ...filters,
      [key]: updatedValues,
      page: 1,
    });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1,
    });
  };

  const handleApplyPriceFilters = () => {
    const updatedFilters = {
      ...filters,
      minPrice: minPriceInput ? Number(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? Number(maxPriceInput) : undefined,
      page: 1,
    };
    onFiltersChange(updatedFilters);
    setIsMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    onFiltersChange({ 
      page: 1, 
      limit: 12,
      brands: [],
      categories: [],
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'featured',
      search: undefined
    });
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Search</h3>
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories?.includes(category.name)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('categories', category.name, !!checked)
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
          <span className="text-gray-500">-</span>
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
                checked={filters.brands?.includes(brand.name)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('brands', brand.name, !!checked)
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
