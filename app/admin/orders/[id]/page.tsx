import { Suspense } from 'react';
import OrderDetailsClient from './OrderDetailsClient';
import { ordersApi } from '@/lib/orders';

// Define the expected props for this dynamic route page
interface PageProps {
  params: { id: string };
}

// This is a server component and can be async in the Next.js App Router
const OrderDetailsPage = async ({ params }: PageProps) => {
  // Validate that params.id is a valid integer string
  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    // You can customize this error UI as needed
    return <div>Invalid order ID.</div>;
  }

  // Fetch the order data from your API (make sure the result is serializable)
  const order = await ordersApi.getById(orderId);

  // Suspense fallback only works if OrderDetailsClient or its children use suspense/lazy features
  // Otherwise, the fallback will never be shown
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      {/* Pass only serializable props to client components */}
      <OrderDetailsClient initialOrder={order} />
    </Suspense>
  );
};

export default OrderDetailsPage; 