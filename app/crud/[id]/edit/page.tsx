'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsApi, Product } from '../../../lib/api/products';

interface ProductWithReviews extends Product {
  reviews: any[];
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = params.id as string;
        const productData = await productsApi.getById(parseInt(productId));
        setProduct({
          ...initialProductState,
          ...productData,
          original_price: productData.original_price ?? undefined,
          features: productData.features ?? [],
          specifications: productData.specifications ?? [],
          images: productData.images ?? [],
          reviews: [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the data for the API
      const updateData = {
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        sku: product.sku,
        stock: product.stock,
        is_new: product.is_new,
        is_sale: product.is_sale,
        images: product.images,
        specifications: product.specifications,
        features: product.features,
        // Only include category_id and brand_id if they exist
        ...(product.category_id && { category_id: product.category_id }),
        ...(product.brand_id && { brand_id: product.brand_id })
      };

      await productsApi.update(product.id, updateData);
      router.push('/crud');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setProduct(prev => {
      const newSpecifications = [...(prev.specifications || [])];
      const existingIndex = newSpecifications.findIndex(spec => spec.name === key);
      
      if (existingIndex >= 0) {
        newSpecifications[existingIndex] = {
          ...newSpecifications[existingIndex],
          value
        };
      } else {
        newSpecifications.push({
          id: 0,
          product_id: prev.id,
          name: key,
          value,
          display_order: newSpecifications.length
        });
      }
      
      return { ...prev, specifications: newSpecifications };
    });
  };

  const handleRemoveSpecification = (key: string) => {
    setProduct(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter(spec => spec.name !== key)
    }));
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

  const handleFeatureChange = (index: number, value: string) => {
    setProduct(prev => {
      const newFeatures = [...(prev.features || [])];
      newFeatures[index] = {
        ...newFeatures[index],
        id: 0,
        product_id: prev.id,
        name: value,
        value: value,
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
          name: '',
          value: '',
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
                      value={feature.name}
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
                      onChange={(e) => handleSpecificationChange(e.target.value, spec.value)}
                      placeholder="Specification name"
                      className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={spec.value || ''}
                      onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                      placeholder="Specification value"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(spec.name)}
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