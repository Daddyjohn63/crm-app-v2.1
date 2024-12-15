/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    output: 'standalone',
    serverComponentsExternalPackages: ['@aws-sdk/s3-request-presigner']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;
