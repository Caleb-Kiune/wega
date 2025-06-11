'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product, ProductImage, ProductSpecification, ProductFeature } from '../../lib/api/products';
import apiClient from '../../lib/api/client';
import { toast } from 'react-hot-toast';

type NewProductImage = Omit<ProductImage, 'id' | 'product_id'>;
type NewProductSpecification = Omit<ProductSpecification, 'id' | 'product_id'>;
type NewProductFeature = Omit<ProductFeature, 'id' | 'product_id'>;

type CreateProductData = {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  isNew: boolean;
  isSale: boolean;
  isFeatured: boolean;
  image: string;
  images: NewProductImage[];
  specifications: NewProductSpecification[];
  features: NewProductFeature[];
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
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

  const [newProduct, setNewProduct] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    sku: '',
    stock: 0,
    isNew: false,
    isSale: false,
    isFeatured: false,
    image: '',
    images: [],
    specifications: [],
    features: [],
    brand: '',
    category: '',
    rating: 0,
    reviewCount: 0
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
      setNewProduct(prev => ({ ...prev, brand: '', brand_id: undefined }));
    } else {
      setIsCreatingNewBrand(false);
      const selectedBrand = brands.find(b => b.id === Number(value));
      setNewProduct(prev => ({
        ...prev,
        brand: selectedBrand?.name || '',
        brand_id: selectedBrand?.id
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsCreatingNewCategory(true);
      setNewProduct(prev => ({ ...prev, category: '', category_id: undefined }));
    } else {
      setIsCreatingNewCategory(false);
      const selectedCategory = categories.find(c => c.id === Number(value));
      setNewProduct(prev => ({
        ...prev,
        category: selectedCategory?.name || '',
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
        brand: createdBrand.name,
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
        category: createdCategory.name,
        category_id: createdCategory.id
      }));
      setIsCreatingNewCategory(false);
      setNewCategoryName('');
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedBrandObj = brands.find(b => b.id === selectedBrand);
      const selectedCategoryObj = categories.find(c => c.id === selectedCategory);

      const productData: Omit<Product, 'id'> = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        sku: newProduct.sku,
        stock: newProduct.stock,
        isNew: newProduct.isNew,
        isSale: newProduct.isSale,
        isFeatured: newProduct.isFeatured,
        image: newProduct.image,
        images: newProduct.images.map(img => ({
          id: 0,
          product_id: 0,
          image_url: img.image_url,
          is_primary: img.is_primary,
          display_order: img.display_order
        })),
        specifications: newProduct.specifications.map(spec => ({
          id: 0,
          product_id: 0,
          name: spec.name,
          value: spec.value,
          display_order: spec.display_order
        })),
        features: newProduct.features.map(feature => ({
          id: 0,
          product_id: 0,
          feature: feature.feature,
          display_order: feature.display_order
        })),
        brand: selectedBrandObj?.name || '',
        category: selectedCategoryObj?.name || '',
        rating: newProduct.rating,
        reviewCount: newProduct.reviewCount,
        reviews: []
      };

      await productsApi.create(productData);
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
                          value={selectedBrand?.toString() || ''}
                          onChange={(e) => setSelectedBrand(e.target.value ? Number(e.target.value) : null)}
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
                          value={selectedCategory?.toString() || ''}
                          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
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
                        name="originalPrice"
                        value={newProduct.originalPrice || ''}
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
                        name="reviewCount"
                        value={newProduct.reviewCount}
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
                        name="isNew"
                        checked={newProduct.isNew}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">New Product</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="isSale"
                        checked={newProduct.isSale}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">On Sale</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={newProduct.isFeatured}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="image_url"
                      value={newImage.image_url}
                      onChange={handleImageChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_primary"
                        checked={newImage.is_primary}
                        onChange={handleImageChange}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700">Primary Image</span>
                    </label>
                    <button
                      type="button"
                      onClick={addImage}
                      className="ml-4 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Add Image
                    </button>
                  </div>
                </div>

                {/* Image List */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.image_url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
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