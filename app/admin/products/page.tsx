'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/products';
import { Product } from '@/shared/types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Grid, List, Search, Filter, Trash2, Edit, Eye, MoreVertical, Package, Plus, Check, X, AlertTriangle, MapPin, Settings, LogOut, BarChart3, TrendingUp, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, Star, Clock, Tag, Zap, Sparkles, ArrowLeft, MoreHorizontal } from 'lucide-react';
import AdminProductCard from '@/components/admin-product-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Review {
  id: number;
  product_id: number;
  user: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
  avatar: string;
}

interface ProductWithReviews extends Product {
  reviews: Review[];
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

function ProductsPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithReviews | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedProductForAction, setSelectedProductForAction] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getAll({
          search: searchTerm,
          categories: category === 'all' ? undefined : [category],
          brands: brand === 'all' ? undefined : [brand],
          sort_by: sortBy,
          sort_order: sortOrder,
          page: currentPage,
          limit: 100 // Set a high limit to fetch all products
        });
        setProducts(response.products);
        setTotalPages(response.pages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, category, brand, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    // Extract unique categories and brands from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
      .filter(Boolean) // Remove null/undefined values
      .map((name, index) => ({ id: name, name })); // Use name as id for easier filtering
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)))
      .filter(Boolean) // Remove null/undefined values
      .map((name, index) => ({ id: name, name })); // Use name as id for easier filtering
    
    setCategories(uniqueCategories);
    setBrands(uniqueBrands);
  }, [products]);

  const handleEdit = (product: Product) => {
    router.push(`/admin/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      console.log('Deleting product:', productToDelete.id);
      await productsApi.delete(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      if (errorMessage.includes('associated orders')) {
        toast.error('This product cannot be deleted because it has associated orders. Please archive it instead.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled(
        selectedProducts.map(id => productsApi.delete(id))
      );
      
      // Check results
      const successfulDeletes = results.filter(
        (result): result is PromiseFulfilledResult<void> => result.status === 'fulfilled'
      );
      const failedDeletes = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );
      
      // Update products list for successful deletes
      if (successfulDeletes.length > 0) {
        setProducts(products.filter(p => !selectedProducts.includes(p.id)));
        toast.success(`Successfully deleted ${successfulDeletes.length} product(s)`);
      }
      
      // Show error for failed deletes
      if (failedDeletes.length > 0) {
        const hasOrderErrors = failedDeletes.some(
          result => result.reason?.message?.includes('associated orders')
        );
        if (hasOrderErrors) {
          toast.error('Some products could not be deleted because they have associated orders. Please archive them instead.');
        } else {
          toast.error(`Failed to delete ${failedDeletes.length} product(s)`);
        }
      }
      
      setSelectedProducts([]);
      setShowDeleteDialog(false);
    } catch (err) {
      console.error('Error deleting products:', err);
      toast.error('Failed to delete products');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(search);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleOpenActionModal = (product: Product) => {
    setSelectedProductForAction(product);
    setShowActionModal(true);
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setSelectedProductForAction(null);
  };

  const handleActionEdit = () => {
    if (selectedProductForAction) {
      handleEdit(selectedProductForAction);
      handleCloseActionModal();
    }
  };

  const handleActionDelete = () => {
    if (selectedProductForAction) {
      handleDelete(selectedProductForAction);
      handleCloseActionModal();
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchTerm || (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesBrand = brand === 'all' || product.brand === brand;
      return matchesSearch && matchesCategory && matchesBrand;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'stock':
          aValue = a.stock || 0;
          bValue = b.stock || 0;
          break;
        default:
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
      }
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const featuredProducts = products.filter(p => p.is_featured).length;
  const newProducts = products.filter(p => p.is_new).length;
  const saleProducts = products.filter(p => p.is_sale).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-500 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-ping opacity-20"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-700">Loading products</h3>
                <p className="text-slate-500">Preparing your product catalog...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto border-red-200 bg-red-50/50">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-700">Connection Error</CardTitle>
              <CardDescription className="text-red-600">Failed to load products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-red-600 text-center">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
        {/* Mobile-Optimized Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Button
                  onClick={() => router.push('/admin')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden xs:inline">Back to Dashboard</span>
                  <span className="xs:hidden">Back</span>
                </Button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">
                      Products Management
                    </h1>
                    <p className="text-slate-600 text-xs sm:text-sm lg:text-base mt-1">
                      Manage your kitchenware catalog
                    </p>
                  </div>
                </div>
              </div>
              {user && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="truncate">Logged in as {user.username} ({user.role})</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={() => router.push('/admin/create')}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Create Product</span>
                <span className="xs:hidden">Create</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 h-11 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mobile-Optimized Product Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-700 truncate">Total Products</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{totalProducts}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-700 truncate">In Stock</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{inStockProducts}</p>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-red-700 truncate">Out of Stock</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{outOfStockProducts}</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hidden sm:block lg:block">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-700 truncate">Featured</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">{featuredProducts}</p>
                </div>
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hidden lg:block">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-orange-700 truncate">New</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">{newProducts}</p>
                </div>
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hidden lg:block">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-pink-700 truncate">On Sale</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-900">{saleProducts}</p>
                </div>
                <Tag className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          {/* Mobile-Optimized Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  <CardTitle className="text-base sm:text-lg">Filters & Search</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Find and filter products by name, category, brand, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-slate-700">Search Products</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search by product name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="h-10 sm:h-11 pl-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-slate-700">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-10 sm:h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-sm">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat?.id || ''} value={cat?.id?.toString() || ''}>
                            {cat?.name || ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-slate-700">Brand</Label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="h-10 sm:h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-sm">
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands?.map((b) => (
                          <SelectItem key={b?.id || ''} value={b?.id?.toString() || ''}>
                            {b?.name || ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-slate-700">Sort By</Label>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-10 sm:h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 flex-1 text-sm">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="stock">Stock</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="h-10 sm:h-11 w-10 sm:w-11 border-slate-200 hover:border-slate-300"
                      >
                        {sortOrder === 'asc' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mobile-Optimized Bulk Actions */}
          <AnimatePresence>
            {selectedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-orange-800">
                            {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                          </p>
                          <p className="text-xs text-orange-600">Ready for bulk operations</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProducts([])}
                          className="h-9 sm:h-10 border-orange-200 text-orange-700 hover:bg-orange-50 w-full sm:w-auto"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          <span className="hidden xs:inline">Clear Selection</span>
                          <span className="xs:hidden">Clear</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleBulkDelete}
                          className="h-9 sm:h-10 bg-red-500 hover:bg-red-600 w-full sm:w-auto"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          <span className="hidden xs:inline">Delete Selected</span>
                          <span className="xs:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile-Optimized View Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label className="text-xs sm:text-sm text-slate-600 font-medium">
                  Select All ({filteredProducts.length})
                </Label>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Label className="text-xs sm:text-sm text-slate-600 font-medium">View:</Label>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 sm:h-9 sm:w-9 p-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                >
                  <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 sm:h-9 sm:w-9 p-0 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Mobile-Optimized Products Display */}
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12">
                    <div className="text-center space-y-4 sm:space-y-6">
                      <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-700">No products found</h3>
                        <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base px-4">
                          {search || category !== 'all' || brand !== 'all' 
                            ? 'Try adjusting your filters or search terms to find what you\'re looking for'
                            : 'Get started by creating your first product to build your catalog'
                          }
                        </p>
                      </div>
                      {!search && category === 'all' && brand === 'all' && (
                        <Button 
                          onClick={() => router.push('/admin/create')} 
                          className="mt-4 sm:mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="hidden xs:inline">Create Your First Product</span>
                          <span className="xs:hidden">Create Product</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6' : 'space-y-3 sm:space-y-4'}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className={viewMode === 'list' ? 'w-full' : ''}
                  >
                                                                                <div className="relative group">
                      {/* Stock Status Badge */}
                      <div className="absolute top-2 right-2 z-10">
                            {product.stock === 0 ? (
                          <Badge className="bg-red-600 text-white border-0 shadow-sm text-xs px-1.5 py-0.5">
                            <X className="w-2 h-2 mr-1" />
                            Out of Stock
                              </Badge>
                            ) : product.stock < 10 ? (
                          <Badge className="bg-orange-600 text-white border-0 shadow-sm text-xs px-1.5 py-0.5">
                            <AlertTriangle className="w-2 h-2 mr-1" />
                            Low Stock
                              </Badge>
                            ) : (
                          <Badge className="bg-green-600 text-white border-0 shadow-sm text-xs px-1.5 py-0.5">
                            <Check className="w-2 h-2 mr-1" />
                            In Stock
                              </Badge>
                            )}
                          </div>

                      {/* Action Button */}
                      <div className="absolute bottom-2 right-2 z-20">
                            <Button
                              size="sm"
                              variant="outline"
                          className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg min-h-[32px] min-w-[32px] p-0 border-slate-200 text-slate-700 hover:border-slate-300"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            handleOpenActionModal(product)
                          }}
                          aria-label={`Actions for ${product.name}`}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>

                      {/* Product Card */}
                      <AdminProductCard 
                        product={product} 
                        viewMode={viewMode}
                        isSelected={selectedProducts.includes(product.id)}
                        onSelectionChange={handleSelectProduct}
                            />
                          </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
                        </div>

        {/* Action Modal */}
        <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Product Actions</DialogTitle>
              <DialogDescription>
                Choose an action for "{selectedProductForAction?.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
                              <Button
                onClick={handleActionEdit}
                className="w-full justify-start"
                                variant="outline"
                              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
                              </Button>
                              <Button
                onClick={handleActionDelete}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                variant="outline"
                              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
                              </Button>
                            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseActionModal}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
    <ProtectedRoute>
      <ProductsPage />
    </ProtectedRoute>
  );
} 