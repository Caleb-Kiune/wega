"use client"

import Image from "next/image"
import { useState } from "react"

interface CloudinaryImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: "lazy" | "eager"
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export default function CloudinaryImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  loading = "lazy",
  sizes,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
  ...props
}: CloudinaryImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Check if it's a Cloudinary URL
  const isCloudinaryUrl = src && src.includes('cloudinary.com')

  // If it's a Cloudinary URL and we're having issues, use a regular img tag
  if (isCloudinaryUrl && imageError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => {
          setImageLoaded(true)
          onLoad?.()
        }}
        onError={() => {
          setImageError(true)
          onError?.()
        }}
        {...props}
      />
    )
  }

  // Use Next.js Image component for better optimization
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onLoad={() => {
        setImageLoaded(true)
        onLoad?.()
      }}
      onError={() => {
        setImageError(true)
        onError?.()
      }}
      {...props}
    />
  )
}
