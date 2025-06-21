'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, Review } from '@/app/lib/api/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// New specification and feature types for input fields
interface NewSpecification {
  name: string;
  value: string;
  display_order: number;
}

interface NewFeature {
  feature: string;
  display_order: number;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImagePrimary, setNewImagePrimary] = useState(false);

  // New state variables for adding specifications and features
  const [newSpecification, setNewSpecification] = useState<NewSpecification>({
    name: '',
    value: '',
    display_order: 0
  });

  const [newFeature, setNewFeature] = useState<NewFeature>({
    feature: '',
    display_order: 0
  });

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
    console.log(`🔄 handleImageChange - Index: ${index}, Field: ${field}, Value: ${value}`);
    
    setProduct(prev => {
      const currentProduct = prev || initialProductState;
      const newImages = [...currentProduct.images];
      
      // If setting an image as primary, ensure all other images are set to non-primary
      if (field === 'is_primary' && value === true) {
        console.log(`🎯 Setting image ${index} as primary, setting all others to non-primary`);
        newImages.forEach((img, i) => {
          img.is_primary = i === index;
          console.log(`  Image ${i}: is_primary = ${img.is_primary}`);
        });
      } else {
        // For other fields, just update the specific image
        console.log(`📝 Updating image ${index} field '${field}' to '${value}'`);
        newImages[index] = {
          ...newImages[index],
          [field]: value ?? (field === 'image_url' ? '' : value)
        };
      }
      
      console.log('✅ Updated images:', newImages.map((img, i) => ({ index: i, url: img.image_url, is_primary: img.is_primary })));
      
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
        [field]: value ?? (typeof value === 'string' ? '' : value)
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
        [field]: value ?? (typeof value === 'string' ? '' : value)
      };
      return {
        ...currentProduct,
        features: newFeatures
      };
    });
  };

  // New handlers for adding specifications and features
  const handleNewSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSpecification(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFeature(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addImage = () => {
    if (!newImageUrl) return;
    
    console.log('➕ Adding image to product:', newImageUrl);
    
    setProduct(prev => {
      const currentProduct = prev || initialProductState;
      const existingImages = [...currentProduct.images];
      
      // If the new image should be primary, set all existing images to non-primary
      if (newImagePrimary) {
        existingImages.forEach(img => {
          img.is_primary = false;
        });
      }
      
      const newImage = {
        image_url: newImageUrl,
        is_primary: newImagePrimary || existingImages.length === 0,
        display_order: existingImages.length
      };
      
      return {
        ...currentProduct,
        images: [...existingImages, newImage]
      };
    });
    setNewImageUrl('');
    setNewImagePrimary(false);
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

  const addSpecification = () => {
    if (!newSpecification.name || !newSpecification.value) return;
    
    console.log('➕ Adding specification:', newSpecification);
    
    setProduct(prev => {
      const newSpec = {
        name: newSpecification.name,
        value: newSpecification.value,
        display_order: (prev?.specifications || []).length
      };
      
      const updatedProduct = {
        ...(prev || initialProductState),
        specifications: [
          ...(prev?.specifications || []),
          newSpec
        ]
      };
      
      console.log('✅ Updated product specifications:', updatedProduct.specifications);
      return updatedProduct;
    });
    
    // Reset the input fields
    setNewSpecification({ name: '', value: '', display_order: 0 });
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

  const addFeature = () => {
    if (!newFeature.feature) return;
    
    console.log('➕ Adding feature:', newFeature);
    
    setProduct(prev => {
      const newFeat = {
        feature: newFeature.feature,
        display_order: (prev?.features || []).length
      };
      
      const updatedProduct = {
        ...(prev || initialProductState),
        features: [
          ...(prev?.features || []),
          newFeat
        ]
      };
      
      console.log('✅ Updated product features:', updatedProduct.features);
      return updatedProduct;
    });
    
    // Reset the input field
    setNewFeature({ feature: '', display_order: 0 });
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

      console.log('✅ Valid specifications:', validSpecifications);
      console.log('✅ Valid features:', validFeatures);
      console.log('✅ Valid images:', validImages);

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

      console.log('🚀 Sending update request with data:', {
        id: product.id,
        specifications: productToUpdate.specifications,
        features: productToUpdate.features,
        images: productToUpdate.images
      });

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

  const handleFileUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      // Use Flask backend for uploads
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Set the uploaded image URL
      setNewImageUrl(result.url);
      console.log('✅ Image uploaded successfully:', result.url);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

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
              value={product.name || ''}
              onChange={handleInputChange}
              placeholder="Product name"
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={product.sku || ''}
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
              value={product.price || 0}
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
              value={product.original_price || 0}
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
              value={product.stock || 0}
              onChange={handleNumberInputChange}
              placeholder="Stock quantity"
            />
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={product.brand_id && product.brand_id > 0 ? product.brand_id.toString() : 'none'}
              onValueChange={(value) => {
                setProduct(prev => ({
                  ...(prev || initialProductState),
                  brand_id: value === 'none' ? 0 : parseInt(value)
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No brand</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={product.category_id && product.category_id > 0 ? product.category_id.toString() : 'none'}
              onValueChange={(value) => {
                setProduct(prev => ({
                  ...(prev || initialProductState),
                  category_id: value === 'none' ? 0 : parseInt(value)
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={product.description || ''}
            onChange={handleInputChange}
            placeholder="Product description"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_new"
              checked={product.is_new || false}
              onCheckedChange={handleSwitchChange('is_new')}
            />
            <Label htmlFor="is_new">New Product</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_sale"
              checked={product.is_sale || false}
              onCheckedChange={handleSwitchChange('is_sale')}
            />
            <Label htmlFor="is_sale">On Sale</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={product.is_featured || false}
              onCheckedChange={handleSwitchChange('is_featured')}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="space-y-6">
            {/* Upload New Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Image</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Upload Image</Label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
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
                    <div className="space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-indigo-600 hover:text-indigo-500">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="text-sm text-gray-600">Uploading...</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-4">
                  <Label>Or Enter Image URL</Label>
                  <div className="space-y-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500">Enter a direct link to an image</p>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {newImageUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative inline-block">
                    <img
                      src={newImageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setNewImageUrl('')}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}

              {/* Add Image Button */}
              {newImageUrl && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new-image-primary"
                      checked={newImagePrimary}
                      onCheckedChange={setNewImagePrimary}
                    />
                    <Label htmlFor="new-image-primary">Set as Primary</Label>
                  </div>
                  <Button
                    onClick={() => {
                      addImage();
                      setNewImageUrl('');
                    }}
                    disabled={!newImageUrl}
                  >
                    Add Image
                  </Button>
                </div>
              )}
            </div>

            {/* Existing Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Images</h3>
              <div className="space-y-4">
                {product.images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    {/* Image Preview */}
                    {image.image_url && (
                      <div className="relative inline-block">
                        <img
                          src={image.image_url}
                          alt={`Product image ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            console.error('Failed to load image:', image.image_url);
                            e.currentTarget.src = '/placeholder.png';
                          }}
                        />
                        {image.is_primary && (
                          <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Image Controls */}
                    <div className="flex items-center space-x-4">
                      <Input
                        value={image.image_url || ''}
                        onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                        placeholder="Image URL"
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={image.is_primary || false}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="space-y-6">
            {/* Add New Specification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Specification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={newSpecification.name}
                    onChange={handleNewSpecificationChange}
                    placeholder="e.g., Material, Size, Weight"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <div className="flex gap-2">
                    <Input
                      name="value"
                      value={newSpecification.value}
                      onChange={handleNewSpecificationChange}
                      placeholder="e.g., Stainless Steel, 10 inches, 2.5 lbs"
                      className="flex-1"
                    />
                    <Button
                      onClick={addSpecification}
                      disabled={!newSpecification.name || !newSpecification.value}
                      className="whitespace-nowrap"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Specifications</h3>
              {product.specifications.length > 0 ? (
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Input
                        value={spec.name || ''}
                        onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                        placeholder="Specification name"
                        className="flex-1"
                      />
                      <Input
                        value={spec.value || ''}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="Specification value"
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => removeSpecification(index)}
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">No specifications added yet</p>
                  <p className="text-xs text-gray-500">Add specifications above to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="space-y-6">
            {/* Add New Feature */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Feature</h3>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Feature</Label>
                  <Input
                    name="feature"
                    value={newFeature.feature}
                    onChange={handleNewFeatureChange}
                    placeholder="e.g., Dishwasher safe, Non-stick coating, Heat resistant"
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={addFeature}
                    disabled={!newFeature.feature}
                    className="whitespace-nowrap"
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Features</h3>
              {product.features.length > 0 ? (
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center flex-1">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <Input
                          value={feature.feature || ''}
                          onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                          placeholder="Feature description"
                          className="flex-1"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeFeature(index)}
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">No features added yet</p>
                  <p className="text-xs text-gray-500">Add features above to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
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