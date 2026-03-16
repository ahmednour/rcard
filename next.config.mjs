/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  reactStrictMode: true,
  compress: true,
  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
