import { Suspense } from "react"
import ProductForm from "@/components/admin/product-form"

interface PageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  // Replace with actual API call
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
  // const data = await response.json()
  // return data

  // Mock data for now
  return {
    id,
    name: "Premium Non-Stick Frying Pan",
    description: "High-quality non-stick frying pan perfect for everyday cooking.",
    price: 2499,
    category: "Cookware",
    stock: 50,
    image: "/images/kitchenware1.jpeg",
  }
}

export default async function EditProductPage({ params }: PageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <p>Product not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <Suspense fallback={<p>Loading...</p>}>
            <ProductForm initialData={product} isEditing />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 