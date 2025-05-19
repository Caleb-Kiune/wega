export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-64 bg-gray-200 animate-pulse" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/3" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
