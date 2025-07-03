'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, getImageUrl } from '@/lib/products';
import { Product } from '@/shared/types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Grid, List, Search, Filter, Trash2, Edit, Eye, MoreVertical, Package, Plus, Check, X, AlertTriangle, MapPin, Settings, LogOut } from 'lucide-react';
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

function AdminPage() {
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-medium text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load products</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage your product catalog with ease. View, edit, and organize your products.
            </p>
            {user && (
              <p className="text-xs text-muted-foreground mt-1">
                Logged in as: {user.username} ({user.role})
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={() => router.push('/admin/orders')}
              variant="outline"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] text-sm sm:text-base"
            >
              <Package className="h-4 w-4" />
              Orders
            </Button>
            <Button
              onClick={() => router.push('/admin/delivery-locations')}
              variant="outline"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] text-sm sm:text-base"
            >
              <MapPin className="h-4 w-4" />
              Delivery
            </Button>
            <Button
              onClick={() => router.push('/admin/create')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 min-h-[44px] text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Product
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] text-sm sm:text-base border-red-200 text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Filters & Search</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Find and filter products by name, category, brand, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search Products</Label>
                <Input
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="h-10 min-h-[44px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 min-h-[44px] text-base">
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
                <Label className="text-sm font-medium">Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-10 min-h-[44px] text-base">
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
                <Label className="text-sm font-medium">Sort By</Label>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 min-h-[44px] text-base flex-1">
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
                    className="h-10 w-10 min-h-[44px] min-w-[44px]"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-orange-600" />
                    <p className="text-sm font-medium text-orange-800">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProducts([])}
                    className="h-9 min-h-[44px] text-sm sm:text-base"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="h-9 min-h-[44px] text-sm sm:text-base"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label className="text-sm text-muted-foreground">
                Select All ({filteredProducts.length})
              </Label>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">View:</Label>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">No products found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {search || category !== 'all' || brand !== 'all' 
                      ? 'Try adjusting your filters or search terms'
                      : 'Get started by creating your first product'
                    }
                  </p>
                </div>
                {!search && category === 'all' && brand === 'all' && (
                  <Button onClick={() => router.push('/admin/create')} className="mt-4 min-h-[44px] text-sm sm:text-base">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' : 'space-y-4'}>
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`group transition-all duration-200 hover:shadow-lg ${
                  viewMode === 'list' ? 'flex' : ''
                } ${selectedProducts.includes(product.id) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-32 sm:w-48' : 'w-full'}`}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    className="absolute top-2 right-2 z-10 h-4 w-4 rounded border-gray-300 bg-white shadow-sm"
                  />
                  <img
                    src={getImageUrl(product.images?.[0]?.image_url) || '/placeholder.png'}
                    alt={product.name}
                    className={`w-full ${viewMode === 'list' ? 'h-32 sm:h-48' : 'h-40 sm:h-48'} object-cover rounded-t-lg`}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.png';
                    }}
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {product.is_new && (
                      <Badge className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md transform hover:scale-105 transition-transform duration-200 font-medium">
                        ✨ New
                      </Badge>
                    )}
                    {product.is_sale && (
                      <Badge className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md transform hover:scale-105 transition-transform duration-200 font-medium">
                        🔥 Sale
                      </Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md transform hover:scale-105 transition-transform duration-200 font-medium">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className={`p-3 sm:p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      {product.category && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-blue-100 text-blue-800 border-blue-200">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          KES {product.price.toLocaleString()}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            KES {product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Badge 
                        variant={product.stock > 0 ? 'default' : 'destructive'}
                        className={`text-xs shadow-md ${
                          product.stock > 0 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0'
                        }`}
                      >
                        {product.stock > 0 ? `📦 ${product.stock} in stock` : '❌ Out of stock'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * 100) + 1} to {Math.min(currentPage * 100, filteredProducts.length)} of {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 min-h-[44px] text-sm sm:text-base"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 min-h-[44px] text-sm sm:text-base"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPageWrapper() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
} 