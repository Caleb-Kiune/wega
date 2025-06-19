'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, ProductImage, ProductSpecification, ProductFeature, Review } from '../../lib/api/products';
import apiClient from '../../lib/api/client';
import { toast } from 'sonner';

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

export default function CreateProductPage() {
  const router = useRouter();
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
      const response = await fetch('http://localhost:5000/api/upload', {
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
      router.push('/crud');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Create New Product</h1>
              <p className="mt-2 text-gray-600">Add a new product to your catalog</p>
            </div>
            <button
              onClick={() => router.push('/crud')}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">Error: {error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      {isCreatingNewBrand ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                            <input
                              type="text"
                              name="name"
                              value={newBrandName}
                              onChange={handleNewBrandChange}
                              placeholder="Enter brand name"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Slug</label>
                            <input
                              type="text"
                              name="slug"
                              value={newBrandName}
                              onChange={handleNewBrandChange}
                              placeholder="brand-slug"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              name="description"
                              value={newBrandName}
                              onChange={handleNewBrandChange}
                              placeholder="Enter brand description"
                              rows={3}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                            <input
                              type="text"
                              name="logo_url"
                              value={newBrandName}
                              onChange={handleNewBrandChange}
                              placeholder="Enter logo URL"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                          </div>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={handleCreateBrand}
                              className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                              Create Brand
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingNewBrand(false);
                                setNewBrandName('');
                              }}
                              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={newProduct.brand_id?.toString() || ''}
                          onChange={handleBrandChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                          <option value="">Select a brand</option>
                          {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                          <option value="new">+ Create New Brand</option>
                        </select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      {isCreatingNewCategory ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Category Name</label>
                            <input
                              type="text"
                              name="name"
                              value={newCategoryName}
                              onChange={handleNewCategoryChange}
                              placeholder="Enter category name"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Slug</label>
                            <input
                              type="text"
                              name="slug"
                              value={newCategoryName}
                              onChange={handleNewCategoryChange}
                              placeholder="category-slug"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              name="description"
                              value={newCategoryName}
                              onChange={handleNewCategoryChange}
                              placeholder="Enter category description"
                              rows={3}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              type="text"
                              name="image_url"
                              value={newCategoryName}
                              onChange={handleNewCategoryChange}
                              placeholder="Enter image URL"
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                          </div>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={handleCreateCategory}
                              className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                              Create Category
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingNewCategory(false);
                                setNewCategoryName('');
                              }}
                              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={newProduct.category_id?.toString() || ''}
                          onChange={handleCategoryChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                          <option value="new">+ Create New Category</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Original Price</label>
                      <input
                        type="number"
                        name="original_price"
                        value={newProduct.original_price || ''}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={newProduct.sku}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        value={newProduct.rating}
                        onChange={handleInputChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Review Count</label>
                      <input
                        type="number"
                        name="review_count"
                        value={newProduct.review_count}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="is_new"
                        checked={newProduct.is_new}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">New Product</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="is_sale"
                        checked={newProduct.is_sale}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">On Sale</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={newProduct.is_featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Featured Product</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="mb-8 border-t pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
                <span className="text-sm text-red-600 font-medium">* Required</span>
              </div>
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Upload Image</label>
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
                      <label className="block text-sm font-medium text-gray-700">Or Enter Image URL</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="image_url"
                          value={newImage.image_url}
                          onChange={handleImageChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                        <p className="text-xs text-gray-500">Enter a direct link to an image</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {newImage.image_url && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Preview</label>
                      <div className="relative inline-block">
                        <img
                          src={newImage.image_url}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setNewImage(prev => ({ ...prev, image_url: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primary Image Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_primary"
                        checked={newImage.is_primary}
                        onChange={handleImageChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700">Set as Primary Image</span>
                    </label>
                    <button
                      type="button"
                      onClick={addImage}
                      disabled={!newImage.image_url || uploadingImage}
                      className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Image
                    </button>
                  </div>
                </div>

                {/* Image List */}
                {newProduct.images.length > 0 ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Added Images</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.image_url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          {image.is_primary && (
                            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-2">No images added yet</p>
                    <p className="text-xs text-gray-500">Upload an image file or enter an image URL above to get started</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications Section */}
            <div className="mb-8 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newSpecification.name}
                      onChange={handleSpecificationChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        name="value"
                        value={newSpecification.value}
                        onChange={handleSpecificationChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                      <button
                        type="button"
                        onClick={addSpecification}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specifications List */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {newProduct.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">{spec.name}:</span>{' '}
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-8 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Feature</label>
                    <input
                      type="text"
                      name="feature"
                      value={newFeature.feature}
                      onChange={handleFeatureChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {newProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-900">{feature.feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 mt-8 border-t">
              <button
                type="button"
                onClick={() => router.push('/crud')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 