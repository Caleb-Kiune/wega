import { motion } from 'framer-motion';

export function ProductsLoading() {
  const skeletonVariants = {
    initial: { opacity: 0.6, y: 20 },
    animate: { 
      opacity: [0.6, 1, 0.6],
      y: 0,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full"
          initial="initial"
          animate="animate"
          transition={{ delay: i * 0.05 }}
        >
          {/* Image Skeleton */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial="initial"
              animate="animate"
            />
            {/* Badge Skeletons */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <div className="h-5 w-16 bg-gray-300 rounded-full" />
              <div className="h-5 w-12 bg-gray-300 rounded-full" />
            </div>
            {/* Wishlist Button Skeleton */}
            <div className="absolute top-2 right-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-3">
            {/* Category and Brand - hidden on mobile */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>

            {/* Price */}
            <div className="h-5 bg-gray-200 rounded w-1/3" />

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, starIndex) => (
                  <div key={starIndex} className="h-3 w-3 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-3 bg-gray-200 rounded w-8" />
            </div>
          </div>

          {/* Mobile Button Skeleton */}
          <div className="sm:hidden p-3 pt-0">
            <div className="h-11 bg-gray-200 rounded-lg w-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  const skeletonVariants = {
    initial: { opacity: 0.6, y: 20 },
    animate: { 
      opacity: [0.6, 1, 0.6],
      y: 0,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-48 lg:w-56 flex-shrink-0">
            <div className="relative aspect-square w-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial="initial"
                animate="animate"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Category and Brand */}
              <div className="flex items-center gap-4 mb-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              
              {/* Product Title */}
              <div className="space-y-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>

              {/* Price */}
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <div key={starIndex} className="h-4 w-4 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
              <div className="h-12 bg-gray-200 rounded-lg w-32" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full"
      initial="initial"
      animate="animate"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial="initial"
          animate="animate"
        />
        {/* Badge Skeletons */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="h-5 w-16 bg-gray-300 rounded-full" />
          <div className="h-5 w-12 bg-gray-300 rounded-full" />
        </div>
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-3">
        {/* Category and Brand - hidden on mobile */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-1/3" />

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, starIndex) => (
              <div key={starIndex} className="h-3 w-3 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-8" />
        </div>
      </div>

      {/* Mobile Button Skeleton */}
      <div className="sm:hidden p-3 pt-0">
        <div className="h-11 bg-gray-200 rounded-lg w-full" />
      </div>
    </motion.div>
  );
}

// Enhanced loading component for mobile-first design
export function MobileProductsLoading() {
  const skeletonVariants = {
    initial: { opacity: 0.6, y: 20 },
    animate: { 
      opacity: [0.6, 1, 0.6],
      y: 0,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded-lg" />
          <div className="h-10 w-20 bg-gray-200 rounded-lg" />
          <div className="h-10 w-16 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.05 }}
          >
            {/* Image Skeleton */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 space-y-2">
              {/* Title */}
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>

              {/* Price */}
              <div className="h-4 bg-gray-200 rounded w-1/2" />

              {/* Rating */}
              <div className="flex items-center space-x-1">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, starIndex) => (
                    <div key={starIndex} className="h-2.5 w-2.5 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="h-2.5 bg-gray-200 rounded w-6" />
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="p-3 pt-0">
              <div className="h-10 bg-gray-200 rounded-lg w-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 