import { useState, useEffect } from 'react';
import { useBrands } from '../hooks/useBrands';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Filter, X, Loader2 } from 'lucide-react';
import { ProductsParams } from '../lib/api/products';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ProductsFilters {
  page: number;
  limit: number;
  min_price?: number;
  max_price?: number;
  brand?: string;
  category?: string;
  is_featured?: boolean;
  is_new?: boolean;
  is_sale?: boolean;
}

interface ProductFiltersProps {
  filters: ProductsFilters;
  onFiltersChange: (filters: ProductsFilters) => void;
  loading: boolean;
}

export default function ProductFilters({ filters, onFiltersChange, loading }: ProductFiltersProps) {
  const { brands, loading: brandsLoading } = useBrands();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  useEffect(() => {
    if (filters.min_price) setMinPriceInput(filters.min_price.toString());
    if (filters.max_price) setMaxPriceInput(filters.max_price.toString());
  }, [filters.min_price, filters.max_price]);

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
      is_featured: undefined,
      is_new: undefined,
      is_sale: undefined,
    });
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  return (
    <>
      {/* Mobile Filters Trigger */}
      <div className="lg:hidden mb-4">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="py-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              {/* Mobile Filters Content */}
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.category === category.name}
                            onCheckedChange={(checked) => {
                              onFiltersChange({
                                ...filters,
                                category: checked ? category.name : undefined,
                                page: 1,
                              });
                            }}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Brands</h3>
                  <div className="space-y-2">
                    {brandsLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand.id}`}
                            checked={filters.brand === brand.name}
                            onCheckedChange={(checked) => {
                              onFiltersChange({
                                ...filters,
                                brand: checked ? brand.name : undefined,
                                page: 1,
                              });
                            }}
                          />
                          <label
                            htmlFor={`brand-${brand.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </div>
                    <Button onClick={handleApplyPriceFilters} className="w-full">
                      Apply Price Filter
                    </Button>
                  </div>
                </div>

                {/* Product Status */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Product Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={filters.is_featured}
                        onCheckedChange={(checked) => {
                          onFiltersChange({
                            ...filters,
                            is_featured: checked as boolean,
                            page: 1,
                          });
                        }}
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Featured Products
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new"
                        checked={filters.is_new}
                        onCheckedChange={(checked) => {
                          onFiltersChange({
                            ...filters,
                            is_new: checked as boolean,
                            page: 1,
                          });
                        }}
                      />
                      <label
                        htmlFor="new"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New Arrivals
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sale"
                        checked={filters.is_sale}
                        onCheckedChange={(checked) => {
                          onFiltersChange({
                            ...filters,
                            is_sale: checked as boolean,
                            page: 1,
                          });
                        }}
                      />
                      <label
                        htmlFor="sale"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        On Sale
                      </label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm"
          >
            Clear all
          </Button>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="space-y-2">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-category-${category.id}`}
                    checked={filters.category === category.name}
                    onCheckedChange={(checked) => {
                      onFiltersChange({
                        ...filters,
                        category: checked ? category.name : undefined,
                        page: 1,
                      });
                    }}
                  />
                  <label
                    htmlFor={`desktop-category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="text-sm font-medium mb-2">Brands</h3>
          <div className="space-y-2">
            {brandsLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-brand-${brand.id}`}
                    checked={filters.brand === brand.name}
                    onCheckedChange={(checked) => {
                      onFiltersChange({
                        ...filters,
                        brand: checked ? brand.name : undefined,
                        page: 1,
                      });
                    }}
                  />
                  <label
                    htmlFor={`desktop-brand-${brand.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium mb-2">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-24 px-2 py-1 border rounded"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-24 px-2 py-1 border rounded"
              />
            </div>
            <Button onClick={handleApplyPriceFilters} className="w-full">
              Apply Price Filter
            </Button>
          </div>
        </div>

        {/* Product Status */}
        <div>
          <h3 className="text-sm font-medium mb-2">Product Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.is_featured}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    is_featured: checked as boolean,
                    page: 1,
                  });
                }}
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Featured Products
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new"
                checked={filters.is_new}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    is_new: checked as boolean,
                    page: 1,
                  });
                }}
              />
              <label
                htmlFor="new"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                New Arrivals
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sale"
                checked={filters.is_sale}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    is_sale: checked as boolean,
                    page: 1,
                  });
                }}
              />
              <label
                htmlFor="sale"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                On Sale
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
