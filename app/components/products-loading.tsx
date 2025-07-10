export function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-4">
            {/* Title and Brand */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>

            {/* Price */}
            <div className="h-6 bg-gray-200 rounded w-1/3" />

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
} 