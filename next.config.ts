import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  experimental: {
    turbo: {
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
};

export default nextConfig;
