'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, Review, getImageUrl } from '@/app/lib/api/products';
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

interface ExtendedProduct extends Product {
  images: Array<{
    id?: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  specifications: Array<{
    id?: number;
    name: string;
    value: string;
    display_order: number;
  }>;
  features: Array<{
    id?: number;
    feature: string;
    display_order: number;
  }>;
}

interface ProductWithReviews extends ExtendedProduct {
  reviews: Review[];
}

interface ProductFormProps {
  productId: number;
}

interface Brand {
  id: number;
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

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const initialProductState: ProductWithReviews = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    original_price: 0,
    sku: '',
    stock: 0,
    is_new: false,
    is_sale: false,
    is_featured: false,
    brand: '',
    category: '',
    brand_id: 0,
    category_id: 0,
    rating: 0,
    review_count: 0,
    image_url: '',
    images: [],
    specifications: [],
    features: [],
    reviews: []
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching product data for ID:', productId);
        
        const data = await productsApi.getById(productId);
        console.log('📦 Raw product data from API:', data);
        console.log('📋 Specifications count:', data?.specifications?.length || 0);
        console.log('📋 Features count:', data?.features?.length || 0);
        
        // Ensure all fields have proper default values if they are null/undefined
        const sanitizedData = data ? {
          ...data,
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          original_price: data.original_price || 0,
          sku: data.sku || '',
          stock: data.stock || 0,
          is_new: data.is_new || false,
          is_sale: data.is_sale || false,
          is_featured: data.is_featured || false,
          brand: data.brand || '',
          category: data.category || '',
          brand_id: data.brand_id || 0,
          category_id: data.category_id || 0,
          rating: data.rating || 0,
          review_count: data.review_count || 0,
          image_url: data.image_url || '',
          images: data.images || [],
          specifications: data.specifications || [],
          features: data.features || [],
          reviews: data.reviews || []
        } : initialProductState;
        
        console.log('✅ Sanitized product data:', sanitizedData);
        console.log('✅ Final specifications:', sanitizedData.specifications);
        console.log('✅ Final features:', sanitizedData.features);
        
