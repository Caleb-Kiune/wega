'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, Product } from '../lib/api/products';

interface Review {
  id: number;
  user: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
  avatar: string;
}

interface ProductWithReviews extends Product {
  reviews: Review[];
}

export default function CrudPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithReviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithReviews | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    sku: '',
    stock: 0,
    isNew: false,
    isSale: false,
    isFeatured: false,
    images: [],
    specifications: [],
    features: [],
    brand: '',
    category: '',
    rating: 0,
    reviewCount: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll();
        setProducts(response.map((p: Product) => ({ ...p, reviews: [] } as ProductWithReviews)));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: ProductWithReviews) => {
    router.push(`/crud/${product.id}/edit`);
  };

  const handleDelete = async (product: ProductWithReviews) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productsApi.delete(productToDelete.id);

      // Refresh the products list
      const response = await productsApi.getAll();
      setProducts(response.map((p: Product) => ({ ...p, reviews: [] } as ProductWithReviews)));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreate = () => {
    router.push('/crud/create');
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const productData: Omit<Product, 'id'> = {
        ...newProduct
      };
      await productsApi.create(productData);
      const products = await productsApi.getAll();
      setProducts(products.map((p: Product) => ({ ...p, reviews: [] } as ProductWithReviews)));
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        sku: '',
        stock: 0,
        isNew: false,
        isSale: false,
        isFeatured: false,
        images: [],
        specifications: [],
        features: [],
        brand: '',
        category: '',
        rating: 0,
        reviewCount: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-2 text-gray-600">Manage your product catalog with ease</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/crud/orders')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Manage Orders
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Product
            </button>
          </div>
        </div>
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

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

        <div className="grid grid-cols-1 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
              <div className="p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Image Gallery */}
                  <div className="w-full md:w-1/3">
                    <div className="relative group">
                      <img
                        src={product.images?.[0]?.image_url || '/placeholder.png'}
                        alt={product.name || 'Product image'}
                        className="w-full h-72 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <span className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                          New
                        </span>
                      )}
                      {product.isSale && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                          Sale
                        </span>
                      )}
                    </div>
                    {/* Additional Images */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {product.images?.map((img) => (
                        <img
                          key={img.id}
                          src={img.image_url}
                          alt={`${product.name} - Image ${img.display_order}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-110"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="w-full md:w-2/3">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name || 'Unnamed Product'}</h2>
                        <p className="text-gray-600 text-lg">{product.brand || 'Unknown Brand'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium">SKU: {product.sku || 'N/A'}</p>
                        <p className="text-sm text-gray-500 font-medium">Stock: {product.stock || 0}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description || 'No description available'}</p>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-gray-900">
                          ${(product.price || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > 0 && (
                          <span className="ml-3 text-xl text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-2xl">★</span>
                        <span className="ml-2 text-gray-600 text-lg">
                          {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Edit and Delete Buttons */}
                    <div className="flex justify-end gap-4 mb-6">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit Product
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Product
                      </button>
                    </div>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">Features</h3>
                        <ul className="grid grid-cols-2 gap-3">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-black">
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {feature.feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {product.specifications.map((spec, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium text-gray-900">{spec.name}:</span>{' '}
                              <span className="text-gray-600">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                  <div className="mt-10 border-t pt-8">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">Customer Reviews</h3>
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.user}</h4>
                              <div className="flex items-center">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="ml-2 text-gray-600">{review.rating}/5</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 ml-auto">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 animate-fadeIn">
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Confirm Delete</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-lg text-center mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{productToDelete.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 