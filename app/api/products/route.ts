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
    image: "/images/kitchenware1.jpeg",
  },
  {
    id: "2",
    name: "Stainless Steel Cooking Pot Set",
    description: "Complete set of stainless steel cooking pots for your kitchen.",
    price: 5999,
    category: "Cookware",
    stock: 30,
    image: "/images/appliances1.jpeg",
  },
]

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Generate a new ID (replace with actual ID generation)
    const newId = (products.length + 1).toString()
    
    const newProduct = {
      id: newId,
      ...body,
    }
    
    // Add to mock database
    products.push(newProduct)
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    )
  }
} 