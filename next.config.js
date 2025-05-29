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
  },
  // Force disable caching
  generateEtags: false,
}

module.exports = nextConfig
