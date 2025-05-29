'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: number;
  user: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
  avatar: string;
}

interface Specification {
  id: number;
  name: string;
  value: string;
  display_order: number;
}

interface Feature {
  id: number;
  feature: string;
  display_order: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  brand: string;
  category: string;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  specifications: Specification[];
  features: Feature[];
  sku: string;
  stock: number;
}

export default function CrudPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: null,
    sku: '',
    stock: 0,
    isNew: false,
    isSale: false,
    images: [],
    specifications: [],
    features: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      // Format the data to match the backend model
      const formattedData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        original_price: editingProduct.originalPrice,
        sku: editingProduct.sku,
        stock: editingProduct.stock,
        is_new: editingProduct.isNew,
        is_sale: editingProduct.isSale,
        // Keep existing images, specifications, and features
        images: editingProduct.images,
        specifications: editingProduct.specifications,
        features: editingProduct.features
      };

      const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Refresh the products list
      const fetchProducts = async () => {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      };

      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;

    const { name, value, type } = e.target;
    setEditingProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
    });
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the products list
      const fetchProducts = async () => {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      };

      await fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the data to match the backend model
      const formattedData = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        original_price: newProduct.originalPrice,
        sku: newProduct.sku,
        stock: newProduct.stock,
        is_new: newProduct.isNew,
        is_sale: newProduct.isSale,
        images: newProduct.images,
        specifications: newProduct.specifications,
        features: newProduct.features
      };

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      // Refresh the products list
      const fetchProducts = async () => {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      };

      await fetchProducts();
      setIsCreateModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        originalPrice: null,
        sku: '',
        stock: 0,
        isNew: false,
        isSale: false,
        images: [],
        specifications: [],
        features: []
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Gallery */}
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name || 'Product image'}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                        New
                      </span>
                    )}
                    {product.isSale && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                        Sale
                      </span>
                    )}
                  </div>
                  {/* Additional Images */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {product.images?.map((img) => (
                      <img
                        key={img.id}
                        src={img.image_url}
                        alt={`${product.name} - Image ${img.display_order}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{product.name || 'Unnamed Product'}</h2>
                      <p className="text-gray-500">{product.brand || 'Unknown Brand'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{product.description || 'No description available'}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > 0 && (
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="ml-1 text-gray-600">
                        {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex justify-end gap-2 mb-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit Product
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete Product
                    </button>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {product.features.map((feature) => (
                          <li key={feature.id}>{feature.feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {product.specifications.map((spec) => (
                          <div key={spec.id} className="text-sm">
                            <span className="font-medium">{spec.name}:</span>{' '}
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
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4 mb-2">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{review.user}</h4>
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1 text-sm text-gray-600">{review.rating}/5</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 ml-auto">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="font-medium mb-1">{review.title}</h5>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={editingProduct.originalPrice || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={editingProduct.sku}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={editingProduct.isNew}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">New Product</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSale"
                    checked={editingProduct.isSale}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">On Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-black bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Create New Product</h2>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleCreateInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleCreateInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleCreateInputChange}
                    step="0.01"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={newProduct.originalPrice || ''}
                    onChange={handleCreateInputChange}
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={newProduct.sku}
                    onChange={handleCreateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleCreateInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={newProduct.isNew}
                    onChange={handleCreateInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">New Product</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSale"
                    checked={newProduct.isSale}
                    onChange={handleCreateInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">On Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewProduct({
                      name: '',
                      description: '',
                      price: 0,
                      originalPrice: null,
                      sku: '',
                      stock: 0,
                      isNew: false,
                      isSale: false,
                      images: [],
                      specifications: [],
                      features: []
                    });
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 