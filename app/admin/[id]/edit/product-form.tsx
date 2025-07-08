'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, Review, getImageUrl } from '@/lib/products';
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
        const { API_BASE_URL } = await import('@/lib/config');
        const [brandsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/brands`),
          fetch(`${API_BASE_URL}/categories`)
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
      return { ...prev, images: newImages };
    });
  };

  const handleSpecificationChange = (index: number, field: string, value: string | number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newSpecifications = [...prev.specifications];
      newSpecifications[index] = { ...newSpecifications[index], [field]: value };
      return { ...prev, specifications: newSpecifications };
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string | number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newFeatures = [...prev.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, features: newFeatures };
    });
  };

  const addImage = () => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newImage = {
        image_url: '',
        is_primary: prev.images.length === 0, // First image is primary by default
        display_order: prev.images.length
      };
      return { ...prev, images: [...prev.images, newImage] };
    });
  };

  const removeImage = (index: number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newImages = prev.images.filter((_, i) => i !== index);
      
      // If we removed the primary image and there are other images, make the first one primary
      if (prev.images[index].is_primary && newImages.length > 0) {
        newImages[0].is_primary = true;
      }
      
      return { ...prev, images: newImages };
    });
  };

  const addSpecification = () => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newSpec = {
        name: '',
        value: '',
        display_order: prev.specifications.length
      };
      return { ...prev, specifications: [...prev.specifications, newSpec] };
    });
  };

  const removeSpecification = (index: number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newSpecifications = prev.specifications.filter((_, i) => i !== index);
      return { ...prev, specifications: newSpecifications };
    });
  };

  const addFeature = () => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newFeature = {
        feature: '',
        display_order: prev.features.length
      };
      return { ...prev, features: [...prev.features, newFeature] };
    });
  };

  const removeFeature = (index: number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
      const newFeatures = prev.features.filter((_, i) => i !== index);
      return { ...prev, features: newFeatures };
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
        <div className="animate-spin rounded-full h-8 w-8 sm:h-32 sm:w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-sm sm:text-base text-gray-600">{error}</p>
          <Button onClick={() => router.push('/admin')} className="mt-4 min-h-[44px] px-6">
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-4">Product Not Found</h2>
          <Button onClick={() => router.push('/admin')} className="mt-4 min-h-[44px] px-6">
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Edit Product</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Update product information and details</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
            className="min-h-[44px] px-6"
          >
            Back to Admin
          </Button>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update the basic product details like name, description, and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm sm:text-base">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={product.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm sm:text-base">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price}
                  onChange={handleNumberInputChange}
                  placeholder="0.00"
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price" className="text-sm sm:text-base">Original Price</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.original_price}
                  onChange={handleNumberInputChange}
                  placeholder="0.00"
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm sm:text-base">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={handleNumberInputChange}
                  placeholder="0"
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm sm:text-base">Brand</Label>
                <Select
                  value={product.brand_id?.toString() || ''}
                  onValueChange={(value) => {
                    const brand = brands.find(b => b.id.toString() === value);
                    setProduct(prev => prev ? {
                      ...prev,
                      brand_id: parseInt(value) || 0,
                      brand: brand?.name || ''
                    } : initialProductState);
                  }}
                >
                  <SelectTrigger className="min-h-[44px]">
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
                <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
                <Select
                  value={product.category_id?.toString() || ''}
                  onValueChange={(value) => {
                    const category = categories.find(c => c.id.toString() === value);
                    setProduct(prev => prev ? {
                      ...prev,
                      category_id: parseInt(value) || 0,
                      category: category?.name || ''
                    } : initialProductState);
                  }}
                >
                  <SelectTrigger className="min-h-[44px]">
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_new" className="text-sm sm:text-base">New Product</Label>
                <Switch
                  id="is_new"
                  checked={product.is_new}
                  onCheckedChange={handleSwitchChange('is_new')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_sale" className="text-sm sm:text-base">On Sale</Label>
                <Switch
                  id="is_sale"
                  checked={product.is_sale}
                  onCheckedChange={handleSwitchChange('is_sale')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured" className="text-sm sm:text-base">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={product.is_featured}
                  onCheckedChange={handleSwitchChange('is_featured')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Product Images</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add and manage product images. The first image will be the primary image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.images.map((image, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm sm:text-base">Image URL {index + 1}</Label>
                  <Input
                    value={image.image_url}
                    onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                    placeholder="Enter image URL"
                    className="min-h-[44px]"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`primary-${index}`}
                      checked={image.is_primary}
                      onChange={(e) => handleImageChange(index, 'is_primary', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`primary-${index}`} className="text-sm">Primary Image</Label>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeImage(index)}
                  className="text-red-600 hover:text-red-700 min-h-[44px] px-4"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addImage} variant="outline" className="min-h-[44px] px-6">
              Add Image
            </Button>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Specifications</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add product specifications and technical details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm sm:text-base">Specification {index + 1}</Label>
                  <Input
                    value={spec.name}
                    onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                    placeholder="Specification name"
                    className="min-h-[44px]"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    placeholder="Specification value"
                    className="min-h-[44px]"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeSpecification(index)}
                  className="text-red-600 hover:text-red-700 min-h-[44px] px-4"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addSpecification} variant="outline" className="min-h-[44px] px-6">
              Add Specification
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Features</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add product features and highlights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm sm:text-base">Feature {index + 1}</Label>
                  <Input
                    value={feature.feature}
                    onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                    placeholder="Enter feature description"
                    className="min-h-[44px]"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700 min-h-[44px] px-4"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addFeature} variant="outline" className="min-h-[44px] px-6">
              Add Feature
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-h-[44px] px-8"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
} 