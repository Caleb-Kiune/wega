/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'wega-production.up.railway.app',
      'wega-one.vercel.app',
      'wega-kitchenware.vercel.app',
      'res.cloudinary.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wega-production.up.railway.app',
        port: '',
        pathname: '/static/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wega-one.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wega-kitchenware.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // serverComponentsExternalPackages: ['sharp'], // Removed as per Next.js 15.2.4 migration
  },
  serverExternalPackages: ['sharp'],
  webpack: (config) => {
    config.externals = [...config.externals, 'sharp'];
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
