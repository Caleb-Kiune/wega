'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, Review } from '@/app/lib/api/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
        const data = await productsApi.getById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...(prev || initialProductState),
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...(prev || initialProductState),
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setProduct(prev => ({
      ...(prev || initialProductState),
      [name]: checked
    }));
  };

  const handleImageChange = (index: number, field: string, value: string | boolean | number) => {
    setProduct(prev => {
      const currentProduct = prev || initialProductState;
      const newImages = [...currentProduct.images];
      newImages[index] = {
        ...newImages[index],
        [field]: value
      };
      return {
        ...currentProduct,
        images: newImages
      };
    });
  };

  const handleSpecificationChange = (index: number, field: string, value: string | number) => {
    setProduct(prev => {
      const currentProduct = prev || initialProductState;
      const newSpecifications = [...currentProduct.specifications];
      newSpecifications[index] = {
        ...newSpecifications[index],
        [field]: value
      };
      return {
        ...currentProduct,
        specifications: newSpecifications
      };
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string | number) => {
    setProduct(prev => {
      const currentProduct = prev || initialProductState;
      const newFeatures = [...currentProduct.features];
      newFeatures[index] = {
        ...newFeatures[index],
        [field]: value
      };
      return {
        ...currentProduct,
        features: newFeatures
      };
    });
  };

  const addImage = () => {
    setProduct(prev => prev ? {
      ...prev,
      images: [
        ...prev.images,
        {
          image_url: '',
          is_primary: prev.images.length === 0,
          display_order: prev.images.length
        }
      ]
    } : null);
  };

  const removeImage = (index: number) => {
    setProduct(prev => {
      if (!prev) return null;
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      // Update display_order for remaining images
      newImages.forEach((img, idx) => {
        img.display_order = idx;
      });
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const addSpecification = () => {
    setProduct(prev => prev ? {
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          name: '',
          value: '',
          display_order: prev.specifications.length
        }
      ]
    } : null);
  };

  const removeSpecification = (index: number) => {
    setProduct(prev => {
      if (!prev) return null;
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

  const addFeature = () => {
    setProduct(prev => prev ? {
      ...prev,
      features: [
        ...prev.features,
        {
          feature: '',
          display_order: prev.features.length
        }
      ]
    } : null);
  };

  const removeFeature = (index: number) => {
    setProduct(prev => {
      if (!prev) return null;
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
      setError(null);

      // Get the primary image URL
      const primaryImage = product.images.find(img => img.is_primary)?.image_url;
      if (!primaryImage) {
        throw new Error('At least one image must be set as primary');
      }

      const updateData = {
        ...product,
        image_url: primaryImage,
        images: product.images.map(img => ({
          image_url: img.image_url,
          is_primary: img.is_primary,
          display_order: img.display_order
        })),
        specifications: product.specifications.map(spec => ({
          name: spec.name,
          value: spec.value,
          display_order: spec.display_order
        })),
        features: product.features.map(feature => ({
          feature: feature.feature,
          display_order: feature.display_order
        }))
      };

      await productsApi.update(productId, updateData);
      toast.success('Product updated successfully');
      router.push('/crud');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to update product');
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-2 text-gray-600">Update product information</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              onClick={() => router.push('/crud')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={product.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleNumberInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  value={product.original_price}
                  onChange={handleNumberInputChange}
                  placeholder="Enter original price"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={product.stock}
                  onChange={handleNumberInputChange}
                  placeholder="Enter stock quantity"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={product.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label htmlFor="brand_id">Brand ID</Label>
                <Input
                  id="brand_id"
                  name="brand_id"
                  type="number"
                  value={product.brand_id}
                  onChange={handleNumberInputChange}
                  placeholder="Enter brand ID"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="category_id">Category ID</Label>
                <Input
                  id="category_id"
                  name="category_id"
                  type="number"
                  value={product.category_id}
                  onChange={handleNumberInputChange}
                  placeholder="Enter category ID"
                  min="0"
                />
              </div>
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
                <Label htmlFor="is_featured">Featured Product</Label>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Product Images</h2>
              <Button onClick={addImage} variant="outline">
                Add Image
              </Button>
            </div>
            <div className="space-y-4">
              {product.images.map((image, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={image.image_url}
                        onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={image.is_primary}
                        onCheckedChange={(checked) => handleImageChange(index, 'is_primary', checked)}
                      />
                      <Label>Primary Image</Label>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeImage(index)}
                    variant="destructive"
                    className="mt-4"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <Button onClick={addSpecification} variant="outline">
                Add Specification
              </Button>
            </div>
            <div className="space-y-4">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={spec.name}
                        onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                        placeholder="Enter specification name"
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="Enter specification value"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => removeSpecification(index)}
                    variant="destructive"
                    className="mt-4"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <Button onClick={addFeature} variant="outline">
                Add Feature
              </Button>
            </div>
            <div className="space-y-4">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Feature</Label>
                    <Input
                      value={feature.feature}
                      onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                      placeholder="Enter feature"
                    />
                  </div>
                  <Button
                    onClick={() => removeFeature(index)}
                    variant="destructive"
                    className="mt-4"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 