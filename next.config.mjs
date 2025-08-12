/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: 'custom',
    loaderFile: './cloudinary-loader.js',
    domains: [
      'wega-production-28c0.up.railway.app',
      'res.cloudinary.com',
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
        pathname: '/dy082ykuf/image/upload/**',
      },
    ],
  },
}

export default nextConfig
