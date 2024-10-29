/** @type {import('next').NextConfig} */
const nextConfig = {
  //distDir: "out",
  basePath: "",

  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
