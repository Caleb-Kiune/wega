import { NextResponse } from "next/server"
import { productsApi } from "@/app/lib/api/products"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort') || undefined
    const search = searchParams.get('search') || undefined

    const products = await productsApi.getAll({ sort, search })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newProduct = await productsApi.create(body)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    )
  }
} 