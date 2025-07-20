/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost', 
      'hebbkx1anhila5yf.public.blob.vercel-storage.com', 
      'wega-backend.onrender.com', 
      'your-domain.com',
      'res.cloudinary.com'  // Add Cloudinary domain
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wega-backend.onrender.com',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'wega-backend.onrender.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.com',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
