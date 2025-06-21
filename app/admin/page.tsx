'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product } from '../lib/api/products';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Search, Filter, Trash2, Edit, Eye, MoreVertical, Package, Plus, Check, X, AlertTriangle, MapPin } from 'lucide-react';
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
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

export default function AdminPage() {
  const router = useRouter();
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
          search: debouncedSearch,
          category: category === 'all' ? undefined : category,
          brand: brand === 'all' ? undefined : brand,
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
  }, [debouncedSearch, category, brand, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    // Extract unique categories and brands from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
      .map((name, index) => ({ id: index + 1, name }));
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)))
      .map((name, index) => ({ id: index + 1, name }));
    
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = debouncedSearch ? (
      (product.name?.toLowerCase() || '').includes(debouncedSearch.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(debouncedSearch.toLowerCase())
    ) : true;
    const matchesCategory = category === 'all' || product.category === category;
    const matchesBrand = brand === 'all' || product.brand === brand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-2 text-gray-600">Manage your product catalog with ease</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              onClick={() => router.push('/admin/orders')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Manage Orders
            </Button>
            <Button
              onClick={() => router.push('/admin/delivery-locations')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Delivery Locations
            </Button>
            <Button
              onClick={() => router.push('/admin/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
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
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Brand" />
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
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="created_at">Date Added</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
              </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-48' : 'w-full'}`}>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                  className="absolute top-2 left-2 z-10"
                />
                      <img
                        src={product.images?.[0]?.image_url || '/placeholder.png'}
                  alt={product.name}
                  className={`w-full ${viewMode === 'list' ? 'h-48' : 'h-64'} object-cover`}
                      />
                {product.is_new && (
                  <Badge className="absolute top-2 right-2 bg-blue-500">New</Badge>
                      )}
                {product.is_sale && (
                  <Badge className="absolute top-2 right-2 bg-red-500">Sale</Badge>
                      )}
                    </div>
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.original_price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {productToDelete?.name}? This action cannot be undone.
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