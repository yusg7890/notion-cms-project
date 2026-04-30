import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.16', '100.102.34.111'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.notion-static.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
