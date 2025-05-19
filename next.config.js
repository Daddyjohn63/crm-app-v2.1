/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'standalone',
  reactStrictMode: true,

  serverExternalPackages: [
    '@aws-sdk/s3-request-presigner',
    '@aws-sdk/client-s3',
    '@aws-sdk/lib-storage',
    '@aws-sdk/s3-presigned-post'
  ],
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
      },
      {
        protocol: 'https',
        hostname:
          'crm-buddy-database-next-js14-crm-buddy.fbhmyq.easypanel.host',
        pathname: '/api/users/**'
      },
      {
        protocol: 'https',
        hostname:
          'crm-buddy-database-next-js14-crm-buddy.fbhmyq.easypanel.host',
        pathname: '/api/clients/**'
      }
    ]
  }
};

module.exports = nextConfig;
