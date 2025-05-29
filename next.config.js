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
  // Disable experimental features that cause OneDrive issues
  experimental: {
    // Disable features that create symlinks - use empty array instead of false
    optimizePackageImports: [],
  },
  // Configure for Netlify deployment
  images: {
    unoptimized: true,
  },
  // Asset prefix for proper static file serving
  assetPrefix: '',
  // Disable file system cache
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Enable standalone output for better Netlify compatibility
  output: 'standalone',
}

module.exports = nextConfig
