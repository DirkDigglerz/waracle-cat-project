import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // if you're using this redirect
      },
      {
        protocol: 'https',
        hostname: 'cdn1.theimageapi.com', // if you're using this redirect
      },
      {
        protocol: 'https',
        hostname: 'cdn1.thecatapi.com', // if you're using this redirect
      },
      {
        protocol: 'https',
        hostname: 'cdn2.thecatapi.com', // if you're using this redirect
      },
    
    ],
  }
};

export default nextConfig;

