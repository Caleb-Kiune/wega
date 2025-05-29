"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { categoriesApi } from "../app/lib/api/categories"

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await categoriesApi.getAll()
        setCategories(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading categories</div>

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of premium kitchenware products designed to make your cooking experience better.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <Image
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="text-green-600 font-medium group-hover:text-green-700">Shop Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