        setProduct(sanitizedData);
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        setError('Failed to fetch product');
        setProduct(initialProductState);
      } finally {
        setLoading(false);
      }
    };

    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/brands'),
          fetch('http://localhost:5000/api/categories')
        ]);
        
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData);
        }
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching brands and categories:', error);
      }
    };

    if (productId) {
      fetchProduct();
      fetchBrandsAndCategories();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => prev ? { ...prev, [name]: value } : initialProductState);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    setProduct(prev => prev ? { ...prev, [name]: numValue } : initialProductState);
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setProduct(prev => prev ? { ...prev, [name]: checked } : initialProductState);
  };

  const handleImageChange = (index: number, field: string, value: string | boolean | number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newImages = [...prev.images];
      
      if (field === 'is_primary' && value === true) {
        // Set all other images to non-primary
        newImages.forEach((img, idx) => {
          if (idx !== index) {
            img.is_primary = false;
          }
        });
      }
      
      newImages[index] = { ...newImages[index], [field]: value };
      
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleSpecificationChange = (index: number, field: string, value: string | number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newSpecifications = [...prev.specifications];
      newSpecifications[index] = { ...newSpecifications[index], [field]: value };
      return {
        ...prev,
        specifications: newSpecifications
      };
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string | number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newFeatures = [...prev.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return {
        ...prev,
        features: newFeatures
      };
    });
  };

  const removeImage = (index: number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newImages = [...prev.images];
      const removedImage = newImages[index];
      
      // Remove the image
      newImages.splice(index, 1);
      
      // Update display_order for remaining images
      newImages.forEach((img, idx) => {
        img.display_order = idx;
      });
      
      // If the removed image was primary and there are remaining images, set the first one as primary
      if (removedImage.is_primary && newImages.length > 0) {
        newImages[0].is_primary = true;
      }
      
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const removeSpecification = (index: number) => {
    console.log('🗑️ Removing specification at index:', index);
    
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newSpecifications = [...prev.specifications];
      newSpecifications.splice(index, 1);
      // Update display_order for remaining specifications
      newSpecifications.forEach((spec, idx) => {
        spec.display_order = idx;
      });
      return {
        ...prev,
        specifications: newSpecifications
      };
    });
  };

  const removeFeature = (index: number) => {
    console.log('🗑️ Removing feature at index:', index);
    
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      // Update display_order for remaining features
      newFeatures.forEach((feature, idx) => {
        feature.display_order = idx;
      });
      return {
        ...prev,
        features: newFeatures
      };
    });
  };

  const handleSave = async () => {
    if (!product) return;

    try {
      setSaving(true);
      
      console.log('🔄 Starting product update...');
      console.log('📦 Original product data:', product);
      
      // Filter out empty specifications
      const validSpecifications = product.specifications.filter(
        spec => spec.name.trim() !== '' && spec.value.trim() !== ''
      );

      // Filter out empty features
      const validFeatures = product.features.filter(
        feature => feature.feature.trim() !== ''
      );

      // Filter out empty images
      const validImages = product.images.filter(
        image => image.image_url.trim() !== ''
      );

      // Validate that at least one image is primary
      const hasPrimaryImage = validImages.some(image => image.is_primary);
      if (validImages.length > 0 && !hasPrimaryImage) {
        toast.error('At least one image must be set as primary');
        setSaving(false);
        return;
      }

      console.log('✅ Valid specifications:', validSpecifications);
      console.log('✅ Valid features:', validFeatures);
      console.log('✅ Valid images:', validImages);
      console.log('✅ Has primary image:', hasPrimaryImage);

      // Create product data, excluding invalid brand/category IDs
      const productToUpdate: any = {
        ...product,
        specifications: validSpecifications,
        features: validFeatures,
        images: validImages
      };

      // Only include brand_id if it's a valid ID (not 0)
      if (product.brand_id && product.brand_id > 0) {
        productToUpdate.brand_id = product.brand_id;
      } else {
        delete productToUpdate.brand_id;
      }

      // Only include category_id if it's a valid ID (not 0)
      if (product.category_id && product.category_id > 0) {
        productToUpdate.category_id = product.category_id;
      } else {
        delete productToUpdate.category_id;
      }

      console.log('📤 Sending update data:', productToUpdate);

      const updatedProduct = await productsApi.update(product.id, productToUpdate);
      console.log('✅ Product updated successfully:', updatedProduct);
      
      toast.success('Product updated successfully');
      router.push('/admin');
    } catch (error) {
      console.error('❌ Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => router.push('/admin')} className="mt-4">
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h2>
          <Button onClick={() => router.push('/admin')} className="mt-4">
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information and details</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            Back to Admin
          </Button>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic product details like name, description, and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={product.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price}
                  onChange={handleNumberInputChange}
                  placeholder="0.00"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.original_price}
                  onChange={handleNumberInputChange}
                  placeholder="0.00"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={handleNumberInputChange}
                  placeholder="0"
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={product.brand_id?.toString() || ''}
                  onValueChange={(value) => {
                    const brandId = parseInt(value);
                    const selectedBrand = brands.find(b => b.id === brandId);
                    setProduct(prev => prev ? {
                      ...prev,
                      brand_id: brandId,
                      brand: selectedBrand?.name || ''
                    } : initialProductState);
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select brand" />
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
                  value={product.category_id?.toString() || ''}
                  onValueChange={(value) => {
                    const categoryId = parseInt(value);
                    const selectedCategory = categories.find(c => c.id === categoryId);
                    setProduct(prev => prev ? {
                      ...prev,
                      category_id: categoryId,
                      category: selectedCategory?.name || ''
                    } : initialProductState);
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select category" />
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

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_new"
                  checked={product.is_new}
                  onCheckedChange={handleSwitchChange('is_new')}
                />
                <Label htmlFor="is_new">New Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_sale"
                  checked={product.is_sale}
                  onCheckedChange={handleSwitchChange('is_sale')}
                />
                <Label htmlFor="is_sale">On Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={product.is_featured}
                  onCheckedChange={handleSwitchChange('is_featured')}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Manage product images. At least one image must be set as primary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Images</h3>
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(image.image_url)}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border shadow-sm"
                          onError={(e) => {
                            console.error('Failed to load image:', image.image_url);
                            e.currentTarget.src = '/placeholder.png';
                          }}
                        />
                        {image.is_primary && (
                          <Badge className="absolute top-2 right-2 text-xs">
                            Primary
                          </Badge>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 left-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Image Controls */}
                  <div className="space-y-3">
                    {product.images.map((image, index) => (
                      <div key={`controls-${index}`} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                          Image {index + 1}
                        </span>
                        <Input
                          value={image.image_url || ''}
                          onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                          placeholder="Image URL"
                          className="flex-1 h-9 text-sm"
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={image.is_primary || false}
                            onCheckedChange={(checked) => handleImageChange(index, 'is_primary', checked)}
                          />
                          <Label className="text-sm">
                            {image.is_primary ? 'Primary' : 'Set as Primary'}
                          </Label>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          size="sm"
                          className="h-9 px-3"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-muted-foreground mb-2">No images available</p>
                  <p className="text-xs text-muted-foreground">Images can only be added during product creation</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Specifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>
              Edit product specifications like dimensions, materials, and technical details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Specifications</h3>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                      <Input
                        value={spec.name || ''}
                        onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                        placeholder="Specification name"
                        className="flex-1 h-10"
                      />
                      <Input
                        value={spec.value || ''}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="Specification value"
                        className="flex-1 h-10"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => removeSpecification(index)}
                        size="sm"
                        className="h-10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-muted-foreground mb-2">No specifications available</p>
                  <p className="text-xs text-muted-foreground">Specifications can only be added during product creation</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Edit key product features and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Features</h3>
              {product.features && product.features.length > 0 ? (
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center flex-1">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <Input
                          value={feature.feature || ''}
                          onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                          placeholder="Feature description"
                          className="flex-1 h-10"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeFeature(index)}
                        size="sm"
                        className="h-10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-muted-foreground mb-2">No features available</p>
                  <p className="text-xs text-muted-foreground">Features can only be added during product creation</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-8"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 