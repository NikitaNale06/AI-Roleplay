import type { NextConfig } from 'next'
import type { Configuration as WebpackConfig } from 'webpack'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  // Add this for static export
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Add empty turbopack config to fix build error
  turbopack: {},
  
  webpack: (config: WebpackConfig) => {
    // Handle the binary files
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "sharp$": false,
        "onnxruntime-node$": false,
      },
    };
    return config;
  },
  
  // Move serverComponentsExternalPackages to the root level as serverExternalPackages
  serverExternalPackages: ['@xenova/transformers'],
  
  // Keep experimental features here (but remove serverComponentsExternalPackages)
  experimental: {
    // Add other experimental features here if needed
  },
};

export default nextConfig;