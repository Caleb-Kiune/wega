import { useState, useEffect } from 'react';
import { useBrands } from '../hooks/useBrands';
import { useCategories } from '../hooks/useCategories';
import { ProductsFilters } from '../lib/api';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Filter } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { brands, loading: brandsLoading } = useBrands();
  const { categories, loading: categoriesLoading } = useCategories();
  const [localFilters, setLocalFilters] = useState<ProductsFilters>(filters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ProductsFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: ProductsFilters = {
      page: 1,
      limit: 12,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Search</h3>
        <Input
          type="text"
          placeholder="Search products..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
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
                checked={localFilters.categories?.includes(category.name)}
                onCheckedChange={(checked) => {
                  const currentCategories = localFilters.categories || [];
                  const newCategories = checked
                    ? [...currentCategories, category.name]
                    : currentCategories.filter((c) => c !== category.name);
                  handleFilterChange('categories', newCategories);
                }}
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
        <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
            className="w-24"
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
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
                checked={localFilters.brands?.includes(brand.name)}
                onCheckedChange={(checked) => {
                  const currentBrands = localFilters.brands || [];
                  const newBrands = checked
                    ? [...currentBrands, brand.name]
                    : currentBrands.filter((b) => b !== brand.name);
                  handleFilterChange('brands', newBrands);
                }}
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
        <Button
          onClick={handleApplyFilters}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          Apply Filters
        </Button>
        <Button
          onClick={clearFilters}
          variant="outline"
          className="flex-1"
        >
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