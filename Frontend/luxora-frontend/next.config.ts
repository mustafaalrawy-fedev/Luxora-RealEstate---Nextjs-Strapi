import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: '127.0.0.1', // Use the IP instead of 'localhost'
  //       port: '1337',
  //       pathname: '/uploads/**',
  //     },
  //     {
  //       protocol: 'http',
  //       hostname: 'localhost',
  //       port: '1337',
  //       pathname: '/uploads/**',
  //     },
  //   ],
  // },
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  },
};

export default nextConfig;
