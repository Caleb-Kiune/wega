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
        setProduct(data || initialProductState);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product');
        setProduct(initialProductState);
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
      [name]: value || ''
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
        [field]: value || ''
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
        [field]: value || ''
      };
      return {
        ...currentProduct,
        features: newFeatures
      };
    });
  };

  const addImage = () => {
    setProduct(prev => ({
      ...(prev || initialProductState),
      images: [
        ...(prev?.images || []),
        {
          image_url: '',
          is_primary: (prev?.images || []).length === 0,
          display_order: (prev?.images || []).length
        }
      ]
    }));
  };

  const removeImage = (index: number) => {
    setProduct(prev => {
      if (!prev) return initialProductState;
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
    setProduct(prev => ({
      ...(prev || initialProductState),
      specifications: [
        ...(prev?.specifications || []),
        {
          name: '',
          value: '',
          display_order: (prev?.specifications || []).length
        }
      ]
    }));
  };

  const removeSpecification = (index: number) => {
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

  const addFeature = () => {
    setProduct(prev => ({
      ...(prev || initialProductState),
      features: [
        ...(prev?.features || []),
        {
          feature: '',
          display_order: (prev?.features || []).length
        }
      ]
    }));
  };

  const removeFeature = (index: number) => {
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
      const updatedProduct = await productsApi.update(product.id, product);
      toast.success('Product updated successfully');
      router.push('/crud');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentProduct = product || initialProductState;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              placeholder="Product name"
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={currentProduct.sku}
              onChange={handleInputChange}
              placeholder="Product SKU"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={currentProduct.price}
              onChange={handleNumberInputChange}
              placeholder="Product price"
            />
          </div>

          <div>
            <Label htmlFor="original_price">Original Price</Label>
            <Input
              id="original_price"
              name="original_price"
              type="number"
              value={currentProduct.original_price}
              onChange={handleNumberInputChange}
              placeholder="Original price"
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={currentProduct.stock}
              onChange={handleNumberInputChange}
              placeholder="Stock quantity"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={currentProduct.description}
            onChange={handleInputChange}
            placeholder="Product description"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_new"
              checked={currentProduct.is_new}
              onCheckedChange={handleSwitchChange('is_new')}
            />
            <Label htmlFor="is_new">New Product</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_sale"
              checked={currentProduct.is_sale}
              onCheckedChange={handleSwitchChange('is_sale')}
            />
            <Label htmlFor="is_sale">On Sale</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={currentProduct.is_featured}
              onCheckedChange={handleSwitchChange('is_featured')}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="space-y-4">
            {currentProduct.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Input
                  value={image.image_url}
                  onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                  placeholder="Image URL"
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={image.is_primary}
                    onCheckedChange={(checked) => handleImageChange(index, 'is_primary', checked)}
                  />
                  <Label>Primary</Label>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addImage}>Add Image</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="space-y-4">
            {currentProduct.specifications.map((spec, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Input
                  value={spec.name}
                  onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                  placeholder="Specification name"
                />
                <Input
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  placeholder="Specification value"
                />
                <Button
                  variant="destructive"
                  onClick={() => removeSpecification(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addSpecification}>Add Specification</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="space-y-4">
            {currentProduct.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Input
                  value={feature.feature}
                  onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                  placeholder="Feature"
                />
                <Button
                  variant="destructive"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addFeature}>Add Feature</Button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/crud')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
} 