import ProductForm from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  )
} 