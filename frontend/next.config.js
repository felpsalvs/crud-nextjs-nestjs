/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["api.clerk.dev", "img.clerk.com"],
  }
};

module.exports = nextConfig;
