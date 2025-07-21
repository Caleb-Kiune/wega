import { Suspense } from 'react';
import OrderDetailsClient from './OrderDetailsClient';
import { ordersApi } from '@/lib/orders';

// Define the expected props for this dynamic route page
interface PageProps {
  params: { id: string };
}

// Helper function to fetch order data on the server
async function getOrder(orderId: number) {
  // Fetch the order data from your API (ensure the result is serializable)
  return ordersApi.getById(orderId);
}

// This is a server component (no 'use client' directive)
// It receives params from the Next.js router
export default async function OrderDetailsPage({ params }: PageProps) {
  // Validate that params.id is a valid integer string
  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    // Render a simple error UI if the ID is invalid
    return <div>Invalid order ID.</div>;
  }

  // Fetch order data using a helper function (keeps the component clean)
  const order = await getOrder(orderId);

  // Suspense is only needed if OrderDetailsClient or its children use suspense/lazy features
  // If not, you can remove Suspense. If you want to keep it for future-proofing, that's fine.
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
} 