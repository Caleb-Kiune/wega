"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { Product } from "../app/lib/api/products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(String(product.id))

  // Add debug logging
  console.log('Product Card Data:', {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    is_new: product.is_new,
    is_sale: product.is_sale,
    is_featured: product.is_featured
  });

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.image_url || "/placeholder.svg",
      quantity: 1
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeItem(String(product.id))
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.image_url || "/placeholder.svg",
        category: product.category,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <article 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 product-card-hover group flex flex-col h-full" 
      role="article" 
      aria-labelledby={`product-${product.id}`}
      style={{ willChange: 'transform, box-shadow' }}
    >
      <div className="relative">
        <Link href={`/products/${product.id}`} aria-labelledby={`product-${product.id}`}>
          <div className="relative h-64 w-full bg-gray-100">
            <Image 
              src={product.images?.[0]?.image_url || "/placeholder.svg"} 
              alt={`${product.name} product image`}
              fill 
              className="object-cover transition-opacity duration-300" 
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </Link>

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.is_featured && <Badge className="bg-purple-600">Featured</Badge>}
          {product.is_new && <Badge className="bg-green-600">New</Badge>}
          {product.is_sale && <Badge className="bg-orange-500">Sale</Badge>}
        </div>

        {/* Quick actions overlay (visible on hover) */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ willChange: 'opacity' }}
        >
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-gray-100 min-h-[44px] min-w-[44px] transition-transform duration-200 hover:scale-105"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              style={{ willChange: 'transform' }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-gray-100 min-h-[44px] min-w-[44px] transition-transform duration-200 hover:scale-105"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              style={{ willChange: 'transform' }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-white hover:bg-gray-100 min-h-[44px] min-w-[44px] transition-transform duration-200 hover:scale-105" 
              asChild
              style={{ willChange: 'transform' }}
            >
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-0.5">
          <div className="text-xs text-gray-500">{product.category}</div>
          <div className="text-xs font-medium text-green-600">{product.brand}</div>
        </div>
        <Link href={`/products/${product.id}`} className="block">
          <h3 id={`product-${product.id}`} className="text-base font-semibold text-gray-800 mb-1 hover:text-green-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center mb-2">
          <span className="text-lg font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              KES {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Only visible on hover */}
        <div 
          className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          style={{ willChange: 'opacity, transform' }}
        >
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 min-h-[44px] transition-transform duration-200 hover:scale-105"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            style={{ willChange: 'transform' }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  )
}
