'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsApi, Product } from '../../../lib/api/products';

interface Review {
  id: number;
  product_id: number;
  user: string;
  avatar: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
}

interface ProductWithReviews extends Product {
  reviews: Review[];
}

const initialProductState: ProductWithReviews = {
  id: 0,
  name: '',
  description: '',
  price: 0,
  original_price: undefined,
  sku: '',
  stock: 0,
  is_new: false,
  is_sale: false,
  images: [],
  specifications: [],
  features: [],
  brand: '',
  category: '',
  rating: 0,
  review_count: 0,
  reviews: []
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<ProductWithReviews>(initialProductState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = params.id as string;
        const [productData, brandsData, categoriesData] = await Promise.all([
          productsApi.getById(parseInt(productId)),
          productsApi.getBrands(),
          productsApi.getCategories()
        ]);
        
        // Ensure all arrays are initialized
        const features = productData.features?.map(feature => ({
          id: feature.id || 0,
          product_id: productData.id,
          feature: feature.feature || '',
          display_order: feature.display_order || 0
        })) || [];

        const specifications = productData.specifications?.map(spec => ({
          id: spec.id || 0,
          product_id: productData.id,
          name: spec.name || '',
          value: spec.value || '',
          display_order: spec.display_order || 0
        })) || [];

        setProduct({
          ...initialProductState,
          ...productData,
          original_price: productData.original_price ?? undefined,
          features,
          specifications,
          images: productData.images || [],
          reviews: [],
        });
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? value === '' ? '' : Number(value)
          : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the data for the API
      const updateData = {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : undefined,
        sku: product.sku,
        stock: Number(product.stock),
        is_new: product.is_new,
        is_sale: product.is_sale,
        images: product.images,
        specifications: product.specifications.map(spec => ({
          ...spec,
          product_id: product.id,
          display_order: spec.display_order || 0
        })),
        features: product.features.map(feature => ({
          id: feature.id,
          product_id: product.id,
          feature: feature.feature,
          display_order: feature.display_order || 0
        })),
        // Convert category_id and brand_id to numbers if they exist
        ...(product.category_id && { category_id: Number(product.category_id) }),
        ...(product.brand_id && { brand_id: Number(product.brand_id) })
      };

      await productsApi.update(product.id, updateData);
      router.push('/crud');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSpecificationChange = (index: number, field: 'name' | 'value', value: string) => {
    setProduct(prev => {
      const newSpecifications = [...(prev.specifications || [])];
      newSpecifications[index] = {
        ...newSpecifications[index],
        [field]: value,
        display_order: index
      };
      return { ...prev, specifications: newSpecifications };
    });
  };

  const handleAddSpecification = () => {
    setProduct(prev => ({
      ...prev,
      specifications: [
        ...(prev.specifications || []),
        {
          id: 0,
          product_id: prev.id,
          name: '',
          value: '',
          display_order: (prev.specifications || []).length
        }
      ]
    }));
  };

  const handleRemoveSpecification = (index: number) => {
    setProduct(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setProduct(prev => {
      const newFeatures = [...(prev.features || [])];
      newFeatures[index] = {
        id: newFeatures[index]?.id || 0,
        product_id: prev.id,
        feature: value,
        display_order: index
      };
      return { ...prev, features: newFeatures };
    });
  };

  const handleAddFeature = () => {
    setProduct(prev => ({
      ...prev,
      features: [
        ...(prev.features || []),
        {
          id: 0,
          product_id: prev.id,
          feature: '',
          display_order: (prev.features || []).length
        }
      ]
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setProduct(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleReviewChange = (index: number, field: keyof Review, value: string | number) => {
    setProduct(prev => {
      const newReviews = [...(prev.reviews || [])];
      newReviews[index] = {
        ...newReviews[index],
        [field]: value
      };
      return { ...prev, reviews: newReviews };
    });
  };

  const handleAddReview = () => {
    setProduct(prev => ({
      ...prev,
      reviews: [
        ...(prev.reviews || []),
        {
          id: 0,
          product_id: prev.id,
          user: '',
          avatar: '',
          title: '',
          comment: '',
          rating: 5,
          date: new Date().toISOString()
        }
      ]
    }));
  };

  const handleRemoveReview = (index: number) => {
    setProduct(prev => ({
      ...prev,
      reviews: (prev.reviews || []).filter((_, i) => i !== index)
    }));
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <button
              onClick={() => router.push('/crud')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Back to Products
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Original Price</label>
                <input
                  type="number"
                  name="original_price"
                  value={product.original_price || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select
                  name="brand_id"
                  value={product.brand_id || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category_id"
                  value={product.category_id || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={product.is_new}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">New Product</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_sale"
                  checked={product.is_sale}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors duration-200"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">On Sale</span>
              </label>
            </div>

            {/* Features Section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Product Features</h3>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {product.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={feature.feature || ''}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter feature description"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-2 text-red-600 hover:text-red-700 focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Product Specifications</h3>
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Specification
                </button>
              </div>

              <div className="space-y-3">
                {product.specifications?.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={spec.name || ''}
                      onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                      placeholder="Specification name"
                      className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={spec.value || ''}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      placeholder="Specification value"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                      className="p-2 text-red-600 hover:text-red-700 focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Product Reviews</h3>
                <button
                  type="button"
                  onClick={handleAddReview}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Review
                </button>
              </div>

              <div className="space-y-6">
                {product.reviews?.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">User Name</label>
                        <input
                          type="text"
                          value={review.user}
                          onChange={(e) => handleReviewChange(index, 'user', e.target.value)}
                          placeholder="Enter user name"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                        <input
                          type="text"
                          value={review.avatar}
                          onChange={(e) => handleReviewChange(index, 'avatar', e.target.value)}
                          placeholder="Enter avatar URL"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-medium text-gray-700">Review Title</label>
                      <input
                        type="text"
                        value={review.title}
                        onChange={(e) => handleReviewChange(index, 'title', e.target.value)}
                        placeholder="Enter review title"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <select
                        value={review.rating}
                        onChange={(e) => handleReviewChange(index, 'rating', Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} {rating === 1 ? 'Star' : 'Stars'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-medium text-gray-700">Comment</label>
                      <textarea
                        value={review.comment}
                        onChange={(e) => handleReviewChange(index, 'comment', e.target.value)}
                        placeholder="Enter review comment"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveReview(index)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/crud')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-black bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 