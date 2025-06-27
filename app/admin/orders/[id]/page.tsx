import { Suspense } from 'react';
import OrderDetailsClient from './OrderDetailsClient';
import { ordersApi } from '@/lib/orders';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await ordersApi.getById(parseInt(params.id));

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      <OrderDetailsClient initialOrder={order} />
    </Suspense>
  );
} 