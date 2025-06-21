'use client';

import { use } from 'react';
import ProductForm from './product-form';

type PageParams = {
  id: string;
};

export default function EditProductPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  return <ProductForm productId={productId} />;
} 