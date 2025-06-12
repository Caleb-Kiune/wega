'use client';

import ProductForm from './product-form';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  return <ProductForm productId={productId} />;
} 