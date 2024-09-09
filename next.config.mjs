/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  basePath: "",

  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
