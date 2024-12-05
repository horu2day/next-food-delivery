/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8082",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
