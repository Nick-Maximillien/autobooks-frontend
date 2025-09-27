/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allow all Cloudinary image paths
      },
    ],
  },
  webpack: (config) => {
    config.resolve.extensions.push('.json'); // 👈 Enables JSON imports
    return config;
  },
};

module.exports = nextConfig;
