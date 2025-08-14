import { ProductsParams } from '@/lib/types';

/**
 * Convert filter state to URL search parameters
 */
export const filtersToSearchParams = (filters: ProductsParams): URLSearchParams => {
  const params = new URLSearchParams();
  
  // Add pagination parameters
  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString());
  }
  if (filters.limit && filters.limit !== 24) {
    params.set('limit', filters.limit.toString());
  }
  
  // Add filter parameters
  if (filters.categories?.length) {
    filters.categories.forEach(category => params.append('categories[]', category));
  }
  if (filters.brands?.length) {
    filters.brands.forEach(brand => params.append('brands[]', brand));
  }
  if (filters.min_price) {
    params.set('min_price', filters.min_price.toString());
  }
  if (filters.max_price) {
    params.set('max_price', filters.max_price.toString());
  }
  if (filters.is_featured) {
    params.set('is_featured', 'true');
  }
  if (filters.is_new) {
    params.set('is_new', 'true');
  }
  if (filters.is_sale) {
    params.set('is_sale', 'true');
  }
  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.sort_by) {
    params.set('sort_by', filters.sort_by);
  }
  if (filters.sort_order) {
    params.set('sort_order', filters.sort_order);
  }
  
  return params;
};

/**
 * Convert URL search parameters to filter state
 */
export const searchParamsToFilters = (searchParams: URLSearchParams): ProductsParams => {
  return {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 24,
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
  };
};

/**
 * Create a clean filter object for API calls (removes undefined values)
 */
export const cleanFiltersForAPI = (filters: ProductsParams): ProductsParams => {
  const cleaned: ProductsParams = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        cleaned[key as keyof ProductsParams] = value;
      } else if (!Array.isArray(value)) {
        cleaned[key as keyof ProductsParams] = value;
      }
    }
  });
  
  return cleaned;
};

/**
 * Check if filters have changed
 */
export const hasFiltersChanged = (oldFilters: ProductsParams, newFilters: ProductsParams): boolean => {
  const keys = Object.keys({ ...oldFilters, ...newFilters }) as (keyof ProductsParams)[];
  
  return keys.some(key => {
    const oldValue = oldFilters[key];
    const newValue = newFilters[key];
    
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (oldValue.length !== newValue.length) return true;
      return oldValue.some((item, index) => item !== newValue[index]);
    }
    
    return oldValue !== newValue;
  });
};

/**
 * Get active filters count
 */
export const getActiveFiltersCount = (filters: ProductsParams): number => {
  let count = 0;
  if (filters.categories?.length) count += filters.categories.length;
  if (filters.brands?.length) count += filters.brands.length;
  if (filters.min_price || filters.max_price) count += 1;
  if (filters.is_featured) count += 1;
  if (filters.is_new) count += 1;
  if (filters.is_sale) count += 1;
  return count;
};
