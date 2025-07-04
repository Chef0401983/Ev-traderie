/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack to handle OneDrive paths
  webpack: (config, { dev, isServer }) => {
    // Disable all caching for OneDrive compatibility
    config.cache = false;
    
    // Configure file system handling
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    };
    
    // Disable symlinks to avoid OneDrive issues
    config.resolve.symlinks = false;
    
    return config;
  },
  
  // Configure for Netlify deployment
  images: {
    unoptimized: true,
    domains: [
      'ev-trader.ie',
      'supabase.co',
      'your-supabase-project.supabase.co'
    ],
  },
  
  // Force disable caching
  generateEtags: false,
  
  // SEO and Performance optimizations
  compress: true,
  poweredByHeader: false,
  
<<<<<<< HEAD
=======
  // CRITICAL: Disable static optimization completely
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs'],
  },
  
  // Force server-side rendering for all pages
  trailingSlash: false,
  
>>>>>>> cffef9309ec471162ee5dfd2291f98f76bd7b03d
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
<<<<<<< HEAD
=======
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
>>>>>>> cffef9309ec471162ee5dfd2291f98f76bd7b03d
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
<<<<<<< HEAD
  
  // Redirects for SEO
  async redirects() {
    return [
      // Redirect common variations to canonical URLs
      {
        source: '/vehicle/:id',
        destination: '/vehicles/:id',
        permanent: true,
      },
      {
        source: '/car/:id',
        destination: '/vehicles/:id',
        permanent: true,
      },
      {
        source: '/ev/:id',
        destination: '/vehicles/:id',
        permanent: true,
      },
      // Redirect old search patterns
      {
        source: '/search',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/browse',
        destination: '/vehicles',
        permanent: true,
      }
    ];
  },
  
  // Enable experimental features for better SEO
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
=======
};
>>>>>>> cffef9309ec471162ee5dfd2291f98f76bd7b03d

module.exports = nextConfig;
