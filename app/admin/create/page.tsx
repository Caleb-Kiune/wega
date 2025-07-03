'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, ProductImage, ProductSpecification, ProductFeature, Review, getImageUrl } from '@/lib/products';
import apiClient from '@/lib/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { LogOut } from 'lucide-react';

type NewProductImage = Omit<ProductImage, 'id' | 'product_id'>;
type NewProductSpecification = Omit<ProductSpecification, 'id' | 'product_id'>;
type NewProductFeature = Omit<ProductFeature, 'id' | 'product_id'>;

type CreateProductData = {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku: string;
  stock: number;
  is_new: boolean;
  is_sale: boolean;
  is_featured: boolean;
  images: NewProductImage[];
  specifications: NewProductSpecification[];
  features: NewProductFeature[];
  brand_id?: number;
  category_id?: number;
  rating: number;
  review_count: number;
  image_url: string;
  reviews: Review[];
};

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

interface NewBrand {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

interface NewCategory {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

function CreateProductPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<Array<{ id: number; name: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreatingNewBrand, setIsCreatingNewBrand] = useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newProduct, setNewProduct] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    original_price: undefined,
    sku: '',
    stock: 0,
    is_new: false,
    is_sale: false,
    is_featured: false,
    images: [],
    specifications: [],
    features: [],
    brand_id: undefined,
    category_id: undefined,
    rating: 0,
    review_count: 0,
    image_url: '',
    reviews: []
  });

  const [newImage, setNewImage] = useState<NewProductImage>({
    image_url: '',
    is_primary: false,
    display_order: 0
  });

  const [newSpecification, setNewSpecification] = useState<NewProductSpecification>({
    name: '',
    value: '',
    display_order: 0
  });

  const [newFeature, setNewFeature] = useState<NewProductFeature>({
    feature: '',
    display_order: 0
  });

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          apiClient.get('/brands').then(res => res.data),
          apiClient.get('/categories').then(res => res.data)
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands and categories');
      }
    };

    fetchBrandsAndCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewImage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSpecification(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFeature(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addImage = () => {
    if (!newImage.image_url) return;
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, { ...newImage, display_order: prev.images.length }]
    }));
    setNewImage({ image_url: '', is_primary: false, display_order: 0 });
  };

  const removeImage = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (!newSpecification.name || !newSpecification.value) return;
    setNewProduct(prev => ({
      ...prev,
      specifications: [...prev.specifications, { ...newSpecification, display_order: prev.specifications.length }]
    }));
    setNewSpecification({ name: '', value: '', display_order: 0 });
  };

  const removeSpecification = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (!newFeature.feature) return;
    setNewProduct(prev => ({
      ...prev,
      features: [...prev.features, { ...newFeature, display_order: prev.features.length }]
    }));
    setNewFeature({ feature: '', display_order: 0 });
  };

  const removeFeature = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsCreatingNewBrand(true);
      setNewProduct(prev => ({ ...prev, brand_id: undefined }));
    } else {
      setIsCreatingNewBrand(false);
      const selectedBrand = brands.find(b => b.id === Number(value));
      setNewProduct(prev => ({
        ...prev,
        brand_id: selectedBrand?.id
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsCreatingNewCategory(true);
      setNewProduct(prev => ({ ...prev, category_id: undefined }));
    } else {
      setIsCreatingNewCategory(false);
      const selectedCategory = categories.find(c => c.id === Number(value));
      setNewProduct(prev => ({
        ...prev,
        category_id: selectedCategory?.id
      }));
    }
  };

  const handleNewBrandChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBrandName(value);
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategoryName(value);
  };

  const handleCreateBrand = async () => {
    try {
      if (!newBrandName) {
        setError('Brand name is required');
        return;
      }

      const response = await apiClient.post('/brands', { name: newBrandName });
      const createdBrand = response.data;
      
      setBrands(prev => [...prev, createdBrand]);
      setNewProduct(prev => ({
        ...prev,
        brand_id: createdBrand.id
      }));
      setIsCreatingNewBrand(false);
      setNewBrandName('');
    } catch (err) {
      console.error('Error creating brand:', err);
      setError(err instanceof Error ? err.message : 'Failed to create brand');
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName) {
        setError('Category name is required');
        return;
      }

      const response = await apiClient.post('/categories', { name: newCategoryName });
      const createdCategory = response.data;
      
      setCategories(prev => [...prev, createdCategory]);
      setNewProduct(prev => ({
        ...prev,
        category_id: createdCategory.id
      }));
      setIsCreatingNewCategory(false);
      setNewCategoryName('');
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      // Use Flask backend for uploads
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://washing-district-nail-customise.trycloudflare.com/api';
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Set the uploaded image URL
      setNewImage(prev => ({
        ...prev,
        image_url: result.url
      }));

      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form data:', newProduct);
    
    try {
      setSaving(true);
      
      // Validate required fields
      if (!newProduct.name) {
        console.log('Validation failed: Product name is required');
        toast.error('Product name is required');
        return;
      }
      if (!newProduct.price || newProduct.price < 0) {
        console.log('Validation failed: Valid price is required');
        toast.error('Valid price is required');
        return;
      }
      if (!newProduct.stock || newProduct.stock < 0) {
        console.log('Validation failed: Valid stock quantity is required');
        toast.error('Valid stock quantity is required');
        return;
      }
      if (!newProduct.brand_id) {
        console.log('Validation failed: Brand is required');
        toast.error('Brand is required');
        return;
      }
      if (!newProduct.category_id) {
        console.log('Validation failed: Category is required');
        toast.error('Category is required');
        return;
      }

      // Get brand and category names
      const selectedBrand = brands.find(b => b.id === newProduct.brand_id);
      const selectedCategory = categories.find(c => c.id === newProduct.category_id);

      if (!selectedBrand || !selectedCategory) {
        console.log('Validation failed: Invalid brand or category selected');
        toast.error('Invalid brand or category selected');
        return;
      }

      // Validate images
      if (newProduct.images.length === 0) {
        console.log('Validation failed: At least one product image is required');
        toast.error('Please add at least one product image. You can upload an image file or enter an image URL.');
        return;
      }
      for (const image of newProduct.images) {
        if (!image.image_url) {
          console.log('Validation failed: All images must have a URL');
          toast.error('All images must have a URL');
          return;
        }
      }

      // Validate specifications
      for (const spec of newProduct.specifications) {
        if (!spec.name || !spec.value) {
          console.log('Validation failed: All specifications must have a name and value');
          toast.error('All specifications must have a name and value');
          return;
        }
      }

      // Validate features
      for (const feature of newProduct.features) {
        if (!feature.feature) {
          console.log('Validation failed: All features must have text');
          toast.error('All features must have text');
          return;
        }
      }

      // Get the primary image URL or first image URL
      const primaryImage = newProduct.images.find(img => img.is_primary)?.image_url || newProduct.images[0]?.image_url;
      if (!primaryImage) {
        console.log('Validation failed: At least one image URL is required');
        toast.error('At least one image URL is required');
        return;
      }

      console.log('All validations passed, creating product...');

      const productData: Omit<Product, 'id'> = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        original_price: newProduct.original_price ? Number(newProduct.original_price) : undefined,
        sku: newProduct.sku,
        stock: Number(newProduct.stock),
        is_new: newProduct.is_new,
        is_sale: newProduct.is_sale,
        is_featured: newProduct.is_featured,
        brand: selectedBrand.name,
        category: selectedCategory.name,
        brand_id: newProduct.brand_id,
        category_id: newProduct.category_id,
        rating: newProduct.rating,
        review_count: newProduct.review_count,
        image_url: primaryImage,
        images: newProduct.images.map(img => ({
          image_url: img.image_url,
          is_primary: img.is_primary,
          display_order: img.display_order
        })),
        specifications: newProduct.specifications.map(spec => ({
          name: spec.name,
          value: spec.value,
          display_order: spec.display_order
        })),
        features: newProduct.features.map(feature => ({
          feature: feature.feature,
          display_order: feature.display_order
        })),
        reviews: []
      };

      console.log('Product data to send:', productData);

      await productsApi.create(productData);
      console.log('Product created successfully');
      toast.success('Product created successfully');
      router.push('/admin');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Product</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Add a new product to your catalog with images, specifications, and features
            </p>
            {user && (
              <p className="text-xs text-muted-foreground mt-1">
                Logged in as: {user.username} ({user.role})
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {newProduct.is_new && <Badge variant="default">New</Badge>}
            {newProduct.is_sale && <Badge variant="destructive">Sale</Badge>}
            {newProduct.is_featured && <Badge variant="secondary">Featured</Badge>}
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

      {error && (
        <Card className="mb-4 sm:mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load required data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/admin')} variant="outline" className="w-full min-h-[44px] text-base">
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Essential product details like name, SKU, pricing, and categorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="min-h-[44px] text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={newProduct.sku}
                      onChange={handleInputChange}
                  placeholder="Product SKU"
                  className="min-h-[44px] text-base"
                  required
                    />
                  </div>

                    <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newProduct.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="min-h-[44px] text-base"
                  required
                            />
                          </div>

                          <div className="space-y-2">
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  value={newProduct.original_price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="min-h-[44px] text-base"
                            />
                          </div>

                          <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={newProduct.stock || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="min-h-[44px] text-base"
                  required
                            />
                          </div>

                          <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={selectedBrand?.toString() || ''}
                  onValueChange={(value) => {
                    const brand = brands.find(b => b.id.toString() === value);
                    setSelectedBrand(brand ? brand.id : null);
                    setNewProduct(prev => ({ ...prev, brand_id: brand ? brand.id : undefined }));
                  }}
                >
                  <SelectTrigger className="min-h-[44px] text-base">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                      </SelectItem>
                          ))}
                  </SelectContent>
                </Select>
                    </div>

                    <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory?.toString() || ''}
                  onValueChange={(value) => {
                    const category = categories.find(c => c.id.toString() === value);
                    setSelectedCategory(category ? category.id : null);
                    setNewProduct(prev => ({ ...prev, category_id: category ? category.id : undefined }));
                  }}
                >
                  <SelectTrigger className="min-h-[44px] text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                      </SelectItem>
                          ))}
                  </SelectContent>
                </Select>
                    </div>
                  </div>

                    <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                        onChange={handleInputChange}
                placeholder="Enter detailed product description..."
                rows={4}
                className="resize-none min-h-[44px] text-base"
                        required
                      />
                    </div>
          </CardContent>
        </Card>

        {/* Product Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Product Status</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Configure product visibility and promotional settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Switch
                  id="is_new"
                  checked={newProduct.is_new}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, is_new: checked }))}
                />
                <div className="space-y-1">
                  <Label htmlFor="is_new" className="text-sm font-medium">New Product</Label>
                  <p className="text-xs text-muted-foreground">Mark as newly added</p>
                  </div>
                </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Switch
                  id="is_sale"
                  checked={newProduct.is_sale}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, is_sale: checked }))}
                />
                <div className="space-y-1">
                  <Label htmlFor="is_sale" className="text-sm font-medium">On Sale</Label>
                  <p className="text-xs text-muted-foreground">Display sale badge</p>
                    </div>
                  </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Switch
                  id="is_featured"
                        checked={newProduct.is_featured}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, is_featured: checked }))}
                      />
                <div className="space-y-1">
                  <Label htmlFor="is_featured" className="text-sm font-medium">Featured</Label>
                  <p className="text-xs text-muted-foreground">Highlight on homepage</p>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>

            {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Product Images</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Upload and manage product images. At least one image is required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            {/* Upload New Image */}
                <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Add New Image</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* File Upload */}
                    <div className="space-y-4">
                  <Label>Upload Image</Label>
                      <div
                    className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
                          dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                        } ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingImage}
                        />
                    <div className="space-y-3">
                          <svg
                        className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary hover:text-primary/80">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
                        </div>
                        {uploadingImage && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                        <div className="text-sm text-muted-foreground">Uploading...</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* URL Input */}
                    <div className="space-y-4">
                  <Label>Or Enter Image URL</Label>
                      <div className="space-y-2">
                    <Input
                          name="image_url"
                          value={newImage.image_url}
                          onChange={handleImageChange}
                          placeholder="https://example.com/image.jpg"
                      className="min-h-[44px] text-base"
                        />
                    <p className="text-xs text-muted-foreground">Enter a direct link to an image</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {newImage.image_url && (
                <div className="space-y-3">
                  <Label>Preview</Label>
                      <div className="relative inline-block">
                        <img
                          src={getImageUrl(newImage.image_url)}
                          alt="Preview"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-border shadow-sm"
                        />
                    <Button
                      variant="destructive"
                      size="sm"
                          onClick={() => setNewImage(prev => ({ ...prev, image_url: '' }))}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 min-h-[44px] min-w-[44px]"
                    >
                      ×
                    </Button>
                      </div>
                    </div>
                  )}

              {/* Add Image Button */}
              {newImage.image_url && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new-image-primary"
                        checked={newImage.is_primary}
                      onCheckedChange={(checked) => setNewImage(prev => ({ ...prev, is_primary: checked }))}
                    />
                    <Label htmlFor="new-image-primary">Set as Primary</Label>
                  </div>
                  <Button
                      onClick={addImage}
                    disabled={!newImage.image_url}
                    className="min-h-[44px] text-base"
                    >
                      Add Image
                  </Button>
                  </div>
              )}
                </div>

            <Separator />

            {/* Existing Images */}
                  <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Added Images</h3>
              {newProduct.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getImageUrl(image.image_url)}
                            alt={`Product image ${index + 1}`}
                        className="w-full h-20 sm:h-24 object-cover rounded-lg border border-border shadow-sm"
                          />
                          {image.is_primary && (
                        <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 text-xs">
                              Primary
                        </Badge>
                          )}
                      <Button
                        variant="destructive"
                        size="sm"
                            onClick={() => removeImage(index)}
                        className="absolute top-1 left-1 sm:top-2 sm:left-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-h-[44px] min-w-[44px]"
                      >
                        ×
                      </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                <div className="text-center py-8 sm:py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  <p className="text-sm text-muted-foreground mb-2">No images added yet</p>
                  <p className="text-xs text-muted-foreground">Upload images above to get started</p>
                  </div>
                )}
              </div>
          </CardContent>
        </Card>

            {/* Specifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Specifications</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add product specifications like dimensions, materials, and technical details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Add New Specification */}
              <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Add New Specification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                      name="name"
                      value={newSpecification.name}
                      onChange={handleSpecificationChange}
                    placeholder="e.g., Material, Size, Weight"
                    className="min-h-[44px] text-base"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label>Value</Label>
                  <div className="flex gap-2">
                    <Input
                        name="value"
                        value={newSpecification.value}
                        onChange={handleSpecificationChange}
                      placeholder="e.g., Stainless Steel, 10 inches, 2.5 lbs"
                      className="flex-1 min-h-[44px] text-base"
                      />
                    <Button
                        onClick={addSpecification}
                      disabled={!newSpecification.name || !newSpecification.value}
                      className="whitespace-nowrap min-h-[44px] text-base"
                      >
                        Add
                    </Button>
                  </div>
                    </div>
                  </div>
                </div>

            <Separator />

            {/* Existing Specifications */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Added Specifications</h3>
              {newProduct.specifications.length > 0 ? (
                <div className="space-y-3">
                  {newProduct.specifications.map((spec, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-muted/50 rounded-lg">
                      <Input
                        value={spec.name}
                        onChange={(e) => {
                          const newSpecs = [...newProduct.specifications];
                          newSpecs[index] = { ...newSpecs[index], name: e.target.value };
                          setNewProduct(prev => ({ ...prev, specifications: newSpecs }));
                        }}
                        placeholder="Specification name"
                        className="flex-1 min-h-[44px] text-base"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => {
                          const newSpecs = [...newProduct.specifications];
                          newSpecs[index] = { ...newSpecs[index], value: e.target.value };
                          setNewProduct(prev => ({ ...prev, specifications: newSpecs }));
                        }}
                        placeholder="Specification value"
                        className="flex-1 min-h-[44px] text-base"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => removeSpecification(index)}
                        size="sm"
                        className="min-h-[44px] text-base"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-muted-foreground mb-2">No specifications added yet</p>
                  <p className="text-xs text-muted-foreground">Add specifications above to get started</p>
              </div>
              )}
            </div>
          </CardContent>
        </Card>

            {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Features</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Highlight key product features and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Add New Feature */}
              <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Add New Feature</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                  <Label>Feature</Label>
                  <Input
                      name="feature"
                      value={newFeature.feature}
                      onChange={handleFeatureChange}
                    placeholder="e.g., Dishwasher safe, Non-stick coating, Heat resistant"
                    className="min-h-[44px] text-base"
                    />
                  </div>
                  <div className="flex items-end">
                  <Button
                      onClick={addFeature}
                    disabled={!newFeature.feature}
                    className="whitespace-nowrap min-h-[44px] text-base"
                    >
                      Add Feature
                  </Button>
                </div>
                  </div>
                </div>

            <Separator />

            {/* Existing Features */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Added Features</h3>
              {newProduct.features.length > 0 ? (
                <div className="space-y-3">
                  {newProduct.features.map((feature, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center flex-1">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <Input
                          value={feature.feature}
                          onChange={(e) => {
                            const newFeatures = [...newProduct.features];
                            newFeatures[index] = { ...newFeatures[index], feature: e.target.value };
                            setNewProduct(prev => ({ ...prev, features: newFeatures }));
                          }}
                          placeholder="Feature description"
                          className="flex-1 min-h-[44px] text-base"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeFeature(index)}
                        size="sm"
                        className="min-h-[44px] text-base"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-muted-foreground mb-2">No features added yet</p>
                  <p className="text-xs text-muted-foreground">Add features above to get started</p>
              </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t">
          <Button
            variant="outline"
                onClick={() => router.push('/admin')}
            className="px-6 sm:px-8 min-h-[44px] text-base"
              >
                Cancel
          </Button>
          <Button
                type="submit"
            disabled={saving}
            className="px-6 sm:px-8 min-h-[44px] text-base"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
            </div>
          </form>
    </div>
  );
}

export default function CreateProductPageWrapper() {
  return (
    <ProtectedRoute>
      <CreateProductPage />
    </ProtectedRoute>
  );
} 