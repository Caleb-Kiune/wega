import { NextResponse } from "next/server"

// Mock database - replace with actual database
let products = [
  {
    id: "1",
    name: "Premium Non-Stick Frying Pan",
    description: "High-quality non-stick frying pan perfect for everyday cooking.",
    price: 2499,
    category: "Cookware",
    stock: 50,
    image: "/images/hero1.jpg",
  },
  {
    id: "2",
    name: "Stainless Steel Cooking Pot Set",
    description: "Complete set of stainless steel cooking pots for your kitchen.",
    price: 5999,
    category: "Cookware",
    stock: 30,
    image: "/images/hero4.jpg",
  },
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find((p) => p.id === params.id)
  
  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }
  
  return NextResponse.json(product)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const index = products.findIndex((p) => p.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    const updatedProduct = {
      ...products[index],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }
    
    products[index] = updatedProduct
    
    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = products.findIndex((p) => p.id === params.id)
  
  if (index === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }
  
  products = products.filter((p) => p.id !== params.id)
  
  return NextResponse.json(
    { message: "Product deleted successfully" },
    { status: 200 }
  )
} 