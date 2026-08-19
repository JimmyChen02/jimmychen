/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 88],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
