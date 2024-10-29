/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  basePath: "",
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
