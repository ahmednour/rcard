/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  reactStrictMode: true,
  // trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
