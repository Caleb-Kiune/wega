import { useState, useEffect } from 'react';
import { productsApi, Product, ProductsParams, ProductsResponse } from '@/lib/products';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
}

// Enhanced search function with ranking
const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  
  return products
    .map(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      const description = product.description?.toLowerCase() || '';
      const sku = product.sku?.toLowerCase() || '';
      
      // Exact name match (highest priority)
      if (name === searchTerm) score += 100;
      // Name starts with search term
      else if (name.startsWith(searchTerm)) score += 50;
      // Name contains search term
      else if (name.includes(searchTerm)) score += 30;
      // SKU exact match
      else if (sku === searchTerm) score += 40;
      // SKU contains search term
      else if (sku.includes(searchTerm)) score += 20;
      // Description contains search term
      else if (description.includes(searchTerm)) score += 10;
      
      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
};

export function useProducts(filters: ProductsParams = {}): UseProductsResult {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load all products for client-side search (only once)
  useEffect(() => {
    const loadAllProducts = async () => {
      if (isInitialized) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load a larger dataset for better client-side search
        const data = await productsApi.getAll({ 
          limit: 500, // Increased limit for comprehensive search
          ...filters 
        });
        
        setAllProducts(data.products);
        setFilteredProducts(data.products);
        setTotalPages(data.pages);
        setCurrentPage(data.current_page);
        setIsInitialized(true);
        
        console.log('Loaded products for client-side search:', data.products.length);
      } catch (err) {
        console.error('Error loading products for search:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };
    
    loadAllProducts();
  }, [isInitialized]); // Only run once

  // Client-side filtering for search
  useEffect(() => {
    if (!isInitialized) return;
    
    if (!filters.search) {
      setFilteredProducts(allProducts);
      return;
    }
    
    const results = searchProducts(allProducts, filters.search);
    setFilteredProducts(results);
    
    console.log('Client-side search results:', {
      query: filters.search,
      totalProducts: allProducts.length,
      filteredResults: results.length
    });
  }, [filters.search, allProducts, isInitialized]);

  // Handle other filters (category, brand, etc.) with server-side filtering
  useEffect(() => {
    if (!isInitialized) return;
    
    const hasServerFilters = filters.categories?.length || 
                           filters.brands?.length || 
                           filters.min_price || 
                           filters.max_price || 
                           filters.is_featured || 
                           filters.is_new || 
                           filters.is_sale;
    
    if (hasServerFilters) {
      const fetchFilteredProducts = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log('Fetching products with server-side filters:', filters);
          
          const data = await productsApi.getAll(filters);
          
          setFilteredProducts(data.products);
          setTotalPages(data.pages);
          setCurrentPage(data.current_page);
          
          console.log('Server-side filtered results:', {
            totalProducts: data.products.length,
            pages: data.pages,
            currentPage: data.current_page
          });
        } catch (err) {
          console.error('Error fetching filtered products:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch filtered products'));
        } finally {
          setLoading(false);
        }
      };
      
      fetchFilteredProducts();
    }
  }, [filters.categories, filters.brands, filters.min_price, filters.max_price, 
      filters.is_featured, filters.is_new, filters.is_sale, isInitialized]);

  return { 
    products: filteredProducts, 
    loading, 
    error, 
    totalPages, 
    currentPage 
  };
} 