"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { Dialog } from '@headlessui/react';

// Define types for our data
interface BaseModel {
  id: number;
  created_at?: string;
  updated_at?: string;
}

interface Product extends BaseModel {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category_id: number;
  brand_id: number;
  isNew: boolean;
  isSale: boolean;
  rating?: number;
  reviewCount: number;
  sku?: string;
}

interface Category extends BaseModel {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

interface Brand extends BaseModel {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

interface ProductImage extends BaseModel {
  product_id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

interface ProductSpecification extends BaseModel {
  product_id: number;
  name: string;
  value: string;
  display_order: number;
}

interface ProductFeature extends BaseModel {
  product_id: number;
  feature: string;
  display_order: number;
}

interface Review extends BaseModel {
  product_id: number;
  user: string;
  avatar?: string;
  title: string;
  comment: string;
  rating: number;
  date?: string;
}

type ModelType =
  | Product
  | Category
  | Brand
  | Review
  | ProductImage
  | ProductSpecification
  | ProductFeature;

// A discriminated union for runtime payload checks
type PayloadChecks = {
  products: { name: string; price: number };
  categories: { name: string };
  brands: { name: string };
  reviews: { user: string; title: string; comment: string; rating: number };
  product_images: { image_url: string };
  product_specifications: { name: string; value: string };
  product_features: { feature: string };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

const models = [
  { key: 'products', label: 'Products' },
  { key: 'categories', label: 'Categories' },
  { key: 'brands', label: 'Brands' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'product_images', label: 'Images' },
  { key: 'product_specifications', label: 'Specifications' },
  { key: 'product_features', label: 'Features' },
] as const;

type ModelKey = typeof models[number]['key'];
const nestedModels: ModelKey[] = [
  'reviews',
  'product_images',
  'product_specifications',
  'product_features',
];

export default function AdminDashboard() {
  const [current, setCurrent] = useState<ModelKey>('products');
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<ModelType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const swrKey =
    selectedProduct && nestedModels.includes(current)
      ? `/api/products/${selectedProduct}/${current}?limit=100`
      : `/api/${current}?limit=100`;

  const { data, error: swrError, mutate } = useSWR(swrKey, fetcher);

  const openModal = (item: ModelType | null = null) => {
    setEditItem(item);
    setIsOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setEditItem(null);
    setIsOpen(false);
    setError(null);
  };

  const validatePayload = (key: ModelKey, payload: any) => {
    // basic runtime checks, throw Error if missing required
    if (key === 'products' && !payload.name) throw new Error('Name is required');
    if (key === 'reviews' && (!payload.user || !payload.title || !payload.comment))
      throw new Error('User, title and comment are required');
    if (key === 'product_images' && !payload.image_url)
      throw new Error('Image URL is required');
    if (key === 'product_specifications' && (!payload.name || !payload.value))
      throw new Error('Spec name and value are required');
    if (key === 'product_features' && !payload.feature)
      throw new Error('Feature description is required');
    // add more as needed...
  };

  const handleSave = async (formData: FormData) => {
    try {
      // if nested but no product selected, guard
      if (nestedModels.includes(current) && !selectedProduct) {
        setError('Please select a product first');
        return;
      }

      const baseUrl =
        selectedProduct && nestedModels.includes(current)
          ? `/api/products/${selectedProduct}/${current}`
          : `/api/${current}`;
      const url = editItem ? `${baseUrl}/${editItem.id}` : baseUrl;
      const method = editItem ? 'PUT' : 'POST';

      // build and cast payload
      const raw = Object.fromEntries(formData) as Record<string, string>;
      const payload: any = { ...raw };

      if (current === 'products') {
        payload.price = parseFloat(raw.price);
        if (raw.originalPrice) payload.originalPrice = parseFloat(raw.originalPrice);
        payload.stock = parseInt(raw.stock, 10);
        payload.isNew = raw.isNew === 'true';
        payload.isSale = raw.isSale === 'true';
      }
      if (current === 'reviews') payload.rating = parseInt(raw.rating, 10);
      if (['product_images', 'product_specifications', 'product_features'].includes(current)) {
        payload.display_order = parseInt(raw.display_order, 10);
        if (current === 'product_images') payload.is_primary = raw.is_primary === 'true';
      }

      // runtime validation
      validatePayload(current, payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Server validation failed');
        return;
      }

      await mutate();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      if (nestedModels.includes(current) && !selectedProduct) {
        setError('Please select a product first');
        return;
      }
      const baseUrl =
        selectedProduct && nestedModels.includes(current)
          ? `/api/products/${selectedProduct}/${current}`
          : `/api/${current}`;
      const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Delete failed');
        return;
      }
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (swrError) return <div className="p-6 text-red-600">Error loading {current}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  const items = data[current] || data;
  const fields = items.length
    ? Object.keys(items[0]).filter((k) => !['description', 'images', 'specifications', 'features', 'reviews'].includes(k))
    : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Admin Dashboard</h1>

      {nestedModels.includes(current) && !selectedProduct && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          Please select a product before creating {models.find((m) => m.key === current)?.label.slice(0, -1)}.
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        {models.map((m) => (
          <button
            key={m.key}
            className={`px-4 py-2 rounded ${
              current === m.key ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => {
              setCurrent(m.key);
              setError(null);
            }}
          >
            {m.label}
          </button>
        ))}
        <button
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          onClick={() => openModal()}
          disabled={nestedModels.includes(current) && !selectedProduct}
        >
          + New {models.find((m) => m.key === current)?.label.slice(0, -1)}
        </button>
      </div>

      {nestedModels.includes(current) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(Number(e.target.value))}
          >
            <option value="">Select a product...</option>
            {data.products?.map((p: Product) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              {fields.map((f) => (
                <th key={f} className="px-4 py-2 border text-left font-semibold">
                  {f.replace(/_/g, ' ').toUpperCase()}
                </th>
              ))}
              <th className="px-4 py-2 border text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: ModelType) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {fields.map((f) => (
                  <td key={f} className="px-4 py-2 border truncate max-w-xs">
                    {String((item as any)[f])}
                  </td>
                ))}
                <td className="px-4 py-2 border space-x-2">
                  <button className="text-blue-600 hover:text-blue-800" onClick={() => openModal(item)}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog 
        open={isOpen} 
        onClose={() => {
          closeModal();
        }} 
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={closeModal} />
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {editItem ? 'Edit' : 'Create'} {models.find((m) => m.key === current)?.label.slice(0, -1)}
          </Dialog.Title>

          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSave(new FormData(e.currentTarget));
            }}
          >
            {fields.map((f) => {
              // hide foreign keys and timestamps in nested models
              if (
                nestedModels.includes(current) &&
                ['category_id', 'brand_id', 'id', 'created_at', 'updated_at'].includes(f)
              ) {
                return null;
              }
              return (
                <div key={f} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {f.replace(/_/g, ' ')}
                  </label>
                  <input
                    name={f}
                    defaultValue={`${(editItem as any)?.[f] || ''}`}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type={f.includes('date') ? 'datetime-local' : 'text'}
                  />
                </div>
              );
            })}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
